/**
 * Campus Careers seed script.
 *
 * Populates MongoDB with:
 *   - 2 admin accounts
 *   - 10 employers (recruiters) with company portfolio
 *   - 20 job seekers
 *   - 100 jobs across 20 categories
 *   - Sample applications and bookmarks for demo realism
 *
 * Run: `node utils/seed.js` from /server (with MONGO_URI set in .env)
 */

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");

const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Bookmark = require("../models/Bookmark");

const CATEGORIES = [
  "Faculty",
  "Research",
  "Administration",
  "Staff",
  "Postdoc",
  "Adjunct",
  "Student Affairs",
  "Library",
  "Information Technology",
  "Athletics",
  "Development",
  "Communications",
  "Finance",
  "Human Resources",
  "Facilities",
  "Admissions",
  "Registrar",
  "Health Services",
  "Counseling",
  "Dining Services",
];

const INSTITUTIONS = [
  { name: "New College of Florida", city: "Sarasota, FL" },
  { name: "University of Florida", city: "Gainesville, FL" },
  { name: "Florida State University", city: "Tallahassee, FL" },
  { name: "Stanford University", city: "Stanford, CA" },
  { name: "MIT", city: "Cambridge, MA" },
  { name: "University of Michigan", city: "Ann Arbor, MI" },
  { name: "UC Berkeley", city: "Berkeley, CA" },
  { name: "Harvard University", city: "Cambridge, MA" },
  { name: "Columbia University", city: "New York, NY" },
  { name: "University of Washington", city: "Seattle, WA" },
];

// Placeholder hash — real auth goes through Firebase. The passwordHash field
// is required by the User schema but unused in the live login flow.
const PLACEHOLDER_HASH = "$2b$10$seedPlaceholderHashNotUsedForAuthXXXXXXXXXX";

const TITLE_POOL = {
  Faculty: ["Assistant Professor of {dept}", "Associate Professor of {dept}", "Professor of {dept}", "Lecturer in {dept}", "Visiting Professor of {dept}"],
  Research: ["Research Scientist", "Research Associate", "Principal Investigator", "Lab Manager", "Research Coordinator"],
  Administration: ["Dean of {college}", "Department Chair", "Program Director", "Academic Affairs Officer", "Executive Assistant to the Provost"],
  Staff: ["Administrative Assistant", "Program Coordinator", "Operations Manager", "Department Secretary", "Office Manager"],
  Postdoc: ["Postdoctoral Fellow in {dept}", "Postdoctoral Researcher", "Postdoctoral Associate", "NIH Postdoctoral Fellow", "NSF Postdoctoral Fellow"],
  Adjunct: ["Adjunct Instructor of {dept}", "Adjunct Professor of {dept}", "Adjunct Lecturer", "Part-Time Faculty in {dept}", "Contract Faculty"],
  "Student Affairs": ["Director of Student Affairs", "Residence Life Coordinator", "Student Success Advisor", "Greek Life Coordinator", "Student Activities Manager"],
  Library: ["Reference Librarian", "Archives Specialist", "Digital Services Librarian", "Head of Cataloging", "Research Librarian"],
  "Information Technology": ["Systems Administrator", "Help Desk Technician", "Network Engineer", "Application Developer", "IT Security Analyst"],
  Athletics: ["Assistant Coach - Basketball", "Head Coach - Soccer", "Athletic Trainer", "Strength and Conditioning Coach", "Athletic Director"],
  Development: ["Development Officer", "Director of Annual Giving", "Major Gifts Officer", "Alumni Relations Coordinator", "Grant Writer"],
  Communications: ["Communications Specialist", "Social Media Manager", "Public Relations Officer", "Content Writer", "Director of Communications"],
  Finance: ["Financial Analyst", "Budget Coordinator", "Staff Accountant", "Controller", "Payroll Specialist"],
  "Human Resources": ["HR Generalist", "Recruiter", "Benefits Coordinator", "HR Business Partner", "Director of HR"],
  Facilities: ["Facilities Manager", "Maintenance Technician", "Groundskeeper", "Custodial Supervisor", "HVAC Technician"],
  Admissions: ["Admissions Counselor", "Assistant Director of Admissions", "Transfer Admissions Officer", "International Admissions Coordinator", "Admissions Events Manager"],
  Registrar: ["Assistant Registrar", "Transcript Specialist", "Registrar", "Degree Audit Coordinator", "Academic Records Assistant"],
  "Health Services": ["Staff Nurse", "Physician Assistant", "Health Educator", "Medical Assistant", "Director of Student Health"],
  Counseling: ["Staff Counselor", "Clinical Psychologist", "Wellness Coordinator", "Outreach Therapist", "Director of Counseling"],
  "Dining Services": ["Dining Services Manager", "Executive Chef", "Sous Chef", "Nutrition Coordinator", "Food Service Supervisor"],
};

const DEPARTMENTS = ["Computer Science", "Mathematics", "Biology", "Chemistry", "Physics", "Psychology", "English", "History", "Economics", "Engineering"];
const COLLEGES = ["Arts and Sciences", "Engineering", "Business", "Education", "Medicine"];

const FIRST_NAMES = ["Jose", "Maria", "Juan", "Ana", "Carlos", "Sofia", "Luis", "Camila", "Diego", "Valentina", "Andres", "Lucia", "Miguel", "Isabella", "Pablo", "Elena", "Sebastian", "Gabriela", "Mateo", "Valeria", "Nicolas", "Martina", "Alejandro", "Emma", "Daniel", "Olivia", "David", "Ava", "James", "Mia"];
const LAST_NAMES = ["Garcia", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Perez", "Sanchez", "Ramirez", "Torres", "Flores", "Rivera", "Gomez", "Diaz", "Cruz", "Morales", "Reyes", "Gutierrez", "Ortiz", "Chavez", "Smith", "Johnson", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson"];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function randomDate(daysFromNow, spreadDays) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow + randInt(0, spreadDays));
  return d;
}

function fillTitle(template) {
  return template
    .replace("{dept}", pick(DEPARTMENTS))
    .replace("{college}", pick(COLLEGES));
}

function jobDescription(title, institution, category) {
  return `${institution} seeks a qualified candidate for the ${title} position in our ${category} division. The successful candidate will contribute to the institution's mission through teaching, research, service, or operations as appropriate to the role. Responsibilities include collaborating with colleagues, engaging with students, and supporting institutional goals. We offer a competitive salary, comprehensive benefits, and a supportive academic environment. Number of openings: ${randInt(1, 4)}. Expected experience: ${randInt(0, 8)}+ years in a related field.`;
}

function jobQualifications(category) {
  const base = [
    "Bachelor's degree required; advanced degree preferred",
    "Excellent written and verbal communication skills",
    "Ability to work collaboratively in a team environment",
    "Demonstrated commitment to diversity, equity, and inclusion",
  ];
  if (["Faculty", "Research", "Postdoc", "Adjunct"].includes(category)) {
    base.push("PhD or terminal degree in a related field");
    base.push("Record of scholarly publications and/or teaching experience");
  }
  return base.join("\n- ");
}

async function seed() {
  console.log("Connecting to MongoDB...");
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    Job.deleteMany({}),
    Application.deleteMany({}),
    Bookmark.deleteMany({}),
  ]);

  // --- Admins ---
  console.log("Creating 2 admins...");
  const admins = await User.insertMany([
    {
      name: "Admin One",
      email: "admin1@campuscareers.edu",
      passwordHash: PLACEHOLDER_HASH,
      role: "admin",
      profile: { phone: "555-0101", bio: "Platform administrator" },
    },
    {
      name: "Admin Two",
      email: "admin2@campuscareers.edu",
      passwordHash: PLACEHOLDER_HASH,
      role: "admin",
      profile: { phone: "555-0102", bio: "Platform administrator" },
    },
  ]);

  // --- Recruiters ---
  console.log("Creating 10 recruiters (employers)...");
  const recruiterDocs = INSTITUTIONS.map((inst, i) => ({
    name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
    email: `recruiter${i + 1}@${inst.name.toLowerCase().replace(/[^a-z]/g, "")}.edu`,
    passwordHash: PLACEHOLDER_HASH,
    role: "recruiter",
    recruiterStatus: "approved",
    profile: {
      phone: `555-02${String(i).padStart(2, "0")}`,
      company: inst.name,
      bio: `Lead talent acquisition partner at ${inst.name}. We recruit exceptional faculty, staff, and researchers to advance our mission of education and discovery. Located in ${inst.city}, our institution is committed to excellence and diversity.`,
    },
  }));
  const recruiters = await User.insertMany(recruiterDocs);

  // --- Seekers ---
  console.log("Creating 20 seekers...");
  const seekerDocs = Array.from({ length: 20 }, (_, i) => {
    const first = pick(FIRST_NAMES);
    const last = pick(LAST_NAMES);
    return {
      name: `${first} ${last}`,
      email: `seeker${i + 1}.${last.toLowerCase()}@example.com`,
      passwordHash: PLACEHOLDER_HASH,
      role: "seeker",
      profile: {
        phone: `555-03${String(i).padStart(2, "0")}`,
        bio: `Recent graduate with experience in ${pick(DEPARTMENTS)}. Passionate about higher education and looking for opportunities to contribute to a university community.`,
        resumeUrl: `/uploads/sample-resume-${i + 1}.pdf`,
      },
    };
  });
  const seekers = await User.insertMany(seekerDocs);

  // --- Jobs (100 across 20 categories = 5 per category) ---
  console.log("Creating 100 jobs across 20 categories...");
  const jobs = [];
  for (const category of CATEGORIES) {
    const templates = TITLE_POOL[category];
    for (let i = 0; i < 5; i++) {
      const recruiter = pick(recruiters);
      const institution = recruiter.profile.company;
      const instMeta = INSTITUTIONS.find((x) => x.name === institution);
      const title = fillTitle(templates[i % templates.length]);
      const salaryMin = randInt(40, 120) * 1000;
      const salaryMax = salaryMin + randInt(10, 60) * 1000;

      jobs.push({
        title,
        institution,
        category,
        location: instMeta ? instMeta.city : "Remote",
        salaryMin,
        salaryMax,
        description: jobDescription(title, institution, category),
        qualifications: "- " + jobQualifications(category),
        deadline: randomDate(14, 60),
        startDate: randomDate(60, 90),
        recruiterId: recruiter._id,
        status: Math.random() < 0.9 ? "active" : "closed",
      });
    }
  }
  const createdJobs = await Job.insertMany(jobs);

  // --- Applications (~60 — 2-4 per seeker on random jobs) ---
  console.log("Creating sample applications...");
  const appDocs = [];
  const seen = new Set();
  for (const seeker of seekers) {
    const n = randInt(2, 4);
    for (let i = 0; i < n; i++) {
      const job = pick(createdJobs);
      const key = `${job._id}-${seeker._id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      appDocs.push({
        jobId: job._id,
        applicantId: seeker._id.toString(),
        resumeUrl: seeker.profile.resumeUrl || `/uploads/resume-${seeker._id}.pdf`,
        coverLetter: `Dear Hiring Committee,\n\nI am excited to apply for the ${job.title} position at ${job.institution}. My background in ${pick(DEPARTMENTS)} has prepared me well for this role, and I would welcome the opportunity to contribute to your institution.\n\nSincerely,\n${seeker.name}`,
        status: pick(["pending", "pending", "pending", "reviewed", "interviewing"]),
      });
    }
  }
  await Application.insertMany(appDocs);

  // --- Bookmarks (~40) ---
  console.log("Creating sample bookmarks...");
  const bmDocs = [];
  const bmSeen = new Set();
  for (const seeker of seekers) {
    const n = randInt(1, 3);
    for (let i = 0; i < n; i++) {
      const job = pick(createdJobs);
      const key = `${job._id}-${seeker._id}`;
      if (bmSeen.has(key)) continue;
      bmSeen.add(key);
      bmDocs.push({ userId: seeker._id.toString(), jobId: job._id });
    }
  }
  await Bookmark.insertMany(bmDocs);

  console.log("\n=== Seed complete ===");
  console.log(`Admins:       ${admins.length}`);
  console.log(`Recruiters:   ${recruiters.length}`);
  console.log(`Seekers:      ${seekers.length}`);
  console.log(`Jobs:         ${createdJobs.length} across ${CATEGORIES.length} categories`);
  console.log(`Applications: ${appDocs.length}`);
  console.log(`Bookmarks:    ${bmDocs.length}`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
