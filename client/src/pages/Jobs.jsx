import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import mockJobs from "../services/mockJobs.json";

const CATEGORIES = ["Faculty", "Research", "Administration", "Staff", "Postdoc", "Other"];
const LOCATIONS   = [...new Set(mockJobs.map((j) => j.location))].sort();
const PAGE_SIZE   = 5;

const CATEGORY_STYLE = {
  Faculty:        "text-secondary dark:text-brass border-secondary dark:border-brass",
  Research:       "text-brass border-brass",
  Administration: "text-primary dark:text-[#fbf9f4] border-primary dark:border-[#fbf9f4]",
};

export default function Jobs() {
  const [query,     setQuery]     = useState("");
  const [category,  setCategory]  = useState("");
  const [location,  setLocation]  = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [sort,      setSort]      = useState("newest");
  const [page,      setPage]      = useState(1);

  const filtered = useMemo(() => {
    let jobs = [...mockJobs];

    if (query) {
      const q = query.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.institution.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q)
      );
    }
    if (category)  jobs = jobs.filter((j) => j.category === category);
    if (location)  jobs = jobs.filter((j) => j.location === location);
    if (salaryMin) jobs = jobs.filter((j) => j.salaryMax >= parseInt(salaryMin, 10));

    if (sort === "newest")   jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sort === "salary")   jobs.sort((a, b) => b.salaryMax - a.salaryMax);
    if (sort === "deadline") jobs.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    return jobs;
  }, [query, category, location, salaryMin, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleFilter(setter) {
    return (e) => { setter(e.target.value); setPage(1); };
  }

  function resetFilters() {
    setQuery(""); setCategory(""); setLocation(""); setSalaryMin(""); setPage(1);
  }

  return (
    <div className="bg-background dark:bg-[#030813] min-h-screen text-on-surface dark:text-[#fbf9f4]">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* ── Page header ─────────────────────────────────── */}
        <div className="mb-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary dark:text-brass">
            Browse Positions
          </span>
          <h1 className="font-headline italic text-4xl md:text-5xl text-primary dark:text-[#fbf9f4] mt-2">
            Open Positions
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant dark:text-[#828796]">
            Curating the next generation of academic excellence.
          </p>
        </div>

        <div className="flex gap-10">

          {/* ── Sidebar ─────────────────────────────────────── */}
          <aside className="w-52 flex-shrink-0 hidden md:block">
            <div className="sticky top-24 space-y-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant dark:text-[#828796]">
                Filter Results
              </p>

              {/* Keyword */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] block mb-1.5">
                  Keyword
                </label>
                <input
                  value={query}
                  onChange={handleFilter(setQuery)}
                  placeholder="Title, institution…"
                  className="w-full bg-surface-container-low dark:bg-[#0d1829] border border-outline-variant/40 dark:border-[#1a202c] text-primary dark:text-[#fbf9f4] text-[13px] px-3 py-2 focus:outline-none focus:border-secondary dark:focus:border-brass placeholder:text-on-surface-variant/40 transition-colors"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] block mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={handleFilter(setCategory)}
                  className="w-full bg-surface-container-low dark:bg-[#0d1829] border border-outline-variant/40 dark:border-[#1a202c] text-primary dark:text-[#fbf9f4] text-[13px] px-3 py-2 focus:outline-none focus:border-secondary dark:focus:border-brass transition-colors"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] block mb-1.5">
                  Location
                </label>
                <select
                  value={location}
                  onChange={handleFilter(setLocation)}
                  className="w-full bg-surface-container-low dark:bg-[#0d1829] border border-outline-variant/40 dark:border-[#1a202c] text-primary dark:text-[#fbf9f4] text-[13px] px-3 py-2 focus:outline-none focus:border-secondary dark:focus:border-brass transition-colors"
                >
                  <option value="">All Locations</option>
                  {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>

              {/* Min salary */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] block mb-1.5">
                  Min Salary
                </label>
                <input
                  type="number"
                  value={salaryMin}
                  onChange={handleFilter(setSalaryMin)}
                  placeholder="e.g. 80000"
                  className="w-full bg-surface-container-low dark:bg-[#0d1829] border border-outline-variant/40 dark:border-[#1a202c] text-primary dark:text-[#fbf9f4] text-[13px] px-3 py-2 focus:outline-none focus:border-secondary dark:focus:border-brass placeholder:text-on-surface-variant/40 transition-colors"
                />
              </div>

              <button
                onClick={resetFilters}
                className="w-full bg-primary dark:bg-[#fbf9f4] text-on-primary dark:text-[#030813] py-2.5 text-[11px] font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* ── Main content ─────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Count + sort bar */}
            <div className="flex items-center justify-between mb-6 pb-5 border-b border-outline-variant/30 dark:border-[#1a202c]">
              <span className="text-[12px] text-on-surface-variant dark:text-[#828796]">
                <span className="font-bold text-primary dark:text-[#fbf9f4]">{filtered.length}</span> position{filtered.length !== 1 ? "s" : ""} found
              </span>
              <select
                value={sort}
                onChange={handleFilter(setSort)}
                className="bg-surface-container-low dark:bg-[#0d1829] border border-outline-variant/40 dark:border-[#1a202c] text-primary dark:text-[#fbf9f4] text-[11px] font-bold uppercase tracking-widest px-3 py-2 focus:outline-none focus:border-secondary dark:focus:border-brass"
              >
                <option value="newest">Newest Listings</option>
                <option value="salary">Highest Salary</option>
                <option value="deadline">Deadline Soon</option>
              </select>
            </div>

            {/* Empty state */}
            {paginated.length === 0 && (
              <div className="py-24 text-center">
                <span className="font-headline italic text-2xl text-on-surface-variant dark:text-[#45474c]">
                  No positions match your criteria.
                </span>
                <button
                  onClick={resetFilters}
                  className="mt-6 block mx-auto text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Job cards */}
            <div className="divide-y divide-outline-variant/20 dark:divide-[#1a202c]">
              {paginated.map((job) => (
                <article key={job.id} className="group py-8 flex gap-6">
                  <div className="flex-1 min-w-0">
                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest border px-2 py-0.5 ${
                          CATEGORY_STYLE[job.category] || "text-secondary border-secondary dark:text-brass dark:border-brass"
                        }`}
                      >
                        {job.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest ${
                          job.status === "active"
                            ? "text-secondary dark:text-brass"
                            : "text-on-surface-variant dark:text-[#45474c]"
                        }`}
                      >
                        {job.status === "active" ? "● Active" : "● Closed"}
                      </span>
                    </div>

                    <Link to={`/jobs/${job.id}`}>
                      <h2 className="font-headline italic text-2xl text-primary dark:text-[#fbf9f4] group-hover:text-secondary dark:group-hover:text-brass transition-colors leading-snug">
                        {job.title}
                      </h2>
                    </Link>
                    <p className="mt-1 text-sm italic text-on-surface-variant dark:text-[#828796]">
                      {job.institution} · {job.department}
                    </p>
                    <p className="mt-0.5 text-[12px] text-on-surface-variant dark:text-[#45474c]">
                      {job.location}
                    </p>
                    <p className="mt-3 text-[13px] text-on-surface-variant dark:text-[#828796] line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  {/* Right meta */}
                  <div className="flex-shrink-0 flex flex-col items-end justify-between min-w-[130px]">
                    <div className="text-right">
                      <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-[#45474c]">
                        Salary
                      </span>
                      <span className="font-headline text-[15px] text-primary dark:text-[#fbf9f4]">
                        ${job.salaryMin.toLocaleString()} – ${job.salaryMax.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right mt-3">
                      <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-[#45474c]">
                        Deadline
                      </span>
                      <span className="text-[12px] text-on-surface-variant dark:text-[#828796]">
                        {new Date(job.deadline).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </span>
                    </div>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="mt-6 text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass border-b border-secondary dark:border-brass pb-0.5 hover:text-primary hover:border-primary dark:hover:text-[#fbf9f4] dark:hover:border-[#fbf9f4] transition-colors whitespace-nowrap"
                    >
                      View Details →
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-1 pt-8 border-t border-outline-variant/30 dark:border-[#1a202c]">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass disabled:opacity-30 hover:text-primary dark:hover:text-[#fbf9f4] transition-colors"
                >
                  ← Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-8 h-8 text-[12px] font-bold transition-colors ${
                      n === page
                        ? "bg-primary dark:bg-[#fbf9f4] text-on-primary dark:text-[#030813]"
                        : "text-on-surface-variant dark:text-[#828796] hover:text-primary dark:hover:text-[#fbf9f4]"
                    }`}
                  >
                    {n}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass disabled:opacity-30 hover:text-primary dark:hover:text-[#fbf9f4] transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
