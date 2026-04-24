# Campus Careers

A HigherEdJobs-style full-stack web application where universities post academic job openings and candidates search, save, and apply to them.

**SWE Project 02 — Spring 2026**

---

## Team

| Member | Role | GitHub |
|---|---|---|
| Hugo Cruz | Project Manager | `Hugo-NCF` / `hugocruz` |
| Jose Araya | Full-Stack Developer | `jaas29` |
| Bruno Valdez | Full-Stack Developer | `brunovaldez` |
| Darius Beckford | Full-Stack Developer | `Raydar` |
| Sebastian Rodriguez | Full-Stack Developer | `sebaasr0` |

### Proof of collaboration

All five members have commits on `main`. Commit counts via `git shortlog -sn`:

```
 5  jaas29            (Jose)     — Firebase wiring, MongoDB sync, bookmarks, seeker flow, seed, week-3 polish
 4  sebaasr0          (Sebastian)— Auth/JWT pipeline, applications, cover-letter upload
 3  Raydar            (Darius)   — Recruiter dashboard, job CRUD, applicants view, company profile
 3  brunovaldez       (Bruno)    — Admin routes, notifications/email, bookmark feature, approval flow
 2  Hugo-NCF/hugocruz (Hugo)     — Project scaffolding, Mongo setup, initial schemas
```

We coordinated work via a shared Trello board and Discord; see `docs/` for Trello/issue screenshots referenced in the demo.

---

## Live Links

- **GitHub repo:** https://github.com/<org>/Project02
- **Frontend (local):** http://localhost:5173
- **Backend API (local):** http://localhost:5050/api
- **Demo video:** (link inside `docs/demo.md` or shared live in class)

---

## Features at a Glance

- Email/password authentication via **Firebase Auth**
- Role-based access control: **Admin**, **Recruiter/Employer**, **Job Seeker**
- Full CRUD for jobs, applications, users, bookmarks, and notifications — with Mongoose schema validation
- **Search & filter** jobs by keyword, location, category, and salary range
- **Pagination** on job list, admin users, admin jobs, and notifications
- **Resume upload** (PDF/DOC) + optional cover letter file via `multer`
- **Bookmark/save** jobs for seekers
- **Email notifications** on application submission (nodemailer)
- **Recruiter approval flow** — admins approve/reject new recruiter accounts
- **Admin stats dashboard** — user/job/application counts
- **Dark mode** toggle persisted across sessions *(extra credit)*
- Responsive layout (works on phone/tablet/desktop)

---

## System Architecture

High-level component diagram — everything a request touches:

```
   ┌──────────────┐    ID token    ┌─────────────┐
   │ React (Vite) │ ─────────────▶ │  Firebase   │
   │   Frontend   │ ◀───────────── │    Auth     │
   └──────┬───────┘                └─────────────┘
          │ Authorization: Bearer <idToken>
          ▼
   ┌──────────────┐    Admin SDK   ┌─────────────┐
   │   Express    │ ─────────────▶ │  Firebase   │
   │   REST API   │                │   Admin     │  (token verify)
   │  (Node.js)   │                └─────────────┘
   └──────┬───────┘
          │ Mongoose
          ▼
   ┌──────────────┐
   │   MongoDB    │  users · jobs · applications · bookmarks · notifications
   └──────────────┘
```

**Interaction summary**

1. User signs up / logs in via Firebase Auth on the client.
2. Client retrieves a Firebase ID token and attaches it to every API call.
3. Express `verifyToken` middleware validates the token using Firebase Admin, finds (or creates) the matching user in MongoDB, and attaches `req.user = { uid, email, name, role }`.
4. `requireRole(...)` gates protected routes by role.
5. Controllers operate on Mongoose models that persist to MongoDB.
6. Uploaded resumes/cover letters are stored in `server/uploads/` and served statically at `/uploads/<filename>`.

---

## Entity-Relationship Diagram

```
  ┌─────────────────┐            ┌──────────────────┐
  │      User       │            │       Job        │
  ├─────────────────┤            ├──────────────────┤
  │ _id  (ObjectId) │◀───────┐   │ _id  (ObjectId)  │
  │ name            │        │   │ title            │
  │ email  (unique) │        │   │ institution      │
  │ role  (enum)    │        │   │ category (enum)  │
  │ profile{...}    │        │   │ location         │
  │ isDisabled      │        │   │ salaryMin/Max    │
  │ recruiterStatus │        └───│ recruiterId  FK  │
  └───────▲─────────┘            │ deadline         │
          │                      │ startDate        │
          │ applicantId          │ status           │
          │ (Firebase uid)       └────────▲─────────┘
          │                               │
  ┌───────┴─────────┐           ┌─────────┴────────┐
  │  Application    │           │    Bookmark      │
  ├─────────────────┤           ├──────────────────┤
  │ _id             │           │ _id              │
  │ jobId       FK  │──────────▶│ jobId       FK   │
  │ applicantId     │           │ userId (uid)     │
  │ resumeUrl       │           │ UNIQUE(user,job) │
  │ coverLetter     │           └──────────────────┘
  │ status (enum)   │
  │ dateApplied     │           ┌──────────────────┐
  │ UNIQUE(job,app) │           │  Notification    │
  └─────────────────┘           ├──────────────────┤
                                │ type (enum)      │
                                │ title, body      │
                                │ read (bool)      │
                                │ relatedId / Model│
                                └──────────────────┘
```

**Validation highlights**

- `User.email`: required, unique, lowercase, regex-validated
- `User.role`: enum `seeker | recruiter | admin`
- `Job.category`: enum of 20 academic categories
- `Job.salaryMax >= salaryMin` (custom validator)
- `Application`: compound unique index on `(jobId, applicantId)` — no duplicate applies
- `Bookmark`: compound unique index on `(userId, jobId)`

---

## Role-Based Flows

### Job Seeker
```
Register ──▶ Login ──▶ Browse /jobs ──▶ Filter (location/category/salary)
                │
                ├──▶ View /jobs/:id ──▶ Bookmark
                │                       └─▶ Apply (upload resume) ──▶ Email confirmation
                │
                └──▶ /seeker dashboard (my applications, saved jobs, profile)
```

### Recruiter / Employer
```
Register (role=recruiter, status=pending)
      │
      ▼
Admin approves ──▶ Login ──▶ /recruiter dashboard
                                 ├─▶ Create/Edit/Delete jobs (owned only)
                                 ├─▶ View applicants per job
                                 ├─▶ Update application status
                                 └─▶ Edit company profile
```

### Admin
```
Login ──▶ /admin
           ├─▶ Dashboard (stats: users, jobs, applications)
           ├─▶ Users (list, disable, delete, approve/reject recruiters)
           ├─▶ Jobs  (list, close, delete inappropriate postings)
           └─▶ Notifications (flagged activity, mark read / dismiss)
```

---

## API Endpoints

Base URL: `/api`

### Public
| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Service heartbeat |
| POST | `/users` | Register user (also called by auth sync) |
| GET | `/jobs` | List/search/filter jobs (q, category, location, salaryMin/Max, page, limit) |
| GET | `/jobs/:id` | Job details |

### Auth required
| Method | Path | Role | Purpose |
|---|---|---|---|
| GET | `/users/me` | any | Current user profile |
| PUT | `/users/:id` | self/admin | Update profile |
| POST | `/jobs` | recruiter | Create job |
| PUT | `/jobs/:id` | recruiter (owner) | Update job |
| DELETE | `/jobs/:id` | recruiter (owner) / admin | Delete job |
| POST | `/applications` | seeker | Submit application + resume upload |
| GET | `/applications/my` | seeker | My applications |
| GET | `/applications/check/:jobId` | seeker | Already applied? |
| GET | `/applications/job/:jobId` | recruiter / admin | Applicants for a job |
| PATCH | `/applications/:id/status` | recruiter / admin | Update status |
| GET, POST, DELETE | `/bookmarks`, `/bookmarks/:jobId` | seeker | Save/unsave/list jobs |
| GET | `/bookmarks/check/:jobId` | seeker | Is bookmarked? |

### Admin-only
| Method | Path | Purpose |
|---|---|---|
| GET | `/admin/users` | Paginated users list |
| GET | `/admin/users/pending-recruiters` | Recruiters awaiting approval |
| PATCH/DELETE | `/admin/users/:id` | Update / remove user |
| POST | `/admin/users/:id/approve` | Approve recruiter |
| POST | `/admin/users/:id/reject` | Reject recruiter (sends email) |
| GET | `/admin/jobs` | Paginated jobs list |
| PATCH/DELETE | `/admin/jobs/:id` | Close / delete job |
| GET, POST | `/notifications` | List / create |
| PATCH | `/notifications/:id/read` | Mark single read |
| POST | `/notifications/mark-all-read` | Mark all read |
| DELETE | `/notifications/:id` | Dismiss |

---

## Database Design

Five MongoDB collections (schemas in `server/models/`):

- **users** — `name`, `email` (unique), `role`, `profile{phone,bio,company,resumeUrl}`, `isDisabled`, `recruiterStatus`
- **jobs** — `title`, `institution`, `category`, `location`, `salaryMin/Max`, `description`, `qualifications`, `deadline`, `startDate`, `recruiterId`, `status`  + text index on `(title, description, institution)`
- **applications** — `jobId` (ref Job), `applicantId` (Firebase uid), `resumeUrl`, `coverLetter`, `coverLetterUrl`, `status`, `dateApplied`  + unique `(jobId, applicantId)`
- **bookmarks** — `userId`, `jobId` (ref Job)  + unique `(userId, jobId)`
- **notifications** — `type`, `title`, `body`, `read`, `relatedId/relatedModel`

Seed script populates the rubric-required dataset:

```
2   admin accounts
10  recruiters (each with a company portfolio)
20  job seekers
100 jobs across 20 academic categories
+ sample applications and bookmarks for demo realism
```

Run with `npm run seed` from `/server`.

---

## Project Structure

```
Project02/
├── client/                       # React frontend (Vite)
│   └── src/
│       ├── components/           # Layout, Navbar, admin/AdminLayout
│       ├── context/              # AuthContext, DarkModeContext
│       ├── pages/                # 18 pages: Home, Login, Jobs, JobDetail,
│       │                         #   ApplyForm, SeekerDashboard, ProfileEdit,
│       │                         #   RecruiterDashboard, CreateJob, EditJob,
│       │                         #   Applicants, CompanyProfile,
│       │                         #   AdminDashboard, AdminUsers, AdminJobs,
│       │                         #   AdminNotifications, Register, NotFound
│       ├── routes/ProtectedRoute.jsx
│       └── services/             # api.js (fetch wrapper), firebase.js
├── server/                       # Express REST API
│   ├── config/                   # db.js (Mongo), firebase.js (Admin SDK)
│   ├── controllers/              # 6 controllers (job, user, admin, application, bookmark, notification)
│   ├── middleware/               # verifyToken, requireRole, validateObjectId, upload, errorHandler
│   ├── models/                   # 5 Mongoose schemas
│   ├── routes/                   # 6 route modules
│   ├── utils/                    # email.js, seed.js
│   └── server.js
└── docs/                         # Diagrams, demo assets
```

---

## Setup & Run Locally

**Prereqs:** Node 18+, MongoDB (local or Atlas), a Firebase project.

```bash
# 1. Clone
git clone <repo-url> && cd Project02

# 2. Backend
cd server
cp .env.example .env          # fill in MONGO_URI, FIREBASE_*, ADMIN_EMAIL, SMTP_*
npm install
npm run seed                  # populate demo data (optional but recommended)
npm run dev                   # http://localhost:5050

# 3. Frontend (new terminal)
cd ../client
cp .env.example .env.local    # fill in VITE_FIREBASE_* and VITE_API_URL
npm install
npm run dev                   # http://localhost:5173
```

**Demo accounts** (after running the seed):
- Admin: `admin1@campus.edu` / `Password123!`
- Recruiter: `recruiter1@campus.edu` / `Password123!`
- Seeker: `seeker1@campus.edu` / `Password123!`

---

## Development Stages (what we actually shipped)

| Week | Milestone | Status |
|---|---|---|
| 1 | Frontend + Firebase Auth, role-based routes, mock data | ✅ |
| 2 | Express REST API, CRUD, admin flows, notifications, bookmarks, recruiter approval | ✅ |
| 3 | MongoDB integration, seed 100+ jobs, polish, dark mode, resume uploads, demo | ✅ |

---

## Challenges Faced

- **Token syncing** — ensuring the Firebase UID maps cleanly to a MongoDB User on first login without duplicate records. Solved in `verifyToken` by upserting on `email`.
- **Mock vs. real auth** — we built a base64 token fallback so frontend devs could work without Firebase credentials, toggled by `VITE_USE_MOCK_AUTH`.
- **Duplicate applications/bookmarks** — solved with compound unique Mongo indexes rather than app-level checks.
- **Recruiter ownership** — enforcing that recruiters can only edit/delete their own jobs without breaking admin overrides. Handled in the controllers by checking `req.user.role === "admin" || job.recruiterId == req.user._id`.
- **File uploads** — switched from storing Base64 in Mongo to `multer` disk storage + static `/uploads` route, keeps documents out of the DB.

---

## Extra Credit

- **Dark mode** — `DarkModeContext` with a toggle in the navbar, preference persisted to `localStorage`, Tailwind `dark:` variants throughout.
- **Custom auth middleware** — `server/middleware/verifyToken.js` performs its own token verification (Firebase Admin for real tokens, base64 payload for dev) and handles user provisioning, rather than relying on Firebase client callbacks.
