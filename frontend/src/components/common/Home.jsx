// import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  // useEffect(() => {
  //   try {
  //     const response = axios.get("");
  //   } catch (error) {
  //     console.log("error during check login", error);
  //   }
  // }, []);

  return (
    <div className="px-4 py-12 max-w-7xl mx-auto h-[100vh]">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Welcome to Job Portal
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-6">
          Find your dream job or hire top talent. Simple. Fast. Effective.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/jobs")}
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded text-base hover:bg-blue-50 transition"
          >
            View Jobs
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded text-base hover:bg-blue-50 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
          Why Choose Us?
        </h2>
        <ul className="text-gray-700 space-y-2 text-lg">
          <li>✅ Simple and Easy to Use</li>
          <li>✅ Quick Job Search</li>
          <li>✅ Clean and Modern UI</li>
          <li>✅ Browse hundreds of jobs and candidates</li>
        </ul>
      </div>
    </div>
  );
}
