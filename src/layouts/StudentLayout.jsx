import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, FilePlus, ClipboardList, User } from "lucide-react";

function StudentLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      <aside style={{
        width: "240px",
        background: "#fff",
        borderRight: "1px solid #E2E8F0",
        padding: "20px"
      }}>
        
        <h2 style={{ marginBottom: "30px", color: "#0D9488" }}>DLS</h2>

        <NavItem to="/student/dashboard" icon={<LayoutDashboard size={18}/>}>Dashboard</NavItem>
        <NavItem to="/student/apply" icon={<FilePlus size={18}/>}>Apply Leave</NavItem>
        <NavItem to="/student/applications" icon={<ClipboardList size={18}/>}>My Applications</NavItem>
        <NavItem to="/student/profile" icon={<User size={18}/>}>Profile</NavItem>

      </aside>

      {/* Right Section */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Topbar */}
        <header style={{
          height: "60px",
          background: "#fff",
          borderBottom: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          padding: "0 20px"
        }}>
          <h3>Student Dashboard</h3>
        </header>

        {/* Page Content */}
        <main style={{ padding: "20px" }}>
          <Outlet />
        </main>

      </div>

    </div>
  );
}

function NavItem({ to, icon, children }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px",
        borderRadius: "6px",
        marginBottom: "8px",
        background: isActive ? "#CCFBF1" : "transparent",
        color: isActive ? "#0D9488" : "#475569"
      })}
    >
      {icon}
      {children}
    </NavLink>
  );
}

export default StudentLayout;