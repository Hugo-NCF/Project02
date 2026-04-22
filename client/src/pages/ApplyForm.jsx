import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { applicationApi, jobApi } from "../services/api";

const PROFILE_KEY = "campus_careers_profiles";

function getProfile(uid) {
  try {
    const all = JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}");
    return all[uid] || {};
  } catch {
    return {};
  }
}

export default function ApplyForm() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [job,     setJob]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobError, setJobError] = useState(null);

  const profile = currentUser ? getProfile(currentUser.uid) : {};

  const [form, setForm] = useState({
    resumeUrl:   profile.resumeUrl || "",
    coverLetter: "",
  });
  const [resumeFile,       setResumeFile]       = useState(null);
  const [coverLetterFile,  setCoverLetterFile]  = useState(null);
  const [submitted,     setSubmitted]     = useState(false);
  const [submitting,    setSubmitting]    = useState(false);
  const [error,         setError]         = useState("");
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    setLoading(true);
    jobApi.getById(id)
      .then(setJob)
      .catch((err) => setJobError(err.status === 404 ? "not_found" : err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (currentUser && id) {
      applicationApi.check(id).then((res) => {
        if (res.applied) setAlreadyApplied(true);
      }).catch(() => {});
    }
  }, [currentUser, id]);

  if (loading) {
    return (
      <div className="bg-background dark:bg-[#030813] min-h-screen flex items-center justify-center">
        <span className="font-headline italic text-2xl text-on-surface-variant dark:text-[#45474c]">
          Loading…
        </span>
      </div>
    );
  }

  if (jobError || !job) {
    return (
      <div className="bg-background dark:bg-[#030813] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="font-headline italic text-3xl text-on-surface-variant dark:text-[#45474c]">
            Position not found.
          </span>
          <Link to="/jobs" className="mt-6 block text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass hover:underline">
            ← All positions
          </Link>
        </div>
      </div>
    );
  }

  if (job.status !== "active") {
    return (
      <div className="bg-background dark:bg-[#030813] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="font-headline italic text-3xl text-on-surface-variant dark:text-[#45474c]">
            This position is no longer accepting applications.
          </span>
          <Link to="/jobs" className="mt-6 block text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass hover:underline">
            ← Browse open positions
          </Link>
        </div>
      </div>
    );
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0] || null;
    setResumeFile(file);
    setError("");
  }

  function handleCoverLetterFileChange(e) {
    const file = e.target.files?.[0] || null;
    setCoverLetterFile(file);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.resumeUrl.trim() && !resumeFile) {
      setError("Please provide a CV link or upload a file.");
      return;
    }

    if (alreadyApplied) {
      setError("You have already applied for this position.");
      return;
    }

    setSubmitting(true);
    try {
      await applicationApi.apply({
        jobId: job._id,
        resumeUrl: form.resumeUrl,
        coverLetter: form.coverLetter,
        resumeFile,
        coverLetterFile,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-background dark:bg-[#030813] min-h-screen flex items-center justify-center">
        <div className="max-w-md text-center px-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary dark:text-brass">
            Application Submitted
          </span>
          <h2 className="font-headline italic text-4xl text-primary dark:text-[#fbf9f4] mt-4 leading-snug">
            Your dossier has been received.
          </h2>
          <p className="mt-4 text-[14px] text-on-surface-variant dark:text-[#828796] leading-relaxed">
            The search committee at {job.institution} will review your application for{" "}
            <span className="italic">{job.title}</span>. You will be contacted if selected for the next stage.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/seeker"
              className="bg-primary dark:bg-[#fbf9f4] text-on-primary dark:text-[#030813] px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
            >
              View My Applications
            </Link>
            <Link
              to="/jobs"
              className="border border-primary dark:border-[#fbf9f4] text-primary dark:text-[#fbf9f4] px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary dark:hover:bg-[#fbf9f4] dark:hover:text-[#030813] transition-colors"
            >
              Browse More Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background dark:bg-[#030813] min-h-screen text-on-surface dark:text-[#fbf9f4]">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#45474c]">
          <Link to="/jobs" className="hover:text-secondary dark:hover:text-brass transition-colors">
            Browse Jobs
          </Link>
          <span>/</span>
          <Link to={`/jobs/${job._id}`} className="hover:text-secondary dark:hover:text-brass transition-colors">
            {job.title}
          </Link>
          <span>/</span>
          <span className="text-primary dark:text-[#fbf9f4]">Apply</span>
        </nav>

        {/* Header */}
        <div className="mb-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary dark:text-brass">
            Application for {job.category} Position
          </span>
        </div>
        <h1 className="font-headline italic text-4xl text-primary dark:text-[#fbf9f4] leading-tight">
          {job.title}
        </h1>
        <p className="mt-2 text-sm italic text-on-surface-variant dark:text-[#828796]">
          {job.institution} · {job.department}
        </p>

        <div className="h-px bg-outline-variant/30 dark:bg-[#1a202c] my-10" />

        {/* Already applied */}
        {alreadyApplied && (
          <div className="mb-8 bg-secondary/10 dark:bg-brass/10 border border-secondary/30 dark:border-brass/30 p-4">
            <p className="text-[12px] font-bold uppercase tracking-widest text-secondary dark:text-brass">
              You have already submitted an application for this position.
            </p>
            <Link to="/seeker" className="mt-2 block text-[11px] text-secondary dark:text-brass hover:underline">
              View your applications →
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* CV / Resume URL */}
          <div>
            <div className="flex items-start gap-10">
              <div className="w-40 flex-shrink-0 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass block">
                  Curriculum Vitae
                </span>
                <span className="text-[11px] text-on-surface-variant dark:text-[#45474c] mt-1 block leading-snug">
                  Link to your CV. Prefer PDF documents that reflect your scholarly contributions.
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
                <p className="mt-2 text-[11px] text-on-surface-variant dark:text-[#45474c]">
                  Google Drive, Dropbox, or institutional repository links accepted.
                </p>
                <div className="mt-4">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass block mb-2">
                    Or Upload Resume (PDF/Word, max 5MB)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="text-[13px] text-on-surface-variant dark:text-[#828796] file:mr-4 file:py-2 file:px-4 file:border file:border-outline-variant/30 dark:file:border-[#1a202c] file:text-[11px] file:font-bold file:uppercase file:tracking-widest file:bg-surface-container-low dark:file:bg-[#0d1829] file:text-primary dark:file:text-[#fbf9f4] file:cursor-pointer"
                  />
                  {resumeFile && (
                    <p className="mt-1 text-[11px] text-secondary dark:text-brass">
                      Selected: {resumeFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-outline-variant/20 dark:bg-[#1a202c]" />

          {/* Cover letter */}
          <div>
            <div className="flex items-start gap-10">
              <div className="w-40 flex-shrink-0 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass block">
                  Cover Letter
                </span>
                <span className="text-[11px] text-on-surface-variant dark:text-[#45474c] mt-1 block leading-snug">
                  Optional. A statement of purpose and scholarly fit.
                </span>
              </div>
              <div className="flex-1">
                <textarea
                  name="coverLetter"
                  value={form.coverLetter}
                  onChange={handleChange}
                  rows={8}
                  placeholder="I am writing to express my interest in the position of…"
                  className="w-full bg-surface-container-low dark:bg-[#0d1829] border border-outline-variant/40 dark:border-[#1a202c] text-primary dark:text-[#fbf9f4] text-[14px] px-4 py-3 focus:outline-none focus:border-secondary dark:focus:border-brass placeholder:text-on-surface-variant/40 transition-colors resize-none leading-relaxed"
                />
                <p className="mt-2 text-[11px] text-on-surface-variant dark:text-[#45474c]">
                  {form.coverLetter.length} characters
                </p>
                <div className="mt-4">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass block mb-2">
                    Or Upload Cover Letter (PDF/Word, max 5MB)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleCoverLetterFileChange}
                    className="text-[13px] text-on-surface-variant dark:text-[#828796] file:mr-4 file:py-2 file:px-4 file:border file:border-outline-variant/30 dark:file:border-[#1a202c] file:text-[11px] file:font-bold file:uppercase file:tracking-widest file:bg-surface-container-low dark:file:bg-[#0d1829] file:text-primary dark:file:text-[#fbf9f4] file:cursor-pointer"
                  />
                  {coverLetterFile && (
                    <p className="mt-1 text-[11px] text-secondary dark:text-brass">
                      Selected: {coverLetterFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Deadline notice */}
          <div className="bg-surface-container-low dark:bg-[#0d1829] border border-outline-variant/20 dark:border-[#1a202c] p-4 flex gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary dark:text-brass flex-shrink-0 mt-0.5">
              Deadline
            </span>
            <p className="text-[12px] text-on-surface-variant dark:text-[#828796]">
              Applications close on{" "}
              <span className="font-bold text-primary dark:text-[#fbf9f4]">
                {new Date(job.deadline).toLocaleDateString("en-US", {
                  month: "long", day: "numeric", year: "numeric",
                })}
              </span>
              . Submissions after this date will not be considered.
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="text-[12px] text-error font-bold uppercase tracking-widest">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => navigate(`/jobs/${job._id}`)}
              className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-[#828796] hover:text-primary dark:hover:text-[#fbf9f4] transition-colors"
            >
              ← Cancel Application
            </button>
            <button
              type="submit"
              disabled={alreadyApplied || submitting}
              className="bg-primary dark:bg-[#fbf9f4] text-on-primary dark:text-[#030813] px-10 py-3.5 text-[11px] font-bold uppercase tracking-widest hover:opacity-80 transition-opacity disabled:opacity-40"
            >
              {submitting ? "Submitting…" : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
