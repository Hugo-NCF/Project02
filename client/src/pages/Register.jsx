import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LIBRARY_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDclEQyzV2krEtG7-NtwfdA1upJ_wdSySE4jo0f2589lzr-LX4RWRmHOjEYL9eS-0UBBh3JmMRVo5RNFeI_0Cmkfk7BkVsAxzUTQpbbtFmiJd8Z6X11BHnvuDnzPEpmynm-0NSeca6xcs5m-mZmkIiAi6exSVEKoq__R_2nyWMn8IjFJ4Y8UqjMQ81ASRpohou2MwBMu-WC8tvmeK8cBWT6sdOSuIGrq5TInTSwsCDOeSmfkPBXo1zt3EBBpq_agzwZCTmQogKK9m5g";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("seeker");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const user = await register({ name, email, password, role });
      const dest =
        user.role === "recruiter"
          ? "/recruiter"
          : user.role === "admin"
          ? "/admin"
          : "/seeker";
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.message || "Failed to create account.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="-mx-0 -my-0 flex min-h-[calc(100vh-8rem)] flex-col bg-background dark:bg-[#030813] md:flex-row">
      {/* ─── EDITORIAL SIDE ─── */}
      <aside className="relative hidden overflow-hidden bg-primary-container md:flex md:w-[40%] md:flex-col md:justify-between md:p-16">
        {/* Architectural photograph with editorial treatment */}
        <div className="absolute inset-0 z-0">
          <img
            src={LIBRARY_IMAGE}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover opacity-30 contrast-125 grayscale"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-transparent" />
        </div>

        {/* Masthead */}
        <div
          className="relative z-10 flex items-center gap-3 animate-rise"
        >
          <div className="h-[2px] w-6 bg-brass" />
          <span className="text-[10px] font-bold uppercase tracking-editorial text-brass">
            Campus Careers
          </span>
        </div>

        {/* Hero statement */}
        <div
          className="relative z-10 max-w-md animate-rise"
          style={{ animationDelay: "0.1s" }}
        >
          <h1 className="serif-italic text-5xl leading-[1.05] text-on-primary lg:text-7xl">
            Academic
            <br />
            jobs,
            <br />
            direct.
          </h1>
          <div className="mt-8 h-[2px] w-24 origin-left bg-brass animate-divider" />
        </div>

        {/* Editorial footnote */}
        <div
          className="relative z-10 max-w-sm animate-rise"
          style={{ animationDelay: "0.2s" }}
        >
          <p className="serif-italic text-lg leading-relaxed text-white/70">
            Faculty, research, and staff openings &mdash; posted by the
            institutions that are hiring.
          </p>
        </div>
      </aside>

      {/* ─── FORM SIDE ─── */}
      <section className="paper-grain relative flex flex-1 items-center justify-center overflow-y-auto px-6 py-16 sm:px-12 md:px-16 lg:px-24 dark:bg-[#0a1220]">
        <div className="relative z-10 w-full max-w-2xl space-y-12">
          {/* Header */}
          <header className="space-y-4">
            <span className="animate-rise block text-[11px] font-bold uppercase tracking-[0.2em] text-secondary dark:text-brass">
              Create account
            </span>
            <h2
              className="animate-rise font-headline text-4xl text-primary dark:text-[#fbf9f4] md:text-5xl"
              style={{ animationDelay: "0.05s" }}
            >
              Sign up
            </h2>
            <p
              className="animate-rise max-w-md leading-relaxed text-on-surface-variant dark:text-[#828796]"
              style={{ animationDelay: "0.1s" }}
            >
              Apply for academic jobs, or post listings for your institution.
            </p>
          </header>

          {error && (
            <div className="animate-rise border-l-2 border-error bg-error-container/40 px-4 py-3 text-sm text-on-error-container">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="animate-rise space-y-10"
            style={{ animationDelay: "0.15s" }}
          >
            {/* Credentials */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <EditorialInput
                id="name"
                label="Full Name"
                value={name}
                onChange={setName}
                placeholder="Full name"
                type="text"
                required
              />
              <EditorialInput
                id="email"
                label="Email Address"
                value={email}
                onChange={setEmail}
                placeholder="you@university.edu"
                type="email"
                required
              />
              <div className="md:col-span-2">
                <EditorialInput
                  id="password"
                  label="Password"
                  value={password}
                  onChange={setPassword}
                  placeholder="••••••••••••"
                  type="password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Role selection */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px flex-grow bg-outline-variant" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 dark:text-[#828796]">
                  I'm a
                </span>
                <div className="h-px flex-grow bg-outline-variant" />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <RoleCard
                  checked={role === "seeker"}
                  onSelect={() => setRole("seeker")}
                  title="Job Seeker"
                  description="Apply for faculty, research, and staff positions."
                  icon={<GraduationIcon />}
                />
                <RoleCard
                  checked={role === "recruiter"}
                  onSelect={() => setRole("recruiter")}
                  title="Recruiter"
                  description="Post jobs and review applicants for your institution."
                  icon={<InstitutionIcon />}
                />
              </div>
            </div>

            {/* Submit */}
            <div className="space-y-6 pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="group relative w-full overflow-hidden bg-primary px-6 py-5 text-[13px] font-medium uppercase tracking-[0.2em] text-on-primary shadow-xl shadow-primary/10 transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="relative z-10">
                  {submitting ? "Creating account…" : "Create account"}
                </span>
                <span className="absolute inset-y-0 left-0 w-0 bg-brass/15 transition-all duration-500 group-hover:w-full" />
              </button>

              <p className="text-center text-sm text-on-surface-variant dark:text-[#828796]">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-secondary dark:text-brass underline decoration-1 underline-offset-4 transition-colors hover:text-brass"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

/* ────────────── Sub-components ────────────── */

function EditorialInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  minLength,
}) {
  return (
    <div className="group space-y-2">
      <label
        htmlFor={id}
        className="block text-[11px] font-bold uppercase tracking-[0.2em] text-secondary dark:text-brass"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        minLength={minLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border-0 border-b border-outline-variant dark:border-[#1a202c] bg-surface-container-low dark:bg-[#0d1829] p-4 text-[15px] text-on-surface dark:text-[#fbf9f4] placeholder:italic placeholder:text-slate-400 dark:placeholder:text-[#45474c] focus:border-secondary dark:focus:border-brass focus:outline-none focus:ring-0"
        style={{ borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0 }}
      />
    </div>
  );
}

function RoleCard({ checked, onSelect, title, description, icon }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={checked}
      className={`group relative flex h-full flex-col items-start gap-4 p-8 text-left transition-all duration-300 ${
        checked
          ? "bg-white dark:bg-[#0d1829] shadow-[0_0_0_2px_var(--color-secondary),0_0_0_6px_rgba(117,89,52,0.2)]"
          : "bg-surface-container dark:bg-[#1a202c] hover:bg-surface-container-high dark:hover:bg-[#1f2937]"
      }`}
    >
      <div className="flex h-12 w-12 items-center justify-center bg-primary text-on-primary">
        {icon}
      </div>

      <div>
        <h3 className="serif-italic text-xl text-primary dark:text-[#fbf9f4]">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-on-surface-variant dark:text-[#828796]">
          {description}
        </p>
      </div>

      <div
        className={`mt-auto flex items-center gap-2 pt-4 text-secondary dark:text-brass transition-opacity duration-300 ${
          checked ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
          Select Role
        </span>
        <ArrowRightIcon />
      </div>
    </button>
  );
}

function GraduationIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3L1 9L12 15L21 10.09V17"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        d="M5 12.5V17.5C5 17.5 7.5 20 12 20C16.5 20 19 17.5 19 17.5V12.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

function InstitutionIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 21H21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
      <path d="M5 21V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
      <path d="M19 21V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
      <path d="M9 21V14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
      <path d="M15 21V14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
      <path
        d="M12 3L2 10H22L12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="miter"
      />
      <path d="M12 7V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
      <path
        d="M1 5H13M13 5L9 1M13 5L9 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}
