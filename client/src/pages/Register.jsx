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
    <div className="-mx-0 -my-0 flex min-h-[calc(100vh-8rem)] flex-col bg-background md:flex-row">
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
            Join the
            <br />
            Scholarly
            <br />
            Network.
          </h1>
          <div className="mt-8 h-[2px] w-24 origin-left bg-brass animate-divider" />
        </div>

        {/* Editorial footnote */}
        <div
          className="relative z-10 max-w-sm animate-rise"
          style={{ animationDelay: "0.2s" }}
        >
          <p className="serif-italic text-lg leading-relaxed text-white/70">
            "The Digital Dean of academic recruitment &mdash; where
            institutional prestige meets global talent."
          </p>
          <p className="mt-4 text-[11px] font-sans uppercase tracking-[0.2em] text-white/35">
            Est. 2026 &nbsp;•&nbsp; Editorial Excellence
          </p>
        </div>
      </aside>

      {/* ─── FORM SIDE ─── */}
      <section className="paper-grain relative flex flex-1 items-center justify-center overflow-y-auto px-6 py-16 sm:px-12 md:px-16 lg:px-24">
        <div className="relative z-10 w-full max-w-2xl space-y-12">
          {/* Header */}
          <header className="space-y-4">
            <span className="animate-rise block text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
              New Account
            </span>
            <h2
              className="animate-rise font-headline text-4xl text-primary md:text-5xl"
              style={{ animationDelay: "0.05s" }}
            >
              Begin Your Journey
            </h2>
            <p
              className="animate-rise max-w-md leading-relaxed text-on-surface-variant"
              style={{ animationDelay: "0.1s" }}
            >
              Enter your credentials to access the premier network for higher
              education career advancement.
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
                placeholder="Dr. Julian Sterling"
                type="text"
                required
              />
              <EditorialInput
                id="email"
                label="Email Address"
                value={email}
                onChange={setEmail}
                placeholder="sterling@university.edu"
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

            {/* Identity Selection */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px flex-grow bg-outline-variant" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">
                  Identity Selection
                </span>
                <div className="h-px flex-grow bg-outline-variant" />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
            </div>

            {/* Submit */}
            <div className="space-y-6 pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="group relative w-full overflow-hidden bg-primary px-6 py-5 text-[13px] font-medium uppercase tracking-[0.2em] text-on-primary shadow-xl shadow-primary/10 transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
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
    <div className="group space-y-2">
      <label
        htmlFor={id}
        className="block text-[11px] font-bold uppercase tracking-[0.2em] text-secondary"
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
        className="w-full border-0 border-b border-outline-variant bg-surface-container-low p-4 text-[15px] text-on-surface placeholder:italic placeholder:text-slate-400 focus:border-secondary focus:outline-none focus:ring-0"
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
          ? "bg-white shadow-[0_0_0_2px_var(--color-secondary),0_0_0_6px_rgba(117,89,52,0.2)]"
          : "bg-surface-container hover:bg-surface-container-high"
      }`}
    >
      <div className="flex h-12 w-12 items-center justify-center bg-primary text-on-primary">
        {icon}
      </div>

      <div>
        <h3 className="serif-italic text-xl text-primary">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
          {description}
        </p>
      </div>

      <div
        className={`mt-auto flex items-center gap-2 pt-4 text-secondary transition-opacity duration-300 ${
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
