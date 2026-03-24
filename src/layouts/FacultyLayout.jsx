import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LayoutDashboard, Users, FileText, User, Menu, LogOut } from "lucide-react";
import ShapeGrid from "../components/Background";

function FacultyLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <>
      <ShapeGrid 
        speed={0.5}
        squareSize={40}
        direction="left"
        borderColor="#271E37"
        hoverFillColor="#222222"
        shape="hexagon"
        hoverTrailAmount={0}
      />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        
      <aside style={{
        width: isCollapsed ? "80px" : "240px",
        transition: "width 0.3s ease",
        background: "#fff",
        borderRight: "1px solid #E2E8F0",
        padding: isCollapsed ? "20px 10px" : "20px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        
        <div style={{ display: "flex", alignItems: "center", justifyContent: isCollapsed ? "center" : "space-between", marginBottom: "30px" }}>
          {!isCollapsed && <h2 style={{ color: "#0D9488", margin: 0 }}>Faculty</h2>}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "#475569", display: "flex", alignItems: "center", padding: "4px" }}
          >
            <Menu size={24} />
          </button>
        </div>

        <NavItem to="/faculty/dashboard" icon={<LayoutDashboard size={20}/>} isCollapsed={isCollapsed}>Dashboard</NavItem>
        <NavItem to="/faculty/requests" icon={<FileText size={20}/>} isCollapsed={isCollapsed}>Requests</NavItem>
        <NavItem to="/faculty/students" icon={<Users size={20}/>} isCollapsed={isCollapsed}>My Students</NavItem>
        <NavItem to="/faculty/profile" icon={<User size={20}/>} isCollapsed={isCollapsed}>Profile</NavItem>

        <div style={{ flex: 1 }}></div>

        <button 
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "flex-start",
            gap: "10px",
            padding: "10px",
            borderRadius: "6px",
            background: "#FEE2E2",
            color: "#EF4444",
            border: "none",
            cursor: "pointer",
            width: "100%",
            transition: "all 0.2s ease"
          }}
          title={isCollapsed ? "Logout" : ""}
        >
          <LogOut size={20} />
          {!isCollapsed && <span style={{ fontWeight: 500 }}>Logout</span>}
        </button>

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
          <h3>Faculty Dashboard</h3>
        </header>

        {/* Page Content */}
        <main style={{ padding: "20px" }}>
          <Outlet />
        </main>

      </div>

    </div>
    </>
  );
}

function NavItem({ to, icon, children, isCollapsed }) {
  return (
    <NavLink
      to={to}
      title={isCollapsed ? children : ""}
      style={({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: isCollapsed ? "center" : "flex-start",
        gap: "10px",
        padding: "10px",
        borderRadius: "6px",
        marginBottom: "8px",
        background: isActive ? "#CCFBF1" : "transparent",
        color: isActive ? "#0D9488" : "#475569",
        whiteSpace: "nowrap",
        transition: "all 0.2s ease"
      })}
    >
      {icon}
      {!isCollapsed && <span>{children}</span>}
    </NavLink>
  );
}

export default FacultyLayout;
