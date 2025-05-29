import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoCloudUploadOutline } from "react-icons/io5";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/slices/authSlice";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ApplyForJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    resume: null,
    coverLetter: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("jobId", id);
    formDataToSubmit.append("resume", formData.resume);
    formDataToSubmit.append("coverLetter", formData.coverLetter);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        logoutAndRedirect();
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/api/v1/applications/apply/${id}`,
        formDataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("response apply: ", response);

      if (response.data.success) {
        alert("Application submitted successfully!");
        navigate("/jobs");
      } else {
        alert(response.data.message || "Something went wrong.");
        console.error(response.data.error);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        logoutAndRedirect();
      } else {
        console.error(
          "Error submitting application:",
          error.response?.data?.message || error.message
        );
        alert(
          error.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      }
    }
  };

  const logoutAndRedirect = () => {
    alert("Session expired. Please login again.");

    dispatch(logout()); // <-- Clear Redux auth state
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
    // window.location.reload(); // optional: full reload to reset app state
  };

  return (
    <div className="max-w-xl mx-auto h-[100vh] px-4 py-10">
      <h1 className="text-xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
        Apply for Job #{id}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-pink-50 shadow-lg p-6 flex flex-col justify-center items-center rounded-xl space-y-5"
        encType="multipart/form-data"
      >
        {/* Resume Upload */}
        <div className="sm:w-4/5 ">
          <label className="block text-sm font-medium mb-1">Resume (pdf)</label>
          <div className="flex items-center gap-3 border px-3 py-2 rounded-md bg-pink-50">
            <IoCloudUploadOutline className="text-2xl text-gray-500" />
            <input
              type="file"
              name="resume"
              accept=".pdf"
              onChange={handleChange}
              required
              className="w-full bg-transparent text-sm text-gray-700 focus:outline-none"
            />
          </div>
        </div>

        {/* Cover Letter */}
        <div className="sm:w-4/5 w-auto">
          <label className="block text-sm font-medium mb-1">Cover Letter</label>
          <textarea
            name="coverLetter"
            rows={4}
            placeholder="Write a short cover letter..."
            value={formData.coverLetter}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full sm:w-4/5 bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default ApplyForJob;
