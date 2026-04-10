import { useState } from "react";
import { NavLink } from "react-router-dom";

const NAV = [
  { to: "/admin",               label: "Platform Overview", icon: "dashboard",     end: true  },
  { to: "/admin/users",         label: "User Directory",    icon: "group"                      },
  { to: "/admin/jobs",          label: "Career Registry",   icon: "work"                       },
  { to: "/admin/notifications", label: "Dispatch Board",    icon: "notifications"              },
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center bg-primary dark:bg-[#fbf9f4] text-on-primary dark:text-[#030813] shadow-lg"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle admin menu"
      >
        <span className="material-symbols-outlined">
          {open ? "close" : "menu"}
        </span>
      </button>

      {/* Backdrop (mobile) */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-[57px] left-0 z-40 h-[calc(100vh-57px)] w-64
          bg-surface-container-low dark:bg-[#0d1829]
          border-r border-outline-variant/30 dark:border-[#1a202c]
          flex flex-col py-8 px-6 transition-transform duration-300
          lg:sticky lg:translate-x-0 lg:flex-shrink-0
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Masthead */}
        <div className="mb-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
            Admin Console
          </span>
          <div className="mt-2 h-px bg-outline-variant/50 dark:bg-[#1a202c]" />
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1">
          {NAV.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 transition-colors duration-150 group ${
                  isActive
                    ? "bg-secondary-container/60 text-secondary dark:bg-[#1a202c] dark:text-brass border-l-2 border-secondary"
                    : "text-on-surface-variant dark:text-[#828796] hover:bg-surface-container dark:hover:bg-[#1a202c] hover:text-on-surface dark:hover:text-[#fbf9f4]"
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">{icon}</span>
              <span className="text-[11px] font-bold uppercase tracking-widest">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer hint */}
        <div className="mt-auto pt-8 border-t border-outline-variant/30 dark:border-[#1a202c]">
          <p className="text-[10px] italic text-on-surface-variant/60 dark:text-[#45474c] leading-relaxed">
            Protocol 4.2 · All flags resolved within 24 hrs.
          </p>
        </div>
      </aside>
    </>
  );
}
