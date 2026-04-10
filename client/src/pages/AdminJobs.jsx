import { useState } from "react";
import mockJobs from "../services/mockJobs.json";

const STATUSES = ["all", "active", "closed"];

const CATEGORY_COLORS = {
  Faculty:        "bg-secondary-container text-secondary dark:bg-[#1a202c] dark:text-brass",
  Research:       "bg-surface-container-highest dark:bg-[#0d1829] text-on-surface-variant dark:text-[#828796]",
  Administration: "bg-primary/10 dark:bg-[#1a202c] text-primary dark:text-[#fbf9f4]",
};

export default function AdminJobs() {
  const [query,  setQuery]  = useState("");
  const [filter, setFilter] = useState("all");
  const [jobs,   setJobs]   = useState(mockJobs);

  const filtered = jobs.filter((j) => {
    const matchStatus = filter === "all" || j.status === filter;
    const matchQuery  =
      j.title.toLowerCase().includes(query.toLowerCase()) ||
      j.institution.toLowerCase().includes(query.toLowerCase()) ||
      j.category.toLowerCase().includes(query.toLowerCase());
    return matchStatus && matchQuery;
  });

  function toggleStatus(id) {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id
          ? { ...j, status: j.status === "active" ? "closed" : "active" }
          : j
      )
    );
  }

  const activeCount = jobs.filter((j) => j.status === "active").length;
  const closedCount = jobs.filter((j) => j.status === "closed").length;

  return (
    <div className="px-8 py-10 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary dark:text-brass">
          Admin Console · Job Management
        </span>
        <h1 className="font-headline italic text-4xl md:text-5xl text-primary dark:text-[#fbf9f4] mt-2 animate-rise">
          The Career Registry
        </h1>
        <p className="text-on-surface-variant dark:text-[#828796] mt-2 font-body">
          Oversee all institutional position listings, statuses, and deadlines.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: "Total Listings", value: jobs.length,   accent: "border-secondary" },
          { label: "Active",         value: activeCount,   accent: "border-green-600" },
          { label: "Closed",         value: closedCount,   accent: "border-error"     },
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

      {/* Search + filter */}
      <div className="bg-surface dark:bg-[#0a1220] p-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant dark:text-[#45474c]">
              search
            </span>
            <input
              type="text"
              placeholder="Search by title, institution, or category…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface-container-low dark:bg-[#0d1829] border-0 border-b border-outline-variant dark:border-[#1a202c] text-[14px] text-on-surface dark:text-[#fbf9f4] placeholder:italic placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary dark:focus:border-brass"
            />
          </div>

          <div className="flex gap-2">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors ${
                  filter === s
                    ? "bg-primary dark:bg-[#fbf9f4] text-on-primary dark:text-[#030813]"
                    : "border border-outline-variant dark:border-[#1a202c] text-on-surface-variant dark:text-[#828796] hover:border-secondary dark:hover:border-brass hover:text-secondary dark:hover:text-brass"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <p className="text-[11px] uppercase tracking-widest text-on-surface-variant dark:text-[#828796] mb-4">
          Showing {filtered.length} of {jobs.length} listings
        </p>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30 dark:text-[#1a202c] block mb-3">
              work_off
            </span>
            <p className="italic text-on-surface-variant dark:text-[#828796]">
              No listings match your search.
            </p>
          </div>
        ) : (
          <div>
            {filtered.map((job) => (
              <div
                key={job.id}
                className="flex flex-col md:flex-row md:items-center gap-4 py-6 border-b border-outline-variant/20 dark:border-[#1a202c] hover:bg-surface-container-low dark:hover:bg-[#0d1829] transition-colors duration-150 -mx-8 px-8"
              >
                {/* Status line */}
                <div
                  className={`w-1 self-stretch flex-shrink-0 hidden md:block ${
                    job.status === "active" ? "bg-green-500" : "bg-error"
                  }`}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start gap-2 mb-1">
                    <h3 className="font-headline text-[17px] text-primary dark:text-[#fbf9f4] leading-snug">
                      {job.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                        CATEGORY_COLORS[job.category] || CATEGORY_COLORS.Research
                      }`}
                    >
                      {job.category}
                    </span>
                  </div>
                  <p className="text-sm italic text-on-surface-variant dark:text-[#828796]">
                    {job.institution} &nbsp;·&nbsp; {job.location}
                  </p>
                  <p className="text-[12px] text-on-surface-variant dark:text-[#45474c] mt-1">
                    ${job.salaryMin.toLocaleString()} – ${job.salaryMax.toLocaleString()}
                    &nbsp;·&nbsp; Deadline: {job.deadline}
                  </p>
                </div>

                {/* Status badge + toggle */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                      job.status === "active"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                        : "bg-error-container dark:bg-error/20 text-on-error-container dark:text-error"
                    }`}
                  >
                    {job.status}
                  </span>
                  <button
                    onClick={() => toggleStatus(job.id)}
                    title={job.status === "active" ? "Close listing" : "Reactivate listing"}
                    className="p-2 text-on-surface-variant dark:text-[#828796] hover:text-secondary dark:hover:text-brass transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {job.status === "active" ? "toggle_on" : "toggle_off"}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
