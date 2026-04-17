import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import mockJobs from "../services/mockJobs.json";

const RECRUITER_JOBS_KEY = "campus_careers_recruiter_jobs";
const CATEGORIES = ["Faculty", "Research", "Administration"];

function getLocalJobs() {
  try {
    return JSON.parse(localStorage.getItem(RECRUITER_JOBS_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const allJobs = [...mockJobs, ...getLocalJobs()];
  const job = allJobs.find((j) => j.id === id);

  // Block access if this job doesn't belong to the current recruiter
  const { currentUser } = useAuth();
  const isOwner = job && job.recruiterId === currentUser?.uid;

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
    status: "active",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (job) {
      setForm({
        title: job.title || "",
        institution: job.institution || "",
        category: job.category || "Faculty",
        department: job.department || "",
        location: job.location || "",
        salaryMin: job.salaryMin || "",
        salaryMax: job.salaryMax || "",
        description: job.description || "",
        qualifications: job.qualifications || "",
        deadline: job.deadline || "",
        startDate: job.startDate || "",
        status: job.status || "active",
      });
    }
  }, []);

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

    const localJobs = getLocalJobs();
    const idx = localJobs.findIndex((j) => j.id === id);

    const updated = {
      ...job,
      ...form,
      salaryMin: Number(form.salaryMin) || 0,
      salaryMax: Number(form.salaryMax) || 0,
    };

    if (idx >= 0) {
      localJobs[idx] = updated;
    } else {
      // Copy mock job into localStorage for editing
      localJobs.push(updated);
    }

    localStorage.setItem(RECRUITER_JOBS_KEY, JSON.stringify(localJobs));
    navigate("/recruiter");
  }

  function handleDelete() {
    if (!confirm("Are you sure you want to delete this posting?")) return;
    const localJobs = getLocalJobs().filter((j) => j.id !== id);
    localStorage.setItem(RECRUITER_JOBS_KEY, JSON.stringify(localJobs));
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
            Edit Listing
          </span>
          <h1 className="font-headline italic text-4xl text-primary dark:text-[#fbf9f4] mt-2">
            {job.title}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] mb-2">
              Position Title *
            </label>
            <input name="title" value={form.title} onChange={handleChange} className={inputClass} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] mb-2">
                Institution *
              </label>
              <input name="institution" value={form.institution} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] mb-2">
                Department
              </label>
              <input name="department" value={form.department} onChange={handleChange} className={inputClass} />
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
              <input name="location" value={form.location} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] mb-2">
                Salary Min ($)
              </label>
              <input name="salaryMin" type="number" value={form.salaryMin} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] mb-2">
                Salary Max ($)
              </label>
              <input name="salaryMax" type="number" value={form.salaryMax} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] mb-2">
              Description
            </label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={5} className={inputClass} />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] mb-2">
              Qualifications
            </label>
            <textarea name="qualifications" value={form.qualifications} onChange={handleChange} rows={3} className={inputClass} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] mb-2">
                Application Deadline
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] mb-2">
                Status
              </label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {error && <p className="text-error text-sm">{error}</p>}

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              type="submit"
              className="bg-primary dark:bg-[#fbf9f4] text-on-primary dark:text-[#030813] px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
            >
              Save Changes
            </button>
            <Link
              to="/recruiter"
              className="border border-primary dark:border-[#fbf9f4] text-primary dark:text-[#fbf9f4] px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary dark:hover:bg-[#fbf9f4] dark:hover:text-[#030813] transition-colors"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              className="ml-auto border border-error text-error px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-error hover:text-on-primary transition-colors"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
