import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  try {
    const all = JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}");
    all[uid] = { ...all[uid], ...data };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}

export default function ProfileEdit() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const existing = currentUser ? getProfile(currentUser.uid) : {};

  const [form, setForm] = useState({
    name:      currentUser?.name || "",
    bio:       existing.bio       || "",
    phone:     existing.phone     || "",
    resumeUrl: existing.resumeUrl || "",
  });
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState("");

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setSaved(false);
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    saveProfile(currentUser.uid, form);
    setSaved(true);
  }

  return (
    <div className="bg-background dark:bg-[#030813] min-h-screen text-on-surface dark:text-[#fbf9f4]">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary dark:text-brass">
            My Folio
          </span>
          <h1 className="font-headline italic text-4xl text-primary dark:text-[#fbf9f4] mt-2">
            Edit Profile
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant dark:text-[#828796]">
            Keep your scholarly record current and complete.
          </p>
        </div>

        <div className="h-px bg-outline-variant/30 dark:bg-[#1a202c] mb-10" />

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Full name */}
          <div>
            <div className="flex items-start gap-10">
              <div className="w-40 flex-shrink-0 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass block">
                  Full Name
                </span>
                <span className="text-[11px] text-on-surface-variant dark:text-[#45474c] mt-1 block leading-snug">
                  As it appears in publications.
                </span>
              </div>
              <div className="flex-1">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Dr. Arthur Sterling"
                  className="w-full bg-surface-container-low dark:bg-[#0d1829] border border-outline-variant/40 dark:border-[#1a202c] text-primary dark:text-[#fbf9f4] text-[14px] px-4 py-3 focus:outline-none focus:border-secondary dark:focus:border-brass placeholder:text-on-surface-variant/40 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-outline-variant/20 dark:bg-[#1a202c]" />

          {/* Bio */}
          <div>
            <div className="flex items-start gap-10">
              <div className="w-40 flex-shrink-0 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass block">
                  Scholarly Bio
                </span>
                <span className="text-[11px] text-on-surface-variant dark:text-[#45474c] mt-1 block leading-snug">
                  Research focus and expertise.
                </span>
              </div>
              <div className="flex-1">
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Post-doctoral researcher in computational linguistics with a focus on neural-symbolic AI…"
                  className="w-full bg-surface-container-low dark:bg-[#0d1829] border border-outline-variant/40 dark:border-[#1a202c] text-primary dark:text-[#fbf9f4] text-[14px] px-4 py-3 focus:outline-none focus:border-secondary dark:focus:border-brass placeholder:text-on-surface-variant/40 transition-colors resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-outline-variant/20 dark:bg-[#1a202c]" />

          {/* Phone */}
          <div>
            <div className="flex items-start gap-10">
              <div className="w-40 flex-shrink-0 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass block">
                  Phone
                </span>
                <span className="text-[11px] text-on-surface-variant dark:text-[#45474c] mt-1 block leading-snug">
                  Optional. For recruiter contact.
                </span>
              </div>
              <div className="flex-1">
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (617) 555-0123"
                  className="w-full bg-surface-container-low dark:bg-[#0d1829] border border-outline-variant/40 dark:border-[#1a202c] text-primary dark:text-[#fbf9f4] text-[14px] px-4 py-3 focus:outline-none focus:border-secondary dark:focus:border-brass placeholder:text-on-surface-variant/40 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-outline-variant/20 dark:bg-[#1a202c]" />

          {/* Resume URL */}
          <div>
            <div className="flex items-start gap-10">
              <div className="w-40 flex-shrink-0 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass block">
                  Curriculum Vitae
                </span>
                <span className="text-[11px] text-on-surface-variant dark:text-[#45474c] mt-1 block leading-snug">
                  Link to your CV (Google Drive, Dropbox, etc.)
                </span>
              </div>
              <div className="flex-1">
                <input
                  name="resumeUrl"
                  value={form.resumeUrl}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/file/d/…"
                  className="w-full bg-surface-container-low dark:bg-[#0d1829] border border-outline-variant/40 dark:border-[#1a202c] text-primary dark:text-[#fbf9f4] text-[14px] px-4 py-3 focus:outline-none focus:border-secondary dark:focus:border-brass placeholder:text-on-surface-variant/40 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-[12px] text-error font-bold uppercase tracking-widest">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate("/seeker")}
              className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] hover:text-primary dark:hover:text-[#fbf9f4] transition-colors"
            >
              ← Back to Dashboard
            </button>
            <div className="flex items-center gap-4">
              {saved && (
                <span className="text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass">
                  Saved ✓
                </span>
              )}
              <button
                type="submit"
                className="bg-primary dark:bg-[#fbf9f4] text-on-primary dark:text-[#030813] px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
              >
                Save Profile
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
