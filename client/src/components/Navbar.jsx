import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../context/DarkModeContext";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { dark, toggle } = useDarkMode();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  function dashboardPath() {
    if (!currentUser) return "/";
    if (currentUser.role === "admin") return "/admin";
    if (currentUser.role === "recruiter") return "/recruiter";
    return "/seeker";
  }

  const linkClass = ({ isActive }) =>
    `text-[11px] font-bold uppercase tracking-widest transition-colors duration-200 ${
      isActive
        ? "text-secondary border-b border-secondary pb-0.5"
        : "text-on-surface-variant dark:text-[#828796] hover:text-secondary"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-background/90 dark:bg-[#030813]/90 backdrop-blur-md border-b border-outline-variant/30 dark:border-[#1a202c]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="font-headline italic text-xl font-bold text-primary dark:text-[#fbf9f4] tracking-tight"
        >
          Campus Careers
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/jobs" className={linkClass}>
            Browse Jobs
          </NavLink>

          {currentUser && (
            <NavLink to={dashboardPath()} className={linkClass}>
              Dashboard
            </NavLink>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Dark mode toggle */}
          <button
            onClick={toggle}
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-9 w-9 items-center justify-center text-on-surface-variant dark:text-[#828796] hover:text-secondary transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              {dark ? "light_mode" : "dark_mode"}
            </span>
          </button>

          {currentUser ? (
            <>
              <span className="hidden text-[11px] uppercase tracking-widest text-on-surface-variant dark:text-[#828796] lg:block">
                {currentUser.name || currentUser.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-primary dark:bg-[#fbf9f4] text-on-primary dark:text-[#030813] px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-opacity hover:opacity-80"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Sign In
              </NavLink>
              <Link
                to="/register"
                className="bg-primary dark:bg-[#fbf9f4] text-on-primary dark:text-[#030813] px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-opacity hover:opacity-80"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
