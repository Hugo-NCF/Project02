import { Link, useParams } from "react-router-dom";
import mockJobs from "../services/mockJobs.json";
import mockUsers from "../services/mockUsers.json";

const APPS_KEY = "campus_careers_applications";
const RECRUITER_JOBS_KEY = "campus_careers_recruiter_jobs";

function getApplications() {
  try {
    return JSON.parse(localStorage.getItem(APPS_KEY) || "[]");
  } catch {
    return [];
  }
}

function getLocalJobs() {
  try {
    return JSON.parse(localStorage.getItem(RECRUITER_JOBS_KEY) || "[]");
  } catch {
    return [];
  }
}

const STATUS_STYLE = {
  pending:
    "bg-secondary/10 text-secondary dark:bg-brass/10 dark:text-brass",
  reviewed:
    "bg-primary/10 text-primary dark:bg-[#fbf9f4]/10 dark:text-[#fbf9f4]",
};

export default function Applicants() {
  const { id } = useParams();
  const allJobs = [...mockJobs, ...getLocalJobs()];
  const job = allJobs.find((j) => j.id === id);
  const applications = getApplications().filter((a) => a.jobId === id);

  if (!job) {
    return (
      <div className="bg-background dark:bg-[#030813] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="font-headline italic text-3xl text-on-surface-variant dark:text-[#45474c]">
            Position not found.
          </span>
          <Link to="/recruiter" className="mt-6 block text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background dark:bg-[#030813] min-h-screen text-on-surface dark:text-[#fbf9f4]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Link
          to="/recruiter"
          className="text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass hover:underline"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-6 mb-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary dark:text-brass">
            Applicants
          </span>
          <h1 className="font-headline italic text-4xl text-primary dark:text-[#fbf9f4] mt-2">
            {job.title}
          </h1>
          <p className="mt-1 text-sm italic text-on-surface-variant dark:text-[#828796]">
            {job.institution} · {job.location}
          </p>
        </div>

        <div className="h-px bg-outline-variant/30 dark:bg-[#1a202c] mb-8" />

        {applications.length === 0 ? (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 dark:text-[#1a202c]">
              group
            </span>
            <p className="mt-4 text-on-surface-variant dark:text-[#828796] italic">
              No applications received yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-on-surface-variant dark:text-[#828796] mb-4">
              {applications.length} application{applications.length !== 1 ? "s" : ""} received
            </p>
            {applications.map((app, i) => {
              const user = mockUsers.find(
                (u) => u.id === app.applicantId
              );
              return (
                <div
                  key={i}
                  className="bg-surface-container-low dark:bg-[#0d1829] border border-outline-variant/20 dark:border-[#1a202c] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline italic text-lg text-primary dark:text-[#fbf9f4]">
                      {user?.name || app.applicantId}
                    </h3>
                    <p className="text-[12px] text-on-surface-variant dark:text-[#828796] mt-1">
                      {user?.email || "—"} · Applied{" "}
                      {new Date(app.dateApplied).toLocaleDateString()}
                    </p>
                    {app.coverLetter && (
                      <p className="text-sm text-on-surface-variant dark:text-[#828796] mt-3 line-clamp-2">
                        {app.coverLetter}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {app.resumeUrl && (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass hover:underline"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          description
                        </span>
                        Resume
                      </a>
                    )}
                    <span
                      className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                        STATUS_STYLE[app.status] || STATUS_STYLE.pending
                      }`}
                    >
                      {app.status || "pending"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
