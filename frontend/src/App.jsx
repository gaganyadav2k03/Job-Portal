import { Routes, Route } from "react-router-dom";
import SignUp from "./components/core/user/SignUp";
import Login from "./components/core/user/Login";
import Home from "./components/common/Home";
import Jobs from "./components/core/jobs/Jobs";
import Dashboard from "./components/core/user/Dashboard";
import ApplyForJob from "./components/core/jobs/ApplyForJob";
import JobDetails from "./components/core/jobs/JobDetails";
import Profile from "./components/core/user/Profile";
import ManageJobs from "./components/core/jobs/ManageJobs";
import ViewApplicants from "./components/core/jobs/ViewApplicants";
import CreateJob from "./components/core/jobs/CreateJob";
import UpdateJob from "./components/core/jobs/UpdateJob";
import AppliedJobs from "./components/core/jobs/AppliedJobs";
import Unauthorized from "./components/core/auth/Unauthorized";
import ProtectedRoute from "./components/core/auth/ProtectedRoute";
import RoleProtectedRoute from "./components/core/auth/RoleProtectedRoute";
import Layout from "./components/common/Layout";

function App() {
  return (
    <Routes>
      {/* Wrap all main routes with Layout */}
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<Login />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="job/:id" element={<JobDetails />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<Profile />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="apply/:id" element={<ApplyForJob />} />
        </Route>

        {/* Employer-specific Routes */}
        <Route element={<RoleProtectedRoute requiredRole="employer" />}>
          <Route path="manage-jobs" element={<ManageJobs />} />
          <Route path="add-job" element={<CreateJob />} />
          <Route path="update-job/:jobId" element={<UpdateJob />} />
          <Route path="job/:jobId/applicants" element={<ViewApplicants />} />
        </Route>

        {/* Job Seeker-specific Routes */}
        <Route element={<RoleProtectedRoute requiredRole="jobSeeker" />}>
          <Route path="applied-jobs" element={<AppliedJobs />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
