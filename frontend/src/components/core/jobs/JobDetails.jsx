import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { IoArrowBackOutline } from "react-icons/io5";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch job details from the backend
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/jobs/${id}`);
        const data = await response.json();

        if (response.ok) {
          setJob(data.job);
          console.log("specific job data: ", data);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleApply = () => {
    navigate(`/apply/${id}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto h-auto px-4 py-10">
      <div className="bg-stone-50 p-6 rounded-xl shadow-md space-y-5 relative">
        {/* Back Arrow */}
        <button
          onClick={handleGoBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition duration-200 mb-2"
        >
          <IoArrowBackOutline className="text-xl" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Job Title and Info */}
        <div className="mt-6">
          <h2 className="text-2xl text-center sm:text-3xl font-bold text-gray-800">
            {job.jobTitle}
          </h2>
          <p className="text-gray-500 mt-6 text-lg">
            {job.companyName} • {job.location}
          </p>

          <p className=" text-gray-700 text-lg mt-2 font-medium">
            Salary :{" "}
            <span className="text-blue-500 text-sm font-medium">
              {job.salaryRange}
            </span>
          </p>
        </div>

        {/* Job Type */}
        <div className="flex justify-start items-center space-x-4">
          <p className="text-lg font-semibold text-gray-800">Job Type :</p>
          <p className="text-gray-700">{job.jobType}</p>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            Job Description
          </h3>
          <p className="text-gray-700 leading-relaxed">{job.jobDescription}</p>
        </div>

        {/* Skills Required */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            Skills Required
          </h3>
          {job.skillRequired.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {job.skillRequired.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No skills listed.</p>
          )}
        </div>

        {/* Experience Required */}
        <div className="flex justify-start items-center space-x-4">
          <p className="text-lg font-semibold text-gray-800">
            Experience Required :
          </p>
          <p className="text-gray-700">{job.experienceRequired}</p>
        </div>

        {/* Requirements */}
        {/* <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            Requirements
          </h3>
          {job.requirements && job.requirements.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No requirements listed.</p>
          )}
        </div> */}

        {/* Posted Date */}
        <div className="flex justify-items-center items-center space-x-4">
          <p className="text-lg font-semibold text-gray-800">Posted Date :</p>
          <p className="text-gray-700">
            {new Date(job.postedDate).toLocaleDateString()}
          </p>
        </div>

        <div className="flex justify-items-center items-center space-x-4">
          <p className="text-lg font-semibold text-gray-800">Posted By :</p>
          <p className="text-gray-700">
            {job.postedBy.firstName} {job.postedBy.lastName}
          </p>
        </div>

        <div className="flex justify-items-center items-center space-x-4">
          <p className="text-lg font-semibold text-gray-800">Contact Email :</p>
          <p className="text-gray-700">{job.postedBy.email}</p>
        </div>

        {/* Apply Button */}
        <div className="text-center pt-4">
          <button
            onClick={handleApply}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
