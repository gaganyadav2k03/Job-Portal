import { useState } from "react";

const Profile = () => {
  const [user, setUser] = useState({
    fullName: "Ranjan Kumar Chauhan",
    email: "ranjan@example.com",
    contact: "9876543210",
    role: "jobseeker", // or "employer"
    company: "Numetry Technologies",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Profile:", user);
    alert("Profile updated successfully!");
  };

  return (
    <div className="h-[100vh] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-stone-50 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
          Your Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={user.fullName}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              // onChange={handleChange}
              readOnly
              className="w-full border px-4 py-2 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
              // disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact
            </label>
            <input
              type="text"
              name="contact"
              value={user.contact}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <input
              type="text"
              name="role"
              value={user.role}
              readOnly
              className="w-full border px-4 py-2 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          {user.role === "employer" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="company"
                value={user.company}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
