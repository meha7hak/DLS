import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { LayoutDashboard, LogOut, Menu, CheckCircle, XCircle } from "lucide-react";
import ShapeGrid from "../components/Background";

function CoordinatorLayout() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        borderColor="#bb1fbc82"
        hoverFillColor="#FEF08A"
        shape="square"
        hoverTrailAmount={0}
      />
      <div style={{ display: "flex", minHeight: "100vh", position: "relative", zIndex: 1, overflowX: "hidden" }}>

        {isMobile && !isCollapsed && (
          <div
            onClick={() => setIsCollapsed(true)}
            style={{
              position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(0,0,0,0.5)", zIndex: 40
            }}
          />
        )}

        <aside style={{
          width: isMobile ? (isCollapsed ? "0px" : "240px") : (isCollapsed ? "80px" : "240px"),
          transition: "width 0.3s ease",
          background: "#bb1fbc82",
          borderRight: "none",
          padding: (isMobile && isCollapsed) ? "0" : (isCollapsed ? "20px 10px" : "20px"),
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: isMobile ? "fixed" : "relative",
          height: "100vh",
          zIndex: 50,
          whiteSpace: "nowrap"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: isCollapsed ? "center" : "space-between", marginBottom: "30px", opacity: (isMobile && isCollapsed) ? 0 : 1 }}>
            {!isCollapsed && <h2 style={{ color: "#fff", margin: 0 }}>Coordinator</h2>}
            {!isMobile && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#DBEAFE", display: "flex", alignItems: "center", padding: "4px" }}
              >
                <Menu size={24} />
              </button>
            )}
          </div>

          <div style={{ opacity: (isMobile && isCollapsed) ? 0 : 1, transition: "opacity 0.2s" }}>
            <NavItem to="/coordinator/dashboard" icon={<LayoutDashboard size={20} />} isCollapsed={isCollapsed && !isMobile}>Dashboard</NavItem>
            <NavItem to="/coordinator/approved" icon={<CheckCircle size={20} />} isCollapsed={isCollapsed && !isMobile}>Approved Leaves</NavItem>
            <NavItem to="/coordinator/rejected" icon={<XCircle size={20} />} isCollapsed={isCollapsed && !isMobile}>Rejected Leaves</NavItem>
          </div>

          <div style={{ flex: 1 }}></div>

          <div style={{ opacity: (isMobile && isCollapsed) ? 0 : 1, transition: "opacity 0.2s" }}>
            <button
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: (isCollapsed && !isMobile) ? "center" : "flex-start",
                gap: "10px",
                padding: "10px",
                borderRadius: "6px",
                background: "#f1331eff",
                color: "#BFDBFE",
                border: "none",
                cursor: "pointer",
                width: "100%",
                transition: "all 0.2s ease"
              }}
              title={isCollapsed ? "Logout" : ""}
            >
              <LogOut size={20} color="#BFDBFE" />
              {(!isCollapsed || isMobile) && <span style={{ fontWeight: 500 }}>Logout</span>}
            </button>
          </div>
        </aside>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <header style={{
            height: "60px",
            background: "#b49edb",
            color: "#fff",
            borderBottom: "none",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: "15px"
          }}>
            {isMobile && (
              <button
                onClick={() => setIsCollapsed(false)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#DBEAFE", display: "flex", alignItems: "center", padding: "4px" }}
              >
                <Menu size={24} />
              </button>
            )}
            <h3 style={{ margin: 0 }}>Coordinator Dashboard</h3>
          </header>
          <main style={{ padding: "20px", flex: 1, overflowX: "auto" }}>
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
        background: isActive ? "#b49edb" : "transparent",
        color: isActive ? "#fff" : "#EFF6FF",
        whiteSpace: "nowrap",
        transition: "all 0.2s ease"
      })}
    >
      {icon}
      {!isCollapsed && <span>{children}</span>}
    </NavLink>
  );
}

export default CoordinatorLayout;
