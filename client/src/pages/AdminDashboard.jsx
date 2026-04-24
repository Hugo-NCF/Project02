import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { adminApi, notificationApi } from "../services/api";

/* ── Stat Card ──────────────────────────────────────────── */
function StatCard({ label, value, trend, trendUp, accent = "secondary" }) {
  const borderColor =
    accent === "error"
      ? "border-error"
      : accent === "brass"
      ? "border-brass"
      : "border-secondary";
  const labelColor =
    accent === "error" ? "text-error" : "text-secondary dark:text-brass";
  const valueColor =
    accent === "error" ? "text-error" : "text-primary dark:text-[#fbf9f4]";

  return (
    <div
      className={`bg-surface-container-low dark:bg-[#0d1829] p-8 border-t-2 ${borderColor} animate-rise`}
    >
      <span className={`block text-[11px] uppercase tracking-widest mb-2 ${labelColor}`}>
        {label}
      </span>
      <span className={`block font-headline text-4xl font-bold ${valueColor}`}>
        {value ?? "—"}
      </span>
      {trend && (
        <span
          className={`block text-xs mt-3 ${
            trendUp === false
              ? "text-error"
              : trendUp
              ? "text-green-700 dark:text-green-400"
              : "text-on-surface-variant dark:text-[#828796]"
          }`}
        >
          {trend}
        </span>
      )}
    </div>
  );
}

/* ── Activity Item ──────────────────────────────────────── */
function ActivityItem({ icon, title, sub, time }) {
  return (
    <div className="group flex items-start gap-5 py-6 border-b border-outline-variant/20 dark:border-[#1a202c] hover:bg-surface-container-low dark:hover:bg-[#0d1829] transition-colors duration-200 -mx-8 px-8">
      <div className="flex-shrink-0 w-11 h-11 bg-surface-container-highest dark:bg-[#1a202c] flex items-center justify-center">
        <span className="material-symbols-outlined text-[20px] text-primary dark:text-[#fbf9f4]">
          {icon}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-4">
          <p className="font-headline text-[16px] leading-snug text-primary dark:text-[#fbf9f4]">
            {title}
          </p>
          <span className="text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-[#45474c] flex-shrink-0">
            {time}
          </span>
        </div>
        <p className="text-sm italic text-on-surface-variant dark:text-[#828796] mt-1">{sub}</p>
      </div>
    </div>
  );
}

/* ── Moderation Item ────────────────────────────────────── */
function ModerationItem({ label, body }) {
  return (
    <div className="bg-surface dark:bg-[#0a1220] p-5 border-l-2 border-error">
      <span className="block text-[10px] font-label uppercase tracking-widest text-error mb-2">
        {label}
      </span>
      <p className="text-sm font-headline text-primary dark:text-[#fbf9f4] mb-4 leading-snug">
        {body}
      </p>
      <div className="flex gap-2">
        <button className="flex-1 py-2 text-[10px] uppercase tracking-widest bg-primary dark:bg-[#fbf9f4] text-on-primary dark:text-[#030813] transition-opacity hover:opacity-80">
          Review
        </button>
        <button className="flex-1 py-2 text-[10px] uppercase tracking-widest border border-outline dark:border-[#1a202c] text-on-surface dark:text-[#fbf9f4] hover:bg-surface-container-low dark:hover:bg-[#0d1829] transition-colors">
          Dismiss
        </button>
      </div>
    </div>
  );
}

/* ── Relative time formatter ────────────────────────────── */
function relativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return "Just now";
  if (mins < 60) return `${mins} mins ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs === 1 ? "1 hr ago" : `${hrs} hrs ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ── Dashboard ──────────────────────────────────────────── */
export default function AdminDashboard() {
  const { currentUser } = useAuth();

  const [stats, setStats] = useState({
    totalUsers: null,
    totalJobs: null,
    activeJobs: null,
    flagged: null,
    seekers: null,
    recruiters: null,
    pendingRecruiters: null,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  const [partners] = useState([
    { name: "Stanford University", active: true },
    { name: "Yale University", active: true },
    { name: "Johns Hopkins", active: true },
    { name: "MIT", active: false },
  ]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usersRes, jobsRes, activeJobsRes, flaggedRes, seekersRes, recruitersRes, pendingRes, activityRes] =
          await Promise.all([
            adminApi.getUsers({ limit: 1 }),
            adminApi.getJobs({ limit: 1 }),
            adminApi.getJobs({ status: "active", limit: 1 }),
            notificationApi.getAll({ type: "flag", read: "false", limit: 1 }),
            adminApi.getUsers({ role: "seeker", limit: 1 }),
            adminApi.getUsers({ role: "recruiter", limit: 1 }),
            adminApi.getPendingRecruiters(),
            notificationApi.getAll({ limit: 4 }),
          ]);

        setStats({
          totalUsers: usersRes.total,
          totalJobs: jobsRes.total,
          activeJobs: activeJobsRes.total,
          flagged: flaggedRes.total,
          seekers: seekersRes.total,
          recruiters: recruitersRes.total,
          pendingRecruiters: pendingRes.length,
        });

        if (activityRes.items?.length) {
          setRecentActivity(activityRes.items);
        }
      } catch (err) {
        console.warn("Dashboard stats fetch failed:", err.message);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="px-8 py-10 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary dark:text-brass">
          Admin Console
        </span>
        <h1 className="font-headline italic text-4xl md:text-5xl text-primary dark:text-[#fbf9f4] mt-2 animate-rise">
          Platform Overview
        </h1>
        <p className="text-on-surface-variant dark:text-[#828796] mt-2 font-body">
          Welcome back, {currentUser?.name || "Admin"} — scholarly ecosystem health &amp; engagement metrics.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-12">
        <StatCard label="Total Users"    value={stats.totalUsers} trend="+2 this week"    trendUp={true}  />
        <StatCard label="Job Postings"   value={stats.totalJobs}  trend="+1 this week"    trendUp={true}  />
        <StatCard label="Active Listings" value={stats.activeJobs} trend="Steady fill rate" trendUp={null} />
        <StatCard label="Flagged Items"  value={stats.flagged}    trend="Action required" trendUp={false} accent="error" />
      </div>

      {/* Bento layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Left column: 2/3 */}
        <div className="xl:col-span-2 space-y-8">
          {/* Recent Activity */}
          <section className="bg-surface dark:bg-[#0a1220] p-8">
            <div className="flex justify-between items-end mb-2">
              <h2 className="font-headline italic text-2xl text-primary dark:text-[#fbf9f4]">
                Recent Institutional Activity
              </h2>
              <span className="text-[11px] uppercase tracking-widest text-secondary dark:text-brass underline underline-offset-4 cursor-pointer">
                View all
              </span>
            </div>

            {recentActivity.length > 0 ? (
              recentActivity.map((n) => (
                <ActivityItem
                  key={n._id}
                  icon={n.icon || "notifications"}
                  title={n.title}
                  sub={n.body}
                  time={relativeTime(n.createdAt)}
                />
              ))
            ) : (
              <p className="py-8 text-center text-sm italic text-on-surface-variant dark:text-[#45474c]">
                No recent activity yet.
              </p>
            )}
          </section>

          {/* User Management Digest — dark panel */}
          <section className="bg-primary dark:bg-[#1a202c] text-on-primary p-10 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="font-headline italic text-2xl mb-6">
                User Management Digest
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-on-primary-container mb-2">
                    Job Seekers
                  </span>
                  <span className="text-5xl font-headline font-bold">{stats.seekers ?? "—"}</span>
                  <p className="text-xs mt-4 text-on-primary-container leading-relaxed">
                    Active candidates searching for academic positions.
                  </p>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-on-primary-container mb-2">
                    Recruiters
                  </span>
                  <span className="text-5xl font-headline font-bold">{stats.recruiters ?? "—"}</span>
                  {stats.pendingRecruiters > 0 && (
                    <p className="text-xs mt-2 text-amber-300">
                      {stats.pendingRecruiters} awaiting approval
                    </p>
                  )}
                  <p className="text-xs mt-2 text-on-primary-container leading-relaxed">
                    Institutional partners with posting privileges.
                  </p>
                </div>
                <div className="flex flex-col justify-end">
                  <Link
                    to="/admin/users"
                    className="border border-on-primary-container/40 px-6 py-3 text-[11px] uppercase tracking-widest text-on-primary hover:bg-on-primary hover:text-primary dark:hover:text-[#030813] transition-all duration-300 text-center"
                  >
                    Enter User Directory →
                  </Link>
                </div>
              </div>
            </div>
            {/* Decorative blur */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary opacity-5 rotate-45 transform translate-x-20 -translate-y-20 pointer-events-none" />
          </section>
        </div>

        {/* Right column: 1/3 */}
        <div className="space-y-8">
          {/* Moderation Queue */}
          <section className="bg-surface-container-highest dark:bg-[#0d1829] p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-error text-[20px]">gavel</span>
              <h3 className="font-headline italic text-xl text-primary dark:text-[#fbf9f4]">
                Moderation Queue
              </h3>
            </div>
            <div className="space-y-4">
              <ModerationItem
                label="Reported Listing #job_003"
                body='"Dean of Student Affairs" flagged for unverified salary range by two applicants.'
              />
              <ModerationItem
                label="Suspicious Account"
                body="Multiple failed logins on erodriguez@mit.edu — account auto-locked."
              />
            </div>
            <p className="mt-6 text-[10px] italic text-on-surface-variant/60 dark:text-[#45474c] text-center">
              Protocol 4.2 · Flags must be resolved within 24 standard hours.
            </p>
          </section>

          {/* Institutional Partners */}
          <section className="p-8 border border-outline-variant/30 dark:border-[#1a202c]">
            <h3 className="font-headline italic text-lg text-primary dark:text-[#fbf9f4] mb-5">
              Institutional Partners
            </h3>
            <div className="space-y-4">
              {partners.map((p) => (
                <div key={p.name} className="flex items-center justify-between">
                  <span className="text-sm font-body text-on-surface dark:text-[#e4e2dd]">
                    {p.name}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${p.active ? "bg-green-500" : "bg-amber-400"}`}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Quick links */}
          <div className="bg-secondary-container/30 dark:bg-[#1a202c] p-8 space-y-3">
            <h4 className="font-headline italic text-lg text-primary dark:text-[#fbf9f4] mb-4">
              Quick Actions
            </h4>
            <Link
              to="/admin/users"
              className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-on-surface dark:text-[#e4e2dd] hover:text-secondary dark:hover:text-brass transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">group</span>
              Manage Users
            </Link>
            <Link
              to="/admin/jobs"
              className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-on-surface dark:text-[#e4e2dd] hover:text-secondary dark:hover:text-brass transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">work</span>
              Manage Jobs
            </Link>
            <Link
              to="/admin/notifications"
              className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-on-surface dark:text-[#e4e2dd] hover:text-secondary dark:hover:text-brass transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">notifications</span>
              Dispatch Board
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
