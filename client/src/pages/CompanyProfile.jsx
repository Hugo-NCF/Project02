import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PROFILE_KEY = "campus_careers_profiles";

function getProfile(uid) {
  try {
    const all = JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}");
    return all[uid] || {};
  } catch {
    return {};
  }
}

function saveProfile(uid, data) {
  const all = JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}");
  all[uid] = { ...all[uid], ...data };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(all));
}

export default function CompanyProfile() {
  const { currentUser } = useAuth();
  const existing = currentUser ? getProfile(currentUser.uid) : {};

  const [form, setForm] = useState({
    company: existing.company || "",
    bio: existing.bio || "",
    website: existing.website || "",
    logoUrl: existing.logoUrl || "",
  });
  const [saved, setSaved] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setSaved(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (currentUser) {
      saveProfile(currentUser.uid, form);
      setSaved(true);
    }
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
            Institution Details
          </span>
          <h1 className="font-headline italic text-4xl text-primary dark:text-[#fbf9f4] mt-2">
            Company Profile
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] mb-2">
              Company / Institution Name
            </label>
            <input name="company" value={form.company} onChange={handleChange} className={inputClass} placeholder="e.g. Stanford University" />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] mb-2">
              About / Bio
            </label>
            <textarea name="bio" value={form.bio} onChange={handleChange} rows={4} className={inputClass} placeholder="Tell candidates about your institution..." />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] mb-2">
              Website
            </label>
            <input name="website" value={form.website} onChange={handleChange} className={inputClass} placeholder="https://www.example.edu" />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] mb-2">
              Logo URL
            </label>
            <input name="logoUrl" value={form.logoUrl} onChange={handleChange} className={inputClass} placeholder="https://..." />
          </div>

          {saved && (
            <p className="text-sm text-secondary dark:text-brass">
              Profile saved successfully.
            </p>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="bg-primary dark:bg-[#fbf9f4] text-on-primary dark:text-[#030813] px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
            >
              Save Profile
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
