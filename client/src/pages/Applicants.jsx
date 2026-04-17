import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { applicationApi } from "../services/api";
import mockJobs from "../services/mockJobs.json";

const RECRUITER_JOBS_KEY = "campus_careers_recruiter_jobs";

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
  interviewing:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
};

export default function Applicants() {
  const { id } = useParams();
  const { currentUser } = useAuth();

  const allJobs = [...mockJobs, ...getLocalJobs()];
  const job = allJobs.find((j) => j.id === id || j._id === id);
  const isOwner = job && (job.recruiterId === currentUser?.uid);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || !isOwner) {
      setLoading(false);
      return;
    }
    applicationApi
      .getByJob(id)
      .then((res) => setApplications(res.items || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isOwner]);

  async function handleStatusChange(appId, newStatus) {
    try {
      const updated = await applicationApi.updateStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: updated.status } : a))
      );
    } catch (err) {
      alert(err.message || "Failed to update status");
    }
  }

  if (!job || !isOwner) {
    return (
      <div className="bg-background dark:bg-[#030813] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="font-headline italic text-3xl text-on-surface-variant dark:text-[#45474c]">
            {!job ? "Position not found." : "You don't have access to this posting."}
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

        {loading ? (
          <div className="py-16 text-center">
            <p className="text-on-surface-variant dark:text-[#828796] italic">Loading applications…</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="text-error italic">{error}</p>
          </div>
        ) : applications.length === 0 ? (
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
            {applications.map((app) => (
                <div
                  key={app._id}
                  className="bg-surface-container-low dark:bg-[#0d1829] border border-outline-variant/20 dark:border-[#1a202c] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline italic text-lg text-primary dark:text-[#fbf9f4]">
                      {app.applicantId}
                    </h3>
                    <p className="text-[12px] text-on-surface-variant dark:text-[#828796] mt-1">
                      Applied{" "}
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
                        href={app.resumeUrl.startsWith("/") ? `${import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5050"}${app.resumeUrl}` : app.resumeUrl}
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
                    <select
                      value={app.status || "pending"}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      className="bg-surface-container dark:bg-[#0d1829] border border-outline-variant/30 dark:border-[#1a202c] text-[11px] font-bold uppercase tracking-widest text-primary dark:text-[#fbf9f4] px-2 py-1 focus:outline-none focus:border-secondary dark:focus:border-brass"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="interviewing">Interviewing</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
