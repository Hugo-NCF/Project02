import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  const linkClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
    }`;

  function dashboardPath() {
    if (!currentUser) return "/";
    if (currentUser.role === "admin") return "/admin";
    if (currentUser.role === "recruiter") return "/recruiter";
    return "/seeker";
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold tracking-tight text-gray-900">
          Campus Careers
        </Link>

        <nav className="flex items-center gap-2">
          <NavLink to="/jobs" className={linkClass}>
            Jobs
          </NavLink>

          {currentUser ? (
            <>
              <NavLink to={dashboardPath()} className={linkClass}>
                Dashboard
              </NavLink>
              <span className="px-3 text-sm text-gray-500">
                {currentUser.name || currentUser.email}
              </span>
              <button
                onClick={handleLogout}
                className="ml-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
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
                className="ml-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
