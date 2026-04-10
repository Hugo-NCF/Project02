import { useState } from "react";
import mockUsers from "../services/mockUsers.json";

const ROLES = ["all", "admin", "recruiter", "seeker"];

function roleBadge(role) {
  const map = {
    admin:     "bg-primary dark:bg-[#fbf9f4] text-on-primary dark:text-[#030813]",
    recruiter: "bg-secondary-container text-secondary dark:bg-[#1a202c] dark:text-brass",
    seeker:    "bg-surface-container-highest dark:bg-[#0d1829] text-on-surface-variant dark:text-[#828796]",
  };
  return map[role] || map.seeker;
}

export default function AdminUsers() {
  const [query,  setQuery]  = useState("");
  const [filter, setFilter] = useState("all");
  const [users,  setUsers]  = useState(mockUsers);

  const filtered = users.filter((u) => {
    const matchRole  = filter === "all" || u.role === filter;
    const matchQuery =
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase());
    return matchRole && matchQuery;
  });

  function toggleDisable(id) {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isDisabled: !u.isDisabled } : u))
    );
  }

  const adminCount     = users.filter((u) => u.role === "admin").length;
  const recruiterCount = users.filter((u) => u.role === "recruiter").length;
  const seekerCount    = users.filter((u) => u.role === "seeker").length;
  const disabledCount  = users.filter((u) => u.isDisabled).length;

  return (
    <div className="px-8 py-10 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary dark:text-brass">
          Admin Console · User Management
        </span>
        <h1 className="font-headline italic text-4xl md:text-5xl text-primary dark:text-[#fbf9f4] mt-2 animate-rise">
          User Directory
        </h1>
        <p className="text-on-surface-variant dark:text-[#828796] mt-2 font-body">
          Manage accounts, roles, and access privileges across the scholarly network.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Administrators", value: adminCount,     accent: "border-primary"    },
          { label: "Recruiters",     value: recruiterCount, accent: "border-secondary"  },
          { label: "Job Seekers",    value: seekerCount,    accent: "border-brass"      },
          { label: "Suspended",      value: disabledCount,  accent: "border-error"      },
        ].map(({ label, value, accent }) => (
          <div
            key={label}
            className={`bg-surface-container-low dark:bg-[#0d1829] p-6 border-t-2 ${accent}`}
          >
            <span className="text-[11px] uppercase tracking-widest text-on-surface-variant dark:text-[#828796] block mb-1">
              {label}
            </span>
            <span className="font-headline text-3xl font-bold text-primary dark:text-[#fbf9f4]">
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div className="bg-surface dark:bg-[#0a1220] p-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant dark:text-[#45474c]">
              search
            </span>
            <input
              type="text"
              placeholder="Search by name or email…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface-container-low dark:bg-[#0d1829] border-0 border-b border-outline-variant dark:border-[#1a202c] text-[14px] text-on-surface dark:text-[#fbf9f4] placeholder:italic placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary dark:focus:border-brass"
            />
          </div>

          {/* Role filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {ROLES.map((r) => (
              <button
                key={r}
                onClick={() => setFilter(r)}
                className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors ${
                  filter === r
                    ? "bg-primary dark:bg-[#fbf9f4] text-on-primary dark:text-[#030813]"
                    : "border border-outline-variant dark:border-[#1a202c] text-on-surface-variant dark:text-[#828796] hover:border-secondary dark:hover:border-brass hover:text-secondary dark:hover:text-brass"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-[11px] uppercase tracking-widest text-on-surface-variant dark:text-[#828796] mb-4">
          Showing {filtered.length} of {users.length} accounts
        </p>

        {/* Table header */}
        <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 px-4 pb-3 border-b border-outline-variant/50 dark:border-[#1a202c]">
          {["Name", "Email", "Role", "Joined", "Status"].map((h) => (
            <span key={h} className="text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-[#45474c]">
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30 dark:text-[#1a202c] block mb-3">
              manage_search
            </span>
            <p className="italic text-on-surface-variant dark:text-[#828796]">
              No accounts match your search.
            </p>
          </div>
        ) : (
          <div>
            {filtered.map((user) => (
              <div
                key={user.id}
                className={`grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 items-center px-4 py-5 border-b border-outline-variant/20 dark:border-[#1a202c] hover:bg-surface-container-low dark:hover:bg-[#0d1829] transition-colors duration-150 ${
                  user.isDisabled ? "opacity-50" : ""
                }`}
              >
                {/* Name */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary dark:bg-[#1a202c] flex items-center justify-center text-on-primary dark:text-[#fbf9f4] text-[13px] font-bold flex-shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <span className="font-headline text-[15px] text-primary dark:text-[#fbf9f4] leading-tight">
                    {user.name}
                  </span>
                </div>

                {/* Email */}
                <span className="text-sm text-on-surface-variant dark:text-[#828796] italic truncate">
                  {user.email}
                </span>

                {/* Role */}
                <span
                  className={`inline-flex self-start md:self-center px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${roleBadge(user.role)}`}
                >
                  {user.role}
                </span>

                {/* Joined */}
                <span className="text-[12px] text-on-surface-variant dark:text-[#45474c]">
                  {user.createdAt}
                </span>

                {/* Toggle */}
                <button
                  onClick={() => toggleDisable(user.id)}
                  disabled={user.role === "admin"}
                  title={user.isDisabled ? "Enable account" : "Suspend account"}
                  className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                    user.isDisabled
                      ? "bg-green-700 text-white hover:bg-green-800"
                      : "bg-error text-white hover:bg-error/80"
                  }`}
                >
                  {user.isDisabled ? "Enable" : "Suspend"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
