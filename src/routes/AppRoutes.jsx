import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoleSelect from "../pages/common/RoleSelect";

import StudentLayout from "../layouts/StudentLayout";
import Dashboard from "../pages/student/Dashboard";
import ApplyLeave from "../pages/student/ApplyLeave";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<RoleSelect />} />

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