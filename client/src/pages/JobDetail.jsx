import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jobApi } from "../services/api";

const CATEGORY_STYLE = {
  Faculty:        "text-secondary dark:text-brass border-secondary dark:border-brass",
  Research:       "text-brass border-brass",
  Administration: "text-primary dark:text-[#fbf9f4] border-primary dark:border-[#fbf9f4]",
};

export default function JobDetail() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [job,     setJob]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    jobApi.getById(id)
      .then(setJob)
      .catch((err) => setError(err.status === 404 ? "not_found" : err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="bg-background dark:bg-[#030813] min-h-screen flex items-center justify-center">
        <span className="font-headline italic text-2xl text-on-surface-variant dark:text-[#45474c]">
          Loading…
        </span>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="bg-background dark:bg-[#030813] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="font-headline italic text-3xl text-on-surface-variant dark:text-[#45474c]">
            Position not found.
          </span>
          <Link
            to="/jobs"
            className="mt-6 block text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass hover:underline"
          >
            ← Back to all positions
          </Link>
        </div>
      </div>
    );
  }

  const isActive = job.status === "active";
  const deadlineDate = job.deadline
    ? new Date(job.deadline).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "—";
  const startDate = job.startDate
    ? new Date(job.startDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "—";

  function handleApply() {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    navigate(`/jobs/${job._id}/apply`);
  }

  return (
    <div className="bg-background dark:bg-[#030813] min-h-screen text-on-surface dark:text-[#fbf9f4]">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#45474c]">
          <Link to="/jobs" className="hover:text-secondary dark:hover:text-brass transition-colors">
            Browse Jobs
          </Link>
          <span>/</span>
          <span className="text-primary dark:text-[#fbf9f4]">{job.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* ── Main ─────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span
                className={`text-[10px] font-bold uppercase tracking-widest border px-2 py-0.5 ${
                  CATEGORY_STYLE[job.category] || "text-secondary border-secondary dark:text-brass dark:border-brass"
                }`}
              >
                {job.category}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest ${
                  isActive ? "text-secondary dark:text-brass" : "text-on-surface-variant dark:text-[#45474c]"
                }`}
              >
                {isActive ? "● Active" : "● Closed"}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-headline italic text-4xl md:text-5xl text-primary dark:text-[#fbf9f4] leading-[1.1]">
              {job.title}
            </h1>

            <p className="mt-3 text-lg italic text-on-surface-variant dark:text-[#828796]">
              {job.institution}
            </p>
            <p className="mt-0.5 text-[13px] text-on-surface-variant dark:text-[#45474c]">
              {job.department} · {job.location}
            </p>

            {/* Divider */}
            <div className="my-10 h-px bg-outline-variant/30 dark:bg-[#1a202c]" />

            {/* Description */}
            <section className="mb-10">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary dark:text-brass">
                Role Overview
              </span>
              <p className="mt-4 text-[15px] leading-relaxed text-on-surface dark:text-[#c8cad3]">
                {job.description}
              </p>
            </section>

            {/* Qualifications */}
            {job.qualifications && (
              <section className="mb-10">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary dark:text-brass">
                  Essential Qualifications
                </span>
                <p className="mt-4 text-[15px] leading-relaxed text-on-surface dark:text-[#c8cad3]">
                  {job.qualifications}
                </p>
              </section>
            )}

            {/* Divider */}
            <div className="h-px bg-outline-variant/30 dark:bg-[#1a202c]" />

            {/* Mobile apply button */}
            <div className="mt-8 lg:hidden">
              {isActive ? (
                <button
                  onClick={handleApply}
                  className="w-full bg-primary dark:bg-[#fbf9f4] text-on-primary dark:text-[#030813] py-4 text-[11px] font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
                >
                  Apply for this Position
                </button>
              ) : (
                <div className="w-full bg-surface-container-low dark:bg-[#0d1829] border border-outline-variant/30 dark:border-[#1a202c] py-4 text-center text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#45474c]">
                  This position is closed
                </div>
              )}
            </div>
          </div>

          {/* ── Sidebar ──────────────────────────────────────── */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-6">

              {/* Apply CTA */}
              <div className="bg-surface-container-low dark:bg-[#0d1829] border border-outline-variant/20 dark:border-[#1a202c] p-6">
                {isActive ? (
                  <>
                    <button
                      onClick={handleApply}
                      className="w-full bg-primary dark:bg-[#fbf9f4] text-on-primary dark:text-[#030813] py-3.5 text-[11px] font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
                    >
                      Apply for this Position
                    </button>
                    {!currentUser && (
                      <p className="mt-3 text-[11px] text-on-surface-variant dark:text-[#45474c] text-center">
                        You must{" "}
                        <Link to="/login" className="text-secondary dark:text-brass hover:underline">
                          sign in
                        </Link>{" "}
                        to apply.
                      </p>
                    )}
                  </>
                ) : (
                  <div className="py-2 text-center text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#45474c]">
                    Applications Closed
                  </div>
                )}
              </div>

              {/* Key details */}
              <div className="bg-surface-container-low dark:bg-[#0d1829] border border-outline-variant/20 dark:border-[#1a202c] p-6 space-y-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary dark:text-brass">
                  Position Details
                </p>

                {[
                  { label: "Institution", value: job.institution },
                  { label: "Department",  value: job.department },
                  { label: "Location",    value: job.location },
                  { label: "Category",    value: job.category },
                  {
                    label: "Salary Range",
                    value: job.salaryMin && job.salaryMax
                      ? `$${job.salaryMin.toLocaleString()} – $${job.salaryMax.toLocaleString()}`
                      : "Not specified",
                  },
                  { label: "Deadline",   value: deadlineDate },
                  { label: "Start Date", value: startDate },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-[#45474c]">
                      {label}
                    </span>
                    <span className="block text-[13px] text-primary dark:text-[#fbf9f4] mt-0.5">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Back link */}
              <Link
                to="/jobs"
                className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass hover:text-primary dark:hover:text-[#fbf9f4] transition-colors"
              >
                ← All Positions
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
