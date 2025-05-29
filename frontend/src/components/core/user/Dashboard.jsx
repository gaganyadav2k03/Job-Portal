import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const fullName = user?.firstName + " " + user?.lastName;

  // If the user is not logged in, redirect to the login page
  if (!user) {
    navigate("/login");
    return null;
  }
  return (
    <div className="h-[100vh] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
          Welcome, {fullName}
        </h2>

        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-blend-color-burn">
          {/* Shared Profile Card */}
          <div className="bg-green-50 shadow-md rounded-xl p-5 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Your Profile
            </h3>
            <p className="text-gray-600 text-sm">
              Update your profile information and preferences.
            </p>
            <button
              onClick={() => navigate("/profile")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Manage Profile
            </button>
          </div>

          {/* Role-based Sections */}
          {user.accountType === "employer" ? (
            <>
              {/* Manage Job Postings */}
              <div className="bg-red-50 shadow-md rounded-xl p-5 hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Manage Job Postings
                </h3>
                <p className="text-gray-600 text-sm">
                  Create, Update, and Delete job openings.
                </p>
                <button
                  onClick={() => navigate("/manage-jobs")}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Manage Jobs
                </button>
              </div>

              {/* View Applicants */}
              <div className="bg-lime-100 shadow-md rounded-xl p-5 hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  View Applicants
                </h3>
                <p className="text-gray-600 text-sm">
                  See who applied for your job listings.
                </p>
                <button
                  onClick={() => navigate("/manage-jobs")}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  View Applicants
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Track Applied Jobs */}
              <div className="bg-orange-50 shadow-md rounded-xl p-5 hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Applied Jobs
                </h3>
                <p className="text-gray-600 text-sm">
                  Track status of jobs you’ve applied to.
                </p>
                <button
                  onClick={() => navigate("/applied-jobs")}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  View Applications
                </button>
              </div>

              {/* Manage Applications */}
              <div className="bg-pink-50 shadow-md rounded-xl p-5 hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Manage Applications
                </h3>
                <p className="text-gray-600 text-sm">
                  Edit or Withdraw your applications.
                </p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                  Manage
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
