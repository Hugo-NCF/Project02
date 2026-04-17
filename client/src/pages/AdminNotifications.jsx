import { useState, useEffect } from "react";
import { notificationApi } from "../services/api";

const TYPES = ["all", "flag", "new_user", "new_job", "application", "system", "recruiter_approval"];

const TYPE_META = {
  flag:               { label: "Flag",               badge: "bg-error-container text-on-error-container dark:bg-error/20 dark:text-error"                    },
  new_user:           { label: "New User",            badge: "bg-secondary-container text-secondary dark:bg-[#1a202c] dark:text-brass"                        },
  new_job:            { label: "New Job",             badge: "bg-surface-container-highest dark:bg-[#0d1829] text-on-surface-variant dark:text-[#828796]"     },
  application:        { label: "Application",         badge: "bg-primary/10 dark:bg-[#1a202c] text-primary dark:text-[#fbf9f4]"                               },
  system:             { label: "System",              badge: "bg-outline-variant/30 dark:bg-[#1a202c] text-on-surface-variant dark:text-[#828796]"            },
  recruiter_approval: { label: "Recruiter Approval",  badge: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"                           },
};

function formatTime(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60)    return "Just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function AdminNotifications() {
  const [items,   setItems]   = useState([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [filter,  setFilter]  = useState("all");

  async function fetchNotifications(type = filter) {
    setLoading(true);
    setError(null);
    try {
      const params = { limit: 100 };
      if (type !== "all") params.type = type;
      const data = await notificationApi.getAll(params);
      setItems(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotifications(filter);
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  async function markRead(id) {
    try {
      const updated = await notificationApi.markRead(id);
      setItems((prev) => prev.map((n) => (n._id === id ? updated : n)));
    } catch (err) {
      console.error("Failed to mark read:", err.message);
    }
  }

  async function dismiss(id) {
    try {
      await notificationApi.dismiss(id);
      setItems((prev) => prev.filter((n) => n._id !== id));
      setTotal((t) => t - 1);
    } catch (err) {
      console.error("Failed to dismiss:", err.message);
    }
  }

  async function markAllRead() {
    try {
      await notificationApi.markAllRead();
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all read:", err.message);
    }
  }

  const unreadCount = items.filter((n) => !n.read).length;
  const flagCount   = items.filter((n) => n.type === "flag").length;

  return (
    <div className="px-8 py-10 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary dark:text-brass">
          Admin Console · Notifications
        </span>
        <h1 className="font-headline italic text-4xl md:text-5xl text-primary dark:text-[#fbf9f4] mt-2 animate-rise">
          Dispatch Board
        </h1>
        <p className="text-on-surface-variant dark:text-[#828796] mt-2 font-body">
          Monitor platform alerts, new registrations, flagged content, and system events.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: "Total Notices", value: loading ? "—" : total,       accent: "border-secondary" },
          { label: "Unread",        value: loading ? "—" : unreadCount, accent: "border-brass"     },
          { label: "Active Flags",  value: loading ? "—" : flagCount,   accent: "border-error"     },
        ].map(({ label, value, accent }) => (
          <div
            key={label}
            className={`bg-surface-container-low dark:bg-[#0d1829] p-6 border-t-2 ${accent}`}
          >
            <span className="text-[11px] uppercase tracking-widest text-on-surface-variant dark:text-[#828796] block mb-1">
              {label}
            </span>
            <span className="font-headline text-3xl font-bold text-primary dark:text-[#fbf9f4]">
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Filter + mark-all */}
      <div className="bg-surface dark:bg-[#0a1220] p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Type filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors ${
                  filter === t
                    ? "bg-primary dark:bg-[#fbf9f4] text-on-primary dark:text-[#030813]"
                    : "border border-outline-variant dark:border-[#1a202c] text-on-surface-variant dark:text-[#828796] hover:border-secondary dark:hover:border-brass hover:text-secondary dark:hover:text-brass"
                }`}
              >
                {t === "new_user" ? "New User" : t === "new_job" ? "New Job" : t === "recruiter_approval" ? "Approval" : t}
              </button>
            ))}
          </div>

          {/* Mark all read */}
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-[11px] font-bold uppercase tracking-widest text-secondary dark:text-brass border-b border-secondary dark:border-brass hover:text-primary hover:border-primary dark:hover:text-[#fbf9f4] dark:hover:border-[#fbf9f4] transition-colors self-start md:self-auto"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Result count */}
        <p className="text-[11px] uppercase tracking-widest text-on-surface-variant dark:text-[#828796] mb-4">
          {loading ? "Loading…" : `Showing ${items.length} of ${total} notices`}
        </p>

        {/* Error */}
        {error && (
          <div className="py-6 text-center text-error text-sm italic">{error}</div>
        )}

        {/* List */}
        {!loading && !error && items.length === 0 ? (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30 dark:text-[#1a202c] block mb-3">
              notifications_off
            </span>
            <p className="italic text-on-surface-variant dark:text-[#828796]">
              {total === 0
                ? "All notices have been dismissed."
                : "No notices match this filter."}
            </p>
          </div>
        ) : (
          <div>
            {items.map((n) => {
              const meta = TYPE_META[n.type] || TYPE_META.system;
              return (
                <div
                  key={n._id}
                  className={`group flex items-start gap-5 py-6 border-b border-outline-variant/20 dark:border-[#1a202c] -mx-8 px-8 transition-colors duration-150 hover:bg-surface-container-low dark:hover:bg-[#0d1829] ${
                    n.read ? "opacity-60" : ""
                  }`}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 w-11 h-11 bg-surface-container-highest dark:bg-[#1a202c] flex items-center justify-center">
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        n.type === "flag" ? "text-error" : "text-primary dark:text-[#fbf9f4]"
                      }`}
                    >
                      {n.icon}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start gap-2 mb-1">
                      <p className="font-headline text-[15px] leading-snug text-primary dark:text-[#fbf9f4]">
                        {n.title}
                      </p>
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest flex-shrink-0 ${meta.badge}`}>
                        {meta.label}
                      </span>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-error flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-sm italic text-on-surface-variant dark:text-[#828796] mt-1 leading-relaxed">
                      {n.body}
                    </p>
                    <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 dark:text-[#45474c] mt-2 block">
                      {formatTime(n.createdAt)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    {!n.read && (
                      <button
                        onClick={() => markRead(n._id)}
                        title="Mark as read"
                        className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold border border-outline-variant dark:border-[#1a202c] text-on-surface dark:text-[#fbf9f4] hover:border-secondary dark:hover:border-brass hover:text-secondary dark:hover:text-brass transition-colors"
                      >
                        Mark read
                      </button>
                    )}
                    <button
                      onClick={() => dismiss(n._id)}
                      title="Dismiss"
                      className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold bg-error text-white hover:bg-error/80 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
