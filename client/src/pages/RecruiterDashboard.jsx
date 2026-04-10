import { useAuth } from "../context/AuthContext";

export default function RecruiterDashboard() {
  const { currentUser } = useAuth();
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome, {currentUser?.name || "Recruiter"}
      </h1>
      <p className="mt-2 text-gray-600">
        Placeholder dashboard &mdash; Darius is building the full version.
      </p>
    </div>
  );
}
