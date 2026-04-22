// Centralized API client for Campus Careers backend.
//
// Auth tokens: In mock-auth mode the frontend base64-encodes the stored user
// object as a Bearer token, which the server's verifyToken stub decodes.
// When Jose wires up Firebase Admin SDK, the real Firebase idToken will be
// retrieved from firebase.auth().currentUser.getIdToken() instead.

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5050/api";

/** Returns the dev/mock Bearer token from localStorage. */
function getDevToken() {
  const raw = localStorage.getItem("campus_careers_mock_current_user");
  return raw ? btoa(raw) : null;
}

/**
 * Core fetch wrapper.
 * @param {string} path  - API path (e.g. "/admin/users")
 * @param {object} opts  - { method, body, token }
 */
async function request(path, { method = "GET", body, token } = {}) {
  const t = token ?? getDevToken();
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

      const t = getDevToken();
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
