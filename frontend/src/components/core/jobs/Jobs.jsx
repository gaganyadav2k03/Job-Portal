import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaFilter,
  FaMapMarkerAlt,
  FaBriefcase,
  FaUser,
  FaBuilding,
} from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Jobs = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchText = queryParams.get("search") || "";

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  // 🛑 Filters
  const [showFilters, setShowFilters] = useState(false);
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState(""); // New company filter

  const [tempLocation, setTempLocation] = useState("");
  const [tempJobType, setTempJobType] = useState("");
  const [tempExperience, setTempExperience] = useState("");
  const [tempCompany, setTempCompany] = useState(""); // Temporary company state

  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      let query = `?page=${page}&limit=${limit}&search=${searchText}`;

      if (locationFilter) query += `&location=${locationFilter}`;
      if (jobTypeFilter) query += `&jobType=${jobTypeFilter}`;
      if (experienceFilter) query += `&experienceRequired=${experienceFilter}`;
      if (companyFilter) query += `&company=${companyFilter}`; // Include company in query

      const response = await fetch(`${BASE_URL}/api/v1/jobs${query}`);
      const data = await response.json();

      if (data.success) {
        setJobs(data.jobs);
        setTotalPages(data.totalPages);
      } else {
        setError(data.message || "Failed to load jobs");
      }
    } catch (error) {
      console.error("Error fetching jobs: ", error);
      setError("Something went wrong while fetching jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [
    page,
    limit,
    searchText,
    locationFilter,
    jobTypeFilter,
    experienceFilter,
    companyFilter, // Trigger fetching when company filter changes
  ]);

  const handleApply = (jobId) => {
    navigate(`/apply/${jobId}`);
  };

  const handleViewJob = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleFilterApply = () => {
    setLocationFilter(tempLocation);
    setJobTypeFilter(tempJobType);
    setExperienceFilter(tempExperience);
    setCompanyFilter(tempCompany); // Apply company filter
    setPage(1); // reset to page 1
    setShowFilters(false); // close the filters
  };

  const handleClearFilters = () => {
    setTempLocation("");
    setTempJobType("");
    setTempExperience("");
    setTempCompany(""); // Clear company filter
    setLocationFilter("");
    setJobTypeFilter("");
    setExperienceFilter("");
    setCompanyFilter(""); // Clear applied company filter
    setPage(1);
    setShowFilters(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 h-[100vh]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Available Jobs</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
        >
          <FaFilter className="mr-2" /> Filter
        </button>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="mb-8 p-4 border rounded-lg bg-white shadow-lg w-full flex space-y-4">
          <div className="flex w-full gap-6">
            {/* Location Filter */}
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm mb-1 font-medium">
                <FaMapMarkerAlt className="inline-block mr-2 text-gray-600" />
                Location
              </label>
              <input
                type="text"
                value={tempLocation}
                onChange={(e) => setTempLocation(e.target.value)}
                className="border border-gray-300 w-52 rounded-md p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 text-sm"
                placeholder="Enter location"
              />
            </div>

            {/* Company Filter */}
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm mb-1 font-medium">
                <FaBuilding className="inline-block mr-2 text-gray-600" />
                Company
              </label>
              <input
                type="text"
                value={tempCompany}
                onChange={(e) => setTempCompany(e.target.value)}
                className="border border-gray-300 w-52 rounded-md p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 text-sm"
                placeholder="Enter company"
              />
            </div>

            {/* Job Type Filter */}
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm mb-1 font-medium">
                <FaBriefcase className="inline-block mr-2 text-gray-600" />
                Job Type
              </label>
              <select
                value={tempJobType}
                onChange={(e) => setTempJobType(e.target.value)}
                className="border border-gray-300 w-52 rounded-md p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 text-sm"
              >
                <option value="">Select Job Type</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            {/* Experience Filter */}
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm mb-1 font-medium">
                <FaUser className="inline-block mr-2 text-gray-600" />
                Experience
              </label>
              <select
                value={tempExperience}
                onChange={(e) => setTempExperience(e.target.value)}
                className="border border-gray-300 w-52 rounded-md p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 text-sm"
              >
                <option value="">Select Experience Level</option>
                <option value="fresher">Fresher</option>
                <option value="1-3 years">1-3 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5+ years">5+ years</option>
              </select>
            </div>
          </div>

          {/* Filter Action Buttons */}
          <div className="flex w-full justify-end gap-6 p-5">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 text-sm"
            >
              Clear All
            </button>
            <button
              onClick={handleFilterApply}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Jobs List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading jobs...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : jobs.length === 0 ? (
        <p className="text-center text-gray-500">No jobs found.</p>
      ) : (
        <div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition bg-white"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  {job.jobTitle}
                </h2>
                <p className="text-gray-600 text-sm mb-2">
                  {job.companyName || "Company Name"}
                </p>
                <p className="text-gray-500 text-sm mb-3">
                  <FaMapMarkerAlt className="inline-block mr-1" />
                  {job.location}
                </p>
                <p className="text-gray-500 text-sm mb-3">
                  <FaBriefcase className="inline-block mr-1" />
                  {job.jobType}
                </p>
                <p className="text-gray-400 text-xs mb-4">
                  🕓 Posted {new Date(job.createdAt).toLocaleDateString()}
                </p>

                <div className="flex space-x-4">
                  <button
                    onClick={() => handleApply(job._id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                  >
                    Apply Now
                  </button>
                  <button
                    onClick={() => handleViewJob(job._id)}
                    className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 text-sm"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-200 disabled:bg-gray-100"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-200 disabled:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
