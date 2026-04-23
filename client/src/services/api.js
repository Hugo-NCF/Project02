import { auth } from "./firebase";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5050/api";

const USE_MOCK_AUTH =
  import.meta.env.VITE_USE_MOCK_AUTH === "true" ||
  import.meta.env.VITE_FIREBASE_API_KEY === "placeholder_api_key";

async function getToken() {
  if (USE_MOCK_AUTH) {
    const raw = localStorage.getItem("campus_careers_mock_current_user");
    return raw ? btoa(raw) : null;
  }
  return auth.currentUser?.getIdToken() ?? null;
}

async function request(path, { method = "GET", body, token } = {}) {
  const t = token ?? await getToken();
  const headers = { "Content-Type": "application/json" };
  if (t) headers["Authorization"] = `Bearer ${t}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const error = new Error(err.error ?? `Request failed (${res.status})`);
    error.status = res.status;
    throw error;
  }

  return res.json();
}

// ── Admin — Users ──────────────────────────────────────────────────────────
export const adminApi = {
  /** Returns { items, total, page, limit } */
  getUsers: (params = {}) =>
    request(`/admin/users?${new URLSearchParams(params)}`),

  getUser: (id) => request(`/admin/users/${id}`),

  /** Accepts { name, role, isDisabled, recruiterStatus, profile } */
  updateUser: (id, data) =>
    request(`/admin/users/${id}`, { method: "PATCH", body: data }),

  deleteUser: (id) => request(`/admin/users/${id}`, { method: "DELETE" }),

  getPendingRecruiters: () => request("/admin/users/pending-recruiters"),

  approveRecruiter: (id) =>
    request(`/admin/users/${id}/approve`, { method: "POST" }),

  rejectRecruiter: (id) =>
    request(`/admin/users/${id}/reject`, { method: "POST" }),

  /** Returns { items, total, page, limit } */
  getJobs: (params = {}) =>
    request(`/admin/jobs?${new URLSearchParams(params)}`),

  /** Accepts { status } or any Job fields */
  updateJob: (id, data) =>
    request(`/admin/jobs/${id}`, { method: "PATCH", body: data }),

  deleteJob: (id) => request(`/admin/jobs/${id}`, { method: "DELETE" }),
};

// ── Notifications ──────────────────────────────────────────────────────────
export const notificationApi = {
  /** Returns { items, total, page, limit }. Params: { type, read, page, limit } */
  getAll: (params = {}) =>
    request(`/notifications?${new URLSearchParams(params)}`),

  create: (data) => request("/notifications", { method: "POST", body: data }),

  markRead: (id) => request(`/notifications/${id}/read`, { method: "PATCH" }),

  markAllRead: () => request("/notifications/mark-all-read", { method: "POST" }),

  dismiss: (id) => request(`/notifications/${id}`, { method: "DELETE" }),
};

// ── Bookmarks ──────────────────────────────────────────────────────────────
export const bookmarkApi = {
  /** Returns array of bookmarks with populated jobId */
  getAll: () => request("/bookmarks"),

  /** @param {string} jobId - MongoDB ObjectId string */
  add: (jobId) => request("/bookmarks", { method: "POST", body: { jobId } }),

  remove: (jobId) => request(`/bookmarks/${jobId}`, { method: "DELETE" }),

  /** Returns { bookmarked: boolean } */
  check: (jobId) => request(`/bookmarks/check/${jobId}`),
};

// ── Jobs ───────────────────────────────────────────────────────────────────
export const jobApi = {
  /** Returns { items, total, page, limit }. Params: { q, category, location, status, page, limit } */
  getAll: (params = {}) =>
    request(`/jobs?${new URLSearchParams(params)}`),

  /** Returns a single job object */
  getById: (id) => request(`/jobs/${id}`),
};

// ── Applications ───────────────────────────────────────────────────────────
export const applicationApi = {
  /** Submit an application. Sends multipart/form-data if resume file provided. */
  apply: async ({ jobId, resumeUrl, coverLetter, resumeFile, coverLetterFile }) => {
    if (resumeFile || coverLetterFile) {
      // File upload via FormData
      const formData = new FormData();
      formData.append("jobId", jobId);
      if (resumeFile) formData.append("resume", resumeFile);
      if (coverLetterFile) formData.append("coverLetterFile", coverLetterFile);
      if (coverLetter) formData.append("coverLetter", coverLetter);
      if (resumeUrl) formData.append("resumeUrl", resumeUrl);

      const t = await getToken();
      const headers = {};
      if (t) headers["Authorization"] = `Bearer ${t}`;

      const res = await fetch(`${BASE}/applications`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const error = new Error(err.error ?? `Request failed (${res.status})`);
        error.status = res.status;
        throw error;
      }
      return res.json();
    }

    // URL-only submission (no file)
    return request("/applications", {
      method: "POST",
      body: { jobId, resumeUrl, coverLetter },
    });
  },

  /** Get current user's applications. Returns { items, total, page, limit } */
  getMy: (params = {}) =>
    request(`/applications/my?${new URLSearchParams(params)}`),

  /** Check if user already applied to a job. Returns { applied: boolean } */
  check: (jobId) => request(`/applications/check/${jobId}`),

  /** Get applications for a specific job (recruiter). Returns { items, total } */
  getByJob: (jobId) => request(`/applications/job/${jobId}`),

  /** Update application status. Returns updated application */
  updateStatus: (id, status) =>
    request(`/applications/${id}/status`, { method: "PATCH", body: { status } }),
};

// ── Users ──────────────────────────────────────────────────────────────────
export const userApi = {
  /** Create / sync a MongoDB user record after Firebase registration. */
  sync: (data) => request("/users", { method: "POST", body: data }),
};
