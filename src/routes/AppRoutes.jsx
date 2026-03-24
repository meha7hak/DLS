import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/common/Login";
import RoleSelect from "../pages/common/RoleSelect";
import Register from "../pages/student/Register";
import StudentLayout from "../layouts/StudentLayout";
import Dashboard from "../pages/student/Dashboard";
import ApplyLeave from "../pages/student/ApplyLeave";
import FacultyLayout from "../layouts/FacultyLayout";
import HodLayout from "../layouts/HodLayout";
import FacultyDashboard from "../pages/faculty/Dashboard";
import HodDashboard from "../pages/hod/Dashboard";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/role-select" element={<RoleSelect />} />
        <Route path="/register" element={<Register />} />

        {/* STUDENT ROUTES */}
        <Route path="/student" element={<StudentLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="apply" element={<ApplyLeave />} />
        </Route>

        {/* FACULTY ROUTES */}
        <Route path="/faculty" element={<FacultyLayout />}>
          <Route path="dashboard" element={<FacultyDashboard />} />
        </Route>

        {/* HOD ROUTES */}
        <Route path="/hod" element={<HodLayout />}>
          <Route path="dashboard" element={<HodDashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;