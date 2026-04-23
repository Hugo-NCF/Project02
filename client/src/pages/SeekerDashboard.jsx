import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { applicationApi, jobApi, bookmarkApi } from "../services/api";

const STATUS_STYLE = {
  pending:    "bg-secondary/10 text-secondary dark:bg-brass/10 dark:text-brass",
  reviewed:   "bg-primary/10 text-primary dark:bg-[#fbf9f4]/10 dark:text-[#fbf9f4]",
  interviewing: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
};

export default function SeekerDashboard() {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [recommended,  setRecommended]  = useState([]);
  const [bookmarks,    setBookmarks]    = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    applicationApi
      .getMy()
      .then((res) => setApplications(res.items || []))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, [currentUser]);

  useEffect(() => {
    jobApi.getAll({ status: "active", limit: 6 })
      .then(({ items }) => setRecommended(items))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    bookmarkApi.getAll()
      .then(setBookmarks)
      .catch(() => {});
  }, [currentUser]);

  const appliedJobs = applications
    .map((app) => {
      const job = typeof app.jobId === "object" && app.jobId ? app.jobId : null;
      return job ? { ...app, job } : null;
    })
    .filter(Boolean);

  const appliedIds = new Set(appliedJobs.map((a) => String(a.job._id)));
  const recommendedFiltered = recommended
    .filter((j) => !appliedIds.has(String(j._id)))
    .slice(0, 3);

  const stats = {
    total:    appliedJobs.length,
    pending:  appliedJobs.filter((a) => a.status === "pending").length,
    reviewed: appliedJobs.filter((a) => a.status === "reviewed").length,
  };

  if (loading) {
    return (
      <div className="bg-background dark:bg-[#030813] min-h-screen flex items-center justify-center">
        <p className="text-on-surface-variant dark:text-[#828796] italic">Loading applications…</p>
      </div>
    );
  }

  return (
    <div className="bg-background dark:bg-[#030813] min-h-screen text-on-surface dark:text-[#fbf9f4]">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* ── Header ──────────────────────────────────────── */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary dark:text-brass">
              Candidate Overview
            </span>
            <h1 className="font-headline italic text-4xl md:text-5xl text-primary dark:text-[#fbf9f4] mt-2">
              {currentUser?.name || "Job Seeker"}
            </h1>
            <p className="mt-2 text-sm italic text-on-surface-variant dark:text-[#828796]">
              {currentUser?.email}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/seeker/profile"
              className="border border-primary dark:border-[#fbf9f4] text-primary dark:text-[#fbf9f4] px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary dark:hover:bg-[#fbf9f4] dark:hover:text-[#030813] transition-colors"
            >
              Edit Profile
            </Link>
            <Link
              to="/jobs"
              className="bg-primary dark:bg-[#fbf9f4] text-on-primary dark:text-[#030813] px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
            >
              Browse Jobs
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-outline-variant/30 dark:bg-[#1a202c] mb-10" />

        {/* ── Stats strip ─────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { value: stats.total,    label: "Applications Submitted" },
            { value: stats.pending,  label: "Awaiting Review" },
            { value: stats.reviewed, label: "Reviewed" },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="bg-surface-container-low dark:bg-[#0d1829] border border-outline-variant/20 dark:border-[#1a202c] p-6"
            >
              <span className="block font-headline text-4xl font-bold text-primary dark:text-[#fbf9f4]">
                {value}
              </span>
              <span className="block text-[11px] uppercase tracking-widest text-secondary dark:text-brass mt-1">
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* ── Application Status ───────────────────────── */}
          <div className="flex-1 min-w-0">
            <div className="flex items-end justify-between mb-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary dark:text-brass">
                  Activity
                </span>
                <h2 className="font-headline italic text-2xl text-primary dark:text-[#fbf9f4] mt-1">
                  Application Status
                </h2>
              </div>
              <Link
                to="/jobs"
                className="text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass border-b border-secondary dark:border-brass pb-0.5 hover:text-primary hover:border-primary dark:hover:text-[#fbf9f4] transition-colors"
              >
                View All →
              </Link>
            </div>

            {appliedJobs.length === 0 ? (
              <div className="bg-surface-container-low dark:bg-[#0d1829] border border-outline-variant/20 dark:border-[#1a202c] p-10 text-center">
                <span className="font-headline italic text-xl text-on-surface-variant dark:text-[#45474c]">
                  No applications yet.
                </span>
                <Link
                  to="/jobs"
                  className="mt-4 block text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass hover:underline"
                >
                  Browse open positions →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-outline-variant/20 dark:divide-[#1a202c]">
                {appliedJobs.map((app, i) => (
                  <div key={app._id || i} className="py-5 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/jobs/${app.job._id || app.job.id}`}
                        className="font-headline italic text-lg text-primary dark:text-[#fbf9f4] hover:text-secondary dark:hover:text-brass transition-colors"
                      >
                        {app.job.title}
                      </Link>
                      <p className="text-[12px] italic text-on-surface-variant dark:text-[#828796] mt-0.5">
                        {app.job.institution} · {app.job.location}
                      </p>
                      <p className="text-[11px] text-on-surface-variant dark:text-[#45474c] mt-1">
                        Applied {new Date(app.dateApplied).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </p>
                    </div>
                    <span
                      className={`flex-shrink-0 px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                        STATUS_STYLE[app.status] || STATUS_STYLE.pending
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* ── Recommended ──────────────────────────────── */}
            <div className="mt-12">
              <div className="mb-6">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary dark:text-brass">
                  Curated For You
                </span>
                <h2 className="font-headline italic text-2xl text-primary dark:text-[#fbf9f4] mt-1">
                  Recommended Positions
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedFiltered.map((job) => (
                  <Link
                    key={job._id}
                    to={`/jobs/${job._id}`}
                    className="group bg-surface-container-low dark:bg-[#0d1829] border border-outline-variant/20 dark:border-[#1a202c] p-6 hover:bg-surface-container dark:hover:bg-[#1a202c] transition-colors"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest text-secondary dark:text-brass">
                      {job.category}
                    </span>
                    <h3 className="font-headline italic text-[16px] text-primary dark:text-[#fbf9f4] mt-2 leading-snug group-hover:text-secondary dark:group-hover:text-brass transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-[12px] italic text-on-surface-variant dark:text-[#828796] mt-1">
                      {job.institution}
                    </p>
                    <p className="text-[12px] text-on-surface-variant dark:text-[#45474c] mt-3">
                      {job.salaryMin && job.salaryMax
                        ? `$${job.salaryMin.toLocaleString()} – $${job.salaryMax.toLocaleString()}`
                        : "Not specified"}
                    </p>
                    <span className="mt-4 block text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass group-hover:translate-x-1 transition-transform duration-200">
                      Quick Apply →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── Sidebar ──────────────────────────────────────── */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">

            {/* Profile card */}
            <div className="bg-surface-container-low dark:bg-[#0d1829] border border-outline-variant/20 dark:border-[#1a202c] p-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary dark:text-brass">
                Your Profile
              </span>
              <div className="mt-4 space-y-2">
                <p className="text-[13px] text-primary dark:text-[#fbf9f4] font-semibold">
                  {currentUser?.name}
                </p>
                <p className="text-[12px] text-on-surface-variant dark:text-[#828796]">
                  {currentUser?.email}
                </p>
              </div>
              <Link
                to="/seeker/profile"
                className="mt-5 block text-center border border-primary dark:border-[#fbf9f4] text-primary dark:text-[#fbf9f4] py-2 text-[11px] font-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary dark:hover:bg-[#fbf9f4] dark:hover:text-[#030813] transition-colors"
              >
                Edit Profile
              </Link>
            </div>

            {/* Saved positions */}
            <div className="bg-surface-container-low dark:bg-[#0d1829] border border-outline-variant/20 dark:border-[#1a202c] p-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary dark:text-brass">
                Saved Positions
              </span>
              {bookmarks.length === 0 ? (
                <p className="mt-4 text-[12px] italic text-on-surface-variant dark:text-[#828796]">
                  No saved positions yet.
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  {bookmarks.slice(0, 5).map((bm) => {
                    const job = bm.jobId;
                    if (!job) return null;
                    return (
                      <div key={bm._id}>
                        <Link
                          to={`/jobs/${job._id}`}
                          className="block text-[13px] font-headline italic text-primary dark:text-[#fbf9f4] hover:text-secondary dark:hover:text-brass transition-colors leading-snug"
                        >
                          {job.title}
                        </Link>
                        <p className="text-[11px] italic text-on-surface-variant dark:text-[#828796] mt-0.5">
                          {job.institution}
                        </p>
                      </div>
                    );
                  })}
                  {bookmarks.length > 5 && (
                    <p className="text-[11px] text-on-surface-variant dark:text-[#45474c]">
                      +{bookmarks.length - 5} more saved
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Editorial advice */}
            <div className="bg-primary dark:bg-[#0a1220] border border-primary dark:border-[#1a202c] p-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-primary-container">
                Editorial Advice
              </span>
              <blockquote className="mt-4 font-headline italic text-[15px] text-on-primary leading-relaxed">
                "The strongest applications reflect not only accomplishments, but a coherent vision for future scholarship."
              </blockquote>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
