import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiEdit,
  FiTrash2,
  FiPlusCircle,
  FiArrowLeft,
  FiUsers,
} from "react-icons/fi";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ManageJobs = () => {
  const navigate = useNavigate();
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 5;
  const [total, setTotal] = useState(0); // For total jobs from backend

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/v1/jobs/my-jobs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await response.json();
      // console.log("result: ", result);

      if (result.success) {
        setJobPosts(result.jobs);
        console.log("jobs: ", result.jobs);

        setTotal(result.total || 0);
      } else {
        setError(result.message || "Failed to fetch jobs");
      }
    } catch (err) {
      setError("Something went wrong while fetching jobs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const handleEdit = (id) => {
    navigate(`/update-job/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${BASE_URL}/api/v1/jobs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        alert("Job deleted successfully");
        // Refetch job list to update UI
        fetchJobs();
      } else {
        alert(result.message || "Failed to delete the job");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Something went wrong while deleting the job.");
    }
  };

  const handleAddJob = () => {
    navigate("/add-job");
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-5xl mx-auto h-[100vh] px-4 py-10">
      <button
        onClick={handleBack}
        className="flex items-center text-blue-600 hover:text-blue-800 transition mb-4"
      >
        <FiArrowLeft className="mr-2" />
        Back to Dashboard
      </button>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Manage Job Postings
        </h2>
        <button
          onClick={handleAddJob}
          className="flex items-center gap-2 bg-indigo-500 font-semibold text-gray-100 px-4 py-2 rounded-md hover:bg-indigo-600 transition"
        >
          <FiPlusCircle className="text-lg" />
          Post Job
        </button>
      </div>

      {loading ? (
        <p>Loading jobs...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : jobPosts.length === 0 ? (
        <p>No job postings found.</p>
      ) : (
        <>
          <div className="space-y-4">
            {jobPosts.map((job) => (
              <div
                key={job._id}
                className="bg-white shadow-sm border p-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {job.jobTitle}
                  </h3>
                  <p className="text-sm text-gray-500 space-x-3">
                    Location: {job.location} | Applicants:{" "}
                    {job.applicants?.length || 0}
                  </p>
                  <p className="text-xs text-gray-400">
                    Posted on: {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-3 justify-end space-x-4">
                  <button
                    onClick={() => navigate(`/job/${job._id}/applicants`)}
                    className="flex items-center gap-1 text-green-600 hover:text-green-800 transition"
                  >
                    <FiUsers /> View Applicants
                  </button>
                  <button
                    onClick={() => handleEdit(job._id)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                  >
                    <FiEdit />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 transition"
                  >
                    <FiTrash2 />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className={`px-3 py-1 rounded ${
                  page === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Prev
              </button>
              <span className="text-sm text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
                className={`px-3 py-1 rounded ${
                  page === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageJobs;
