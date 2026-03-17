import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/common/Login";
import RoleSelect from "../pages/common/RoleSelect";
import Register from "../pages/student/Register";
import StudentLayout from "../layouts/StudentLayout";
import Dashboard from "../pages/student/Dashboard";
import ApplyLeave from "../pages/student/ApplyLeave";

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

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;