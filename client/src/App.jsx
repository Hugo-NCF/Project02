import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import ApplyForm from "./pages/ApplyForm";
import SeekerDashboard from "./pages/SeekerDashboard";
import ProfileEdit from "./pages/ProfileEdit";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
import Applicants from "./pages/Applicants";
import CompanyProfile from "./pages/CompanyProfile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminJobs from "./pages/AdminJobs";
import AdminNotifications from "./pages/AdminNotifications";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route
              path="/jobs/:id/apply"
              element={
                <ProtectedRoute allowedRoles={["seeker"]}>
                  <ApplyForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/seeker"
              element={
                <ProtectedRoute allowedRoles={["seeker"]}>
                  <SeekerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seeker/profile"
              element={
                <ProtectedRoute allowedRoles={["seeker"]}>
                  <ProfileEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/create-job"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <CreateJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/edit-job/:id"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <EditJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/jobs/:id/applicants"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <Applicants />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/company-profile"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <CompanyProfile />
                </ProtectedRoute>
              }
            />

            {/* Admin routes — all nested under AdminLayout (sidebar) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="jobs" element={<AdminJobs />} />
              <Route path="notifications" element={<AdminNotifications />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
