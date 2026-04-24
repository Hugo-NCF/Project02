import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jobApi } from "../services/api";

function daysSince(dateStr) {
  const days = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 86_400_000
  );
  if (days === 0) return "Posted today";
  if (days === 1) return "Posted 1 day ago";
  return `Posted ${days} days ago`;
}

const CATEGORY_BADGE = {
  Faculty: "bg-secondary/15 text-secondary dark:bg-brass/15 dark:text-brass",
  Research: "bg-brass/15 text-brass",
  Administration:
    "bg-primary/10 text-primary dark:bg-[#fbf9f4]/10 dark:text-[#fbf9f4]",
};

export default function RecruiterDashboard() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("live");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    jobApi.getAll({ recruiterId: currentUser.uid, limit: 100 })
      .then(({ items }) => setJobs(items))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, [currentUser]);

  const activeJobs = jobs.filter((j) => j.status === "active");
  const closedJobs = jobs.filter((j) => j.status === "closed");

  const displayJobs =
    activeTab === "live"
      ? activeJobs
      : activeTab === "archived"
        ? closedJobs
        : [];

  async function handleDelete(jobId) {
    if (!confirm("Are you sure you want to delete this posting?")) return;
    try {
      await jobApi.delete(jobId);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err) {
      alert(err.message || "Failed to delete posting.");
    }
  }

  if (currentUser?.recruiterStatus === "pending") {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6 py-16">
        <div className="max-w-lg w-full text-center space-y-6">
          <span className="material-symbols-outlined text-[56px] text-amber-500">hourglass_top</span>
          <h1 className="font-headline italic text-3xl text-primary dark:text-[#fbf9f4]">
            Account Pending Approval
          </h1>
          <p className="text-on-surface-variant dark:text-[#828796] leading-relaxed">
            Your recruiter account is awaiting admin verification. You'll receive
            an email once your credentials are confirmed and your account is
            activated.
          </p>
          <div className="border-t border-outline-variant/30 dark:border-[#1a202c] pt-6">
            <p className="text-xs uppercase tracking-widest text-secondary dark:text-brass">
              Approval typically takes 1–2 business days
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background dark:bg-[#030813] min-h-screen text-on-surface dark:text-[#fbf9f4]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* ── Header ──────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary dark:text-brass">
              Operational Command
            </span>
            <h1 className="font-headline italic text-4xl md:text-5xl text-primary dark:text-[#fbf9f4] mt-2">
              Recruiter Dashboard
            </h1>
            <p className="mt-2 text-sm italic text-on-surface-variant dark:text-[#828796]">
              Overseeing recruitment for{" "}
              {currentUser?.name || "your institution"}.
            </p>
          </div>
          <Link
            to="/recruiter/create-job"
            className="flex items-center gap-2 bg-primary dark:bg-[#fbf9f4] text-on-primary dark:text-[#030813] px-6 py-3 text-[11px] font-bold uppercase tracking-widest hover:opacity-80 transition-opacity self-start md:self-auto"
          >
            <span className="text-lg leading-none">+</span> Post a New Position
          </Link>
        </div>

        <div className="h-px bg-outline-variant/30 dark:bg-[#1a202c] mb-10" />

        {/* ── Stats Strip ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            {
              value: activeJobs.length,
              label: "Active Postings",
              sub: `${closedJobs.length} archived`,
            },
            {
              value: "—",
              label: "Total Applicants",
              sub: "View per posting",
            },
            {
              value: jobs.length,
              label: "Total Postings",
              sub: "All time",
            },
          ].map(({ value, label, sub }) => (
            <div
              key={label}
              className="bg-surface-container-low dark:bg-[#0d1829] border border-outline-variant/20 dark:border-[#1a202c] p-6"
            >
              <span className="text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass block mb-2">
                {label}
              </span>
              <span className="font-headline text-4xl font-bold text-primary dark:text-[#fbf9f4]">
                {value}
              </span>
              <span className="block text-[12px] text-on-surface-variant dark:text-[#828796] mt-1">
                {sub}
              </span>
            </div>
          ))}
        </div>

        {/* ── Active Postings ─────────────────────────────── */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h2 className="font-headline italic text-3xl text-primary dark:text-[#fbf9f4]">
            Active Postings
          </h2>
          <div className="flex gap-4">
            {["live", "drafts", "archived"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${
                  activeTab === tab
                    ? "text-primary dark:text-[#fbf9f4] border-b border-primary dark:border-[#fbf9f4] pb-0.5"
                    : "text-on-surface-variant dark:text-[#828796] hover:text-primary dark:hover:text-[#fbf9f4]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── Job Rows ────────────────────────────────────── */}
        <div className="border-t border-outline-variant/20 dark:border-[#1a202c]">
          {displayJobs.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-on-surface-variant dark:text-[#828796] italic">
                {activeTab === "drafts"
                  ? "No draft postings."
                  : activeTab === "archived"
                    ? "No archived postings."
                    : "No active postings yet."}
              </p>
              {activeTab === "live" && (
                <Link
                  to="/recruiter/create-job"
                  className="mt-4 inline-block text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass hover:underline"
                >
                  Create your first posting →
                </Link>
              )}
            </div>
          ) : (
            displayJobs.map((job) => {
              return (
                <div
                  key={job._id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 border-b border-outline-variant/20 dark:border-[#1a202c]"
                >
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                          CATEGORY_BADGE[job.category] ||
                          CATEGORY_BADGE.Faculty
                        }`}
                      >
                        {job.category}
                      </span>
                      <span className="text-[11px] text-on-surface-variant dark:text-[#828796]">
                        Ref: #{job._id}
                      </span>
                    </div>
                    <h3 className="font-headline italic text-xl text-primary dark:text-[#fbf9f4] leading-snug">
                      {job.title}
                    </h3>
                    <p className="text-[12px] text-on-surface-variant dark:text-[#828796] mt-1">
                      {job.department || job.institution} ·{" "}
                      {daysSince(job.createdAt)}
                    </p>
                  </div>

                  {/* Counts */}
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] block">
                        Applicants
                      </span>
                      <span className="font-headline text-xl text-primary dark:text-[#fbf9f4]">
                        —
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] block">
                        Deadline
                      </span>
                      <span className="font-headline text-sm text-primary dark:text-[#fbf9f4]">
                        {new Date(job.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/recruiter/edit-job/${job._id}`}
                      title="Edit"
                      className="flex h-10 w-10 items-center justify-center border border-outline-variant/30 dark:border-[#1a202c] text-on-surface-variant dark:text-[#828796] hover:text-primary dark:hover:text-[#fbf9f4] hover:border-primary dark:hover:border-[#fbf9f4] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        edit
                      </span>
                    </Link>
                    <Link
                      to={`/recruiter/jobs/${job._id}/applicants`}
                      title="View applicants"
                      className="flex h-10 w-10 items-center justify-center border border-outline-variant/30 dark:border-[#1a202c] text-on-surface-variant dark:text-[#828796] hover:text-primary dark:hover:text-[#fbf9f4] hover:border-primary dark:hover:border-[#fbf9f4] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        visibility
                      </span>
                    </Link>
                    <button
                      onClick={() => handleDelete(job._id)}
                      title="Delete"
                      className="flex h-10 w-10 items-center justify-center border border-outline-variant/30 dark:border-[#1a202c] text-on-surface-variant dark:text-[#828796] hover:text-error hover:border-error transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        delete
                      </span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* View-all link */}
        {displayJobs.length > 0 && (
          <div className="text-center py-8">
            <span className="text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass italic">
              View all {displayJobs.length} active postings →
            </span>
          </div>
        )}

        {/* ── Institutional Reach Report CTA ──────────────── */}
        <div className="mt-8 bg-primary dark:bg-[#0a1220] p-10 md:p-12 flex flex-col md:flex-row justify-between gap-8">
          <div className="flex-1">
            <h3 className="font-headline italic text-2xl md:text-3xl text-on-primary mt-1">
              Institutional Reach Report
            </h3>
            <p className="mt-4 text-sm text-on-primary-container max-w-md leading-relaxed">
              Your postings are reaching candidates through our institutional
              partner network. Review your impact to optimize for the next
              semester cycle.
            </p>
            <Link
              to="/recruiter/company-profile"
              className="mt-6 inline-block border border-on-primary-container/40 text-on-primary px-6 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-on-primary hover:text-primary transition-colors"
            >
              Company Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
