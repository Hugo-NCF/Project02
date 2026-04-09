# Campus Careers

A HigherEdJobs-style full-stack web application for academic job postings.

**SWE Project 02 -- Spring 2026**

## Team
- Hugo Cruz -- Project Manager
- Jose Araya -- Full Stack Developer
- Bruno Valdez -- Full Stack Developer
- Darius Beckford -- Full Stack Developer
- Sebastian Rodriguez -- Full Stack Developer

## Tech Stack
- **Frontend**: React (Vite) + React Router
- **Auth**: Firebase Authentication
- **Backend**: Node.js + Express
- **Database**: MongoDB (via Mongoose)

## Project Structure
```
Project02/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/     # Shared/reusable components
│       ├── context/        # React Context (Auth, etc.)
│       ├── pages/          # Page components
│       ├── routes/         # Route definitions, ProtectedRoute
│       ├── services/       # API client, Firebase config
│       ├── styles/
│       └── utils/
├── server/                 # Express backend
│   ├── config/             # DB, Firebase Admin config
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Auth, role checks
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routes
│   └── utils/
└── docs/                   # System diagrams, report
```

## Development Stages
1. **Week 1** -- Frontend + Firebase Auth with mock data
2. **Week 2** -- Express REST API + CRUD (in-memory)
3. **Week 3** -- MongoDB integration + polish + demo

## User Roles
- **Admin** -- manage users and job postings
- **Recruiter** -- create/manage job postings, view applicants
- **Job Seeker** -- search/apply for jobs, track applications

## Setup (TBD once scaffolded)
```bash
# Frontend
cd client
npm install
npm run dev

# Backend
cd server
npm install
npm run dev
```
