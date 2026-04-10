import { Link } from "react-router-dom";
import mockJobs from "../services/mockJobs.json";

const activeJobs      = mockJobs.filter((j) => j.status === "active");
const featuredJobs    = activeJobs.slice(0, 3);
const institutions    = new Set(mockJobs.map((j) => j.institution)).size;
const categories      = new Set(mockJobs.map((j) => j.category)).size;

const CATEGORY_BORDER = {
  Faculty:        "border-secondary",
  Research:       "border-brass",
  Administration: "border-primary dark:border-[#fbf9f4]",
};

export default function Home() {
  return (
    <div className="bg-background dark:bg-[#030813] text-on-surface dark:text-[#fbf9f4]">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary dark:text-brass">
          Campus Careers · Academic Job Portal
        </span>

        <h1 className="font-headline italic text-5xl md:text-7xl text-primary dark:text-[#fbf9f4] mt-4 leading-[1.1] animate-rise max-w-4xl">
          Advance Your Academic Career.
        </h1>

        <p className="mt-6 text-lg text-on-surface-variant dark:text-[#828796] max-w-xl leading-relaxed">
          Browse faculty, research, and administrative positions at leading universities
          and research institutions across the country.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            to="/jobs"
            className="bg-primary dark:bg-[#fbf9f4] text-on-primary dark:text-[#030813] px-8 py-3.5 text-[11px] font-bold uppercase tracking-widest transition-opacity hover:opacity-80"
          >
            Browse Positions
          </Link>
          <Link
            to="/register"
            className="border border-primary dark:border-[#fbf9f4] text-primary dark:text-[#fbf9f4] px-8 py-3.5 text-[11px] font-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary dark:hover:bg-[#fbf9f4] dark:hover:text-[#030813] transition-colors"
          >
            Post a Position
          </Link>
        </div>

        {/* Stats strip */}
        <div className="mt-14 flex flex-wrap gap-10 border-t border-outline-variant/30 dark:border-[#1a202c] pt-8">
          {[
            { value: activeJobs.length, label: "Active Positions"  },
            { value: institutions,      label: "Institutions"       },
            { value: categories,        label: "Job Categories"     },
          ].map(({ value, label }) => (
            <div key={label}>
              <span className="block font-headline text-4xl font-bold text-primary dark:text-[#fbf9f4]">
                {value}
              </span>
              <span className="block text-[11px] uppercase tracking-widest text-secondary dark:text-brass mt-1">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-outline-variant/30 dark:bg-[#1a202c] animate-divider" />
      </div>

      {/* ── Featured Appointments ────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary dark:text-brass">
              Featured
            </span>
            <h2 className="font-headline italic text-3xl md:text-4xl text-primary dark:text-[#fbf9f4] mt-1">
              Recent Appointments
            </h2>
          </div>
          <Link
            to="/jobs"
            className="hidden md:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass border-b border-secondary dark:border-brass pb-0.5 hover:text-primary hover:border-primary dark:hover:text-[#fbf9f4] dark:hover:border-[#fbf9f4] transition-colors"
          >
            View all
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <Link
              to="/jobs"
              key={job.id}
              className={`group bg-surface-container-low dark:bg-[#0d1829] p-8 border-t-2 ${
                CATEGORY_BORDER[job.category] || "border-secondary"
              } hover:bg-surface-container dark:hover:bg-[#1a202c] transition-colors duration-200`}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-secondary dark:text-brass">
                {job.category} · {job.department}
              </span>
              <h3 className="font-headline italic text-xl text-primary dark:text-[#fbf9f4] mt-3 leading-snug group-hover:text-secondary dark:group-hover:text-brass transition-colors">
                {job.title}
              </h3>
              <p className="text-sm italic text-on-surface-variant dark:text-[#828796] mt-2">
                {job.institution}
              </p>
              <p className="text-[12px] text-on-surface-variant dark:text-[#45474c] mt-1">
                {job.location}
              </p>

              <div className="mt-6 pt-5 border-t border-outline-variant/20 dark:border-[#1a202c] flex items-end justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant dark:text-[#828796] block">
                    Salary Range
                  </span>
                  <span className="font-headline text-[15px] text-primary dark:text-[#fbf9f4]">
                    ${job.salaryMin.toLocaleString()} – ${job.salaryMax.toLocaleString()}
                  </span>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass group-hover:translate-x-1 transition-transform duration-200">
                  View →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA Strip ────────────────────────────────────────── */}
      <section className="bg-primary dark:bg-[#0a1220] mt-4">
        <div className="max-w-7xl mx-auto px-6 py-16 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-primary-container">
                Join the Network
              </span>
              <h2 className="font-headline italic text-3xl md:text-4xl text-on-primary mt-2">
                Connecting scholars with institutions.
              </h2>
              <p className="mt-3 text-sm text-on-primary-container max-w-lg leading-relaxed">
                Whether you're seeking your next academic post or recruiting exceptional
                talent for your institution — Campus Careers is your scholarly home.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 flex-shrink-0">
              <Link
                to="/register"
                className="border border-on-primary-container/40 text-on-primary px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-on-primary hover:text-primary transition-colors"
              >
                I'm a Job Seeker
              </Link>
              <Link
                to="/register"
                className="bg-secondary text-on-primary px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Post a Position
              </Link>
            </div>
          </div>
          {/* Decorative blur */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary opacity-5 rotate-45 transform translate-x-32 -translate-y-32 pointer-events-none" />
        </div>
      </section>

    </div>
  );
}
