import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <div className="max-w-3xl">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Find your next academic career.
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          Campus Careers is the hiring platform for universities, colleges, and
          research institutions. Browse thousands of faculty, research, and
          administrative positions.
        </p>
        <div className="mt-10 flex gap-4">
          <Link
            to="/jobs"
            className="rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Browse Jobs
          </Link>
          <Link
            to="/register"
            className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
          >
            Post a Job
          </Link>
        </div>
      </div>
    </div>
  );
}
