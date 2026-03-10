import { BrowserRouter, Routes, Route } from "react-router-dom";

import StudentLayout from "../layouts/StudentLayout";
import Dashboard from "../pages/student/Dashboard";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/student" element={<StudentLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;