import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/common/Login";
import RoleSelect from "../pages/common/RoleSelect";
import Register from "../pages/student/Register";
import StudentLayout from "../layouts/StudentLayout";
import Dashboard from "../pages/student/Dashboard";
import ApplyLeave from "../pages/student/ApplyLeave";
import MyApplications from "../pages/student/MyApplications";
import StudentProfile from "../pages/student/Profile";
import FacultyLayout from "../layouts/FacultyLayout";
import HodLayout from "../layouts/HodLayout";
import FacultyDashboard from "../pages/faculty/Dashboard";
import FacultyProfile from "../pages/faculty/Profile";
import HodDashboard from "../pages/hod/Dashboard";
import HodProfile from "../pages/hod/Profile";
import HodRegister from "../pages/hod/Register";
import CoordinatorLayout from "../layouts/CoordinatorLayout";
import CoordinatorDashboard from "../pages/coordinator/Dashboard";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/role-select" element={<RoleSelect />} />
        <Route path="/register" element={<Register />} />
        <Route path="/hod/register" element={<HodRegister />} />

        {/* COORDINATOR ROUTES */}
        <Route path="/coordinator" element={<CoordinatorLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path=":status" element={<CoordinatorDashboard />} />
        </Route>

        {/* STUDENT ROUTES */}
        <Route path="/student" element={<StudentLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="apply" element={<ApplyLeave />} />
          <Route path="applications" element={<MyApplications />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        {/* FACULTY ROUTES */}
        <Route path="/faculty" element={<FacultyLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="profile" element={<FacultyProfile />} />
          <Route path=":status" element={<FacultyDashboard />} />
        </Route>

        {/* HOD ROUTES */}
        <Route path="/hod" element={<HodLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="profile" element={<HodProfile />} />
          <Route path=":status" element={<HodDashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;