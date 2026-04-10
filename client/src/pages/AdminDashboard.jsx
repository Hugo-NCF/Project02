import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900">
        Admin Dashboard
      </h1>
      <p className="mt-2 text-gray-600">
        Signed in as {currentUser?.email}. Placeholder &mdash; Sebastian is building the full version.
      </p>
    </div>
  );
}
