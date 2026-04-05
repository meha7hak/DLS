import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LayoutDashboard, LogOut, Menu } from "lucide-react";
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
        borderColor="#1E3A8A"
        hoverFillColor="#FEF08A"
        shape="square"
        hoverTrailAmount={0}
      />
      <div style={{ display: "flex", minHeight: "100vh", position: "relative", zIndex: 1, overflowX: "hidden" }}>
        
        {/* Mobile Overlay Background */}
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
          background: "#fff",
          borderRight: "1px solid #E2E8F0",
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
            {!isCollapsed && <h2 style={{ color: "#0D9488", margin: 0 }}>Coordinator</h2>}
            {!isMobile && (
              <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#475569", display: "flex", alignItems: "center", padding: "4px" }}
              >
                <Menu size={24} />
              </button>
            )}
          </div>

          <div style={{ opacity: (isMobile && isCollapsed) ? 0 : 1, transition: "opacity 0.2s" }}>
            <NavItem to="/coordinator/dashboard" icon={<LayoutDashboard size={20}/>} isCollapsed={isCollapsed && !isMobile}>Dashboard</NavItem>
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
              {(!isCollapsed || isMobile) && <span style={{ fontWeight: 500 }}>Logout</span>}
            </button>
          </div>
        </aside>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, marginLeft: isMobile ? 0 : 0 }}>
          <header style={{
            height: "60px",
            background: "#fff",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: "15px"
          }}>
            {isMobile && (
              <button 
                onClick={() => setIsCollapsed(false)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#475569", display: "flex", alignItems: "center", padding: "4px" }}
              >
                <Menu size={24} />
              </button>
            )}
            <h3>Coordinator Dashboard</h3>
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

export default CoordinatorLayout;
