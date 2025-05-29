import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UpdateJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    companyName: "",
    location: "",
    jobType: "full-time",
    salaryRange: "",
    skillRequired: [],
    experienceRequired: "fresher",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch existing job data
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/jobs/${jobId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const job = response.data.job;
        console.log("fetched job :", job);

        setFormData({
          ...job,
          skillRequired: job.skillRequired || [],
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load job");
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For skillRequired input (comma-separated)
    if (name === "skillRequired") {
      setFormData({
        ...formData,
        [name]: value.split(",").map((skill) => skill.trim()),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BASE_URL}/api/v1/jobs/${jobId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate("/manage-jobs");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update job");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto h-[100vh] bg-white p-4 px-10 shadow-md rounded-lg mt-8">
      <h2 className="text-2xl text-center font-bold">Update Job</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-1 mb-4">
        <div>
          <label className="block text-gray-700">Job Title</label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Job Description</label>
          <textarea
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            rows={4}
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Job Type</label>
          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="internship">Internship</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700">Salary Range</label>
          <input
            type="text"
            name="salaryRange"
            value={formData.salaryRange}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-gray-700">
            Skills Required (comma separated)
          </label>
          <input
            type="text"
            name="skillRequired"
            value={formData.skillRequired.join(", ")}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-gray-700">Experience Required</label>
          <select
            name="experienceRequired"
            value={formData.experienceRequired}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="fresher">Fresher</option>
            <option value="1+ years">1+ Years</option>
            <option value="3+ years">3+ Years</option>
            <option value="5+ years">5+ Years</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Update Job
        </button>
      </form>
    </div>
  );
};

export default UpdateJob;
