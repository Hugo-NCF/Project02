import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
    <div className="-mx-0 -my-0 flex min-h-[calc(100vh-8rem)] flex-col bg-background md:flex-row">
      {/* ─── EDITORIAL SIDE ─── */}
      <aside className="velvet-depth relative hidden overflow-hidden md:flex md:w-[42%] md:flex-col md:justify-between md:p-16 lg:p-20">
        {/* Architectural SVG pattern — gothic library arches */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full opacity-[0.07]"
          viewBox="0 0 400 800"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <defs>
            <pattern
              id="columns"
              x="0"
              y="0"
              width="80"
              height="800"
              patternUnits="userSpaceOnUse"
            >
              {/* Gothic arched window */}
              <path
                d="M20 780 L20 180 Q20 100 40 100 Q60 100 60 180 L60 780 Z"
                stroke="#fbf9f4"
                strokeWidth="0.5"
                fill="none"
              />
              {/* Interior vertical mullion */}
              <line
                x1="40"
                y1="180"
                x2="40"
                y2="780"
                stroke="#fbf9f4"
                strokeWidth="0.3"
              />
              {/* Horizontal transom */}
              <line
                x1="20"
                y1="420"
                x2="60"
                y2="420"
                stroke="#fbf9f4"
                strokeWidth="0.3"
              />
              <line
                x1="20"
                y1="600"
                x2="60"
                y2="600"
                stroke="#fbf9f4"
                strokeWidth="0.3"
              />
            </pattern>
          </defs>
          <rect width="400" height="800" fill="url(#columns)" />
        </svg>

        {/* Soft vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(3,8,19,0.55)_100%)]" />

        {/* Masthead */}
        <div className="relative z-10 flex items-center gap-3 animate-rise">
          <div className="h-[2px] w-6 bg-brass" />
          <span className="text-[10px] font-bold uppercase tracking-editorial text-brass">
            Campus Careers
          </span>
        </div>

        {/* Hero statement */}
        <div
          className="relative z-10 animate-rise"
          style={{ animationDelay: "0.1s" }}
        >
          <h1 className="serif-italic text-5xl leading-[1.05] text-on-primary lg:text-[5.5rem]">
            Join the
            <br />
            Scholarly
            <br />
            Network.
          </h1>
          <div className="mt-10 h-[2px] w-28 origin-left bg-brass animate-divider" />
          <p className="mt-8 max-w-sm text-[13px] leading-relaxed text-white/50">
            A quiet, rigorous place for faculty, researchers, and
            administrators to find their next institution.
          </p>
        </div>

        {/* Editorial footnote */}
        <div
          className="relative z-10 max-w-sm animate-rise"
          style={{ animationDelay: "0.25s" }}
        >
          <p className="serif-italic text-lg leading-relaxed text-white/70">
            "The Digital Dean of academic recruitment &mdash; where
            institutional prestige meets global talent."
          </p>
          <p className="mt-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-editorial text-white/35">
            <span>Est. 2026</span>
            <span className="h-1 w-1 rounded-full bg-brass/80" />
            <span>Editorial Excellence</span>
          </p>
        </div>
      </aside>

      {/* ─── FORM SIDE ─── */}
      <section className="paper-grain flex flex-1 items-center justify-center px-6 py-16 sm:px-12 md:px-16 lg:px-24">
        <div className="relative z-10 w-full max-w-xl">
          {/* Section label */}
          <div className="animate-rise">
            <span className="text-[10px] font-bold uppercase tracking-editorial text-secondary">
              — New Account
            </span>
          </div>

          {/* Headline */}
          <h2
            className="mt-4 font-headline text-5xl leading-[1.1] text-primary animate-rise"
            style={{ animationDelay: "0.05s", fontFamily: "var(--font-headline)" }}
          >
            Begin Your Journey
          </h2>

          <p
            className="mt-5 max-w-md text-[15px] leading-relaxed text-on-surface-variant animate-rise"
            style={{ animationDelay: "0.1s" }}
          >
            Enter your credentials to access the premier network for higher
            education career advancement.
          </p>

          {/* Error */}
          {error && (
            <div className="mt-8 border-l-2 border-error bg-error-container/40 px-4 py-3 text-sm text-on-error-container animate-rise">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-10 animate-rise"
            style={{ animationDelay: "0.15s" }}
          >
            {/* Credentials grid */}
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
              <EditorialInput
                id="name"
                label="Full Name"
                value={name}
                onChange={setName}
                placeholder="Dr. Jane Doe"
                type="text"
                required
              />
              <EditorialInput
                id="email"
                label="Email Address"
                value={email}
                onChange={setEmail}
                placeholder="doe@university.edu"
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

            {/* Identity Selection divider */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-outline-variant/50" />
              <span className="text-[10px] font-bold uppercase tracking-editorial text-on-surface-variant/60">
                Identity Selection
              </span>
              <div className="h-px flex-1 bg-outline-variant/50" />
            </div>

            {/* Role cards */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <RoleCard
                checked={role === "seeker"}
                onSelect={() => setRole("seeker")}
                title="I am a Job Seeker"
                description="Discover faculty positions, research grants, and administrative leadership roles."
                icon={<GraduationIcon />}
              />
              <RoleCard
                checked={role === "recruiter"}
                onSelect={() => setRole("recruiter")}
                title="I am a Recruiter"
                description="Acquire top-tier talent for your institution's academic and executive branches."
                icon={<InstitutionIcon />}
              />
            </div>

            {/* Submit */}
            <div className="space-y-6 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="group relative w-full overflow-hidden bg-primary px-6 py-[18px] text-[11px] font-bold uppercase tracking-editorial text-on-primary transition-all duration-300 hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="relative z-10">
                  {submitting ? "Creating your Folio…" : "Create Professional Folio"}
                </span>
                <span className="absolute inset-y-0 left-0 w-0 bg-brass/15 transition-all duration-500 group-hover:w-full" />
              </button>

              <p className="text-center text-sm text-on-surface-variant">
                Already part of the network?{" "}
                <Link
                  to="/login"
                  className="font-bold text-secondary underline decoration-1 underline-offset-4 transition-colors hover:text-brass"
                >
                  Sign In here.
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
    <div className="group">
      <label
        htmlFor={id}
        className="mb-2 block text-[10px] font-bold uppercase tracking-editorial text-secondary"
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
        className="w-full border-0 border-b border-outline-variant/50 bg-surface-container-low px-4 py-3 text-[15px] text-on-surface placeholder:italic placeholder:text-on-surface-variant/40 focus:border-secondary focus:outline-none focus:ring-0"
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
      className={`group relative flex h-full flex-col items-start gap-5 p-8 text-left transition-all duration-300 ${
        checked
          ? "bg-surface-container-lowest bg-white shadow-[0_0_0_2px_var(--color-secondary)]"
          : "bg-surface-container hover:bg-surface-container-high"
      }`}
    >
      {/* Top accent bar — appears on selected */}
      <div
        className={`absolute left-0 right-0 top-0 h-[2px] bg-brass transition-all duration-500 ${
          checked ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
        }`}
        style={{ transformOrigin: "left center" }}
      />

      {/* Icon block — sharp, not rounded */}
      <div
        className={`flex h-12 w-12 items-center justify-center transition-colors duration-300 ${
          checked ? "bg-primary text-on-primary" : "bg-primary/90 text-on-primary"
        }`}
      >
        {icon}
      </div>

      <div>
        <h3 className="serif-italic text-xl text-primary">{title}</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-on-surface-variant">
          {description}
        </p>
      </div>

      {/* Select indicator */}
      <div
        className={`mt-auto flex items-center gap-2 pt-3 text-[10px] font-bold uppercase tracking-editorial text-secondary transition-opacity duration-300 ${
          checked ? "opacity-100" : "opacity-0 group-hover:opacity-60"
        }`}
      >
        <span>{checked ? "Selected" : "Select Role"}</span>
        <svg
          width="14"
          height="10"
          viewBox="0 0 14 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 5H13M13 5L9 1M13 5L9 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
          />
        </svg>
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
      <path d="M12 3L2 10H22L12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="miter" />
      <path d="M12 7V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}
