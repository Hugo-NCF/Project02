import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RECRUITER_JOBS_KEY = "campus_careers_recruiter_jobs";

const CATEGORIES = ["Faculty", "Research", "Administration"];

function getLocalJobs() {
  try {
    return JSON.parse(localStorage.getItem(RECRUITER_JOBS_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function CreateJob() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    institution: "",
    category: "Faculty",
    department: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    description: "",
    qualifications: "",
    deadline: "",
    startDate: "",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.institution.trim() || !form.location.trim()) {
      setError("Title, institution, and location are required.");
      return;
    }
    if (!form.deadline) {
      setError("Application deadline is required.");
      return;
    }

    const job = {
      id: `job_local_${Date.now()}`,
      ...form,
      salaryMin: Number(form.salaryMin) || 0,
      salaryMax: Number(form.salaryMax) || 0,
      recruiterId: currentUser?.uid || "unknown",
      status: "active",
      createdAt: new Date().toISOString().slice(0, 10),
    };

    const jobs = getLocalJobs();
    jobs.push(job);
    localStorage.setItem(RECRUITER_JOBS_KEY, JSON.stringify(jobs));
    navigate("/recruiter");
  }

  const inputClass =
    "w-full bg-surface-container dark:bg-[#0d1829] border border-outline-variant/30 dark:border-[#1a202c] px-4 py-3 text-sm text-on-surface dark:text-[#fbf9f4] placeholder:text-on-surface-variant/50 dark:placeholder:text-[#828796]/50 focus:outline-none focus:border-secondary dark:focus:border-brass transition-colors";

  return (
    <div className="bg-background dark:bg-[#030813] min-h-screen text-on-surface dark:text-[#fbf9f4]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link
          to="/recruiter"
          className="text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass hover:underline"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-6 mb-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary dark:text-brass">
            New Listing
          </span>
          <h1 className="font-headline italic text-4xl text-primary dark:text-[#fbf9f4] mt-2">
            Post a Position
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] mb-2">
              Position Title *
            </label>
            <input name="title" value={form.title} onChange={handleChange} className={inputClass} placeholder="e.g. Assistant Professor of Computer Science" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] mb-2">
                Institution *
              </label>
              <input name="institution" value={form.institution} onChange={handleChange} className={inputClass} placeholder="e.g. Stanford University" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] mb-2">
                Department
              </label>
              <input name="department" value={form.department} onChange={handleChange} className={inputClass} placeholder="e.g. School of Engineering" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] mb-2">
                Category
              </label>
              <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] mb-2">
                Location *
              </label>
              <input name="location" value={form.location} onChange={handleChange} className={inputClass} placeholder="e.g. Stanford, CA" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] mb-2">
                Salary Min ($)
              </label>
              <input name="salaryMin" type="number" value={form.salaryMin} onChange={handleChange} className={inputClass} placeholder="e.g. 80000" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] mb-2">
                Salary Max ($)
              </label>
              <input name="salaryMax" type="number" value={form.salaryMax} onChange={handleChange} className={inputClass} placeholder="e.g. 120000" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] mb-2">
              Description
            </label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={5} className={inputClass} placeholder="Describe the position, responsibilities, and expectations..." />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] mb-2">
              Qualifications
            </label>
            <textarea name="qualifications" value={form.qualifications} onChange={handleChange} rows={3} className={inputClass} placeholder="Required qualifications and experience..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] mb-2">
                Application Deadline *
              </label>
              <input name="deadline" type="date" value={form.deadline} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] mb-2">
                Start Date
              </label>
              <input name="startDate" type="date" value={form.startDate} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {error && <p className="text-error text-sm">{error}</p>}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="bg-primary dark:bg-[#fbf9f4] text-on-primary dark:text-[#030813] px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
            >
              Publish Position
            </button>
            <Link
              to="/recruiter"
              className="border border-primary dark:border-[#fbf9f4] text-primary dark:text-[#fbf9f4] px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary dark:hover:bg-[#fbf9f4] dark:hover:text-[#030813] transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
