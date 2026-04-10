import mockJobs from "../services/mockJobs.json";

export default function Jobs() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Open Positions</h1>
      <p className="mt-2 text-gray-600">
        {mockJobs.length} jobs found. (Placeholder page &mdash; Bruno will build
        search, filters, and pagination.)
      </p>
      <ul className="mt-8 space-y-4">
        {mockJobs.map((job) => (
          <li
            key={job.id}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-900">{job.title}</h2>
            <p className="text-sm text-gray-600">
              {job.institution} &middot; {job.location}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              ${job.salaryMin.toLocaleString()} &ndash; $
              {job.salaryMax.toLocaleString()} &middot; Deadline {job.deadline}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
