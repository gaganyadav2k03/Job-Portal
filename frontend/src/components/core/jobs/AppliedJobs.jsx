import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoBriefcaseOutline, IoArrowBackOutline } from "react-icons/io5";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch applications when component mounts
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/v1/applications/my-applications`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();
        console.log("applied job data: ", data);

        if (data.success) {
          setAppliedJobs(data.applications);
        } else {
          setError(data.message || "Failed to fetch applied jobs");
        }
      } catch (err) {
        setError("An error occurred while fetching applications");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <p>Loading applied jobs...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="max-w-5xl mx-auto h-[100vh] px-4 py-10">
      {/* Back Arrow */}
      <div className="mb-4">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-800 transition"
        >
          <IoArrowBackOutline className="text-xl mr-2" />
          Back
        </button>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        My Applications
      </h2>

      {appliedJobs.length === 0 ? (
        <p className="text-center text-gray-500">
          You haven’t applied to any jobs yet.
        </p>
      ) : (
        <div className="space-y-4">
          {appliedJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-4 shadow-sm border border-gray-500 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <IoBriefcaseOutline className="text-2xl text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {job.jobId.jobTitle}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {job.jobId.companyName} • {job.jobId.location}
                  </p>
                  <p className="text-xs text-gray-400">
                    Applied on: {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:items-end gap-2">
                <span
                  className={`text-sm font-medium px-2 py-1 rounded-full ${
                    job.status === "Interview Scheduled"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {job.status}
                </span>
                <button
                  onClick={() => navigate(`/job/${job.jobId._id}`)}
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  View Job
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
