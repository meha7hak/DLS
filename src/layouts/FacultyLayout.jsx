import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { LayoutDashboard, User, Menu, LogOut, CheckCircle, XCircle, BookOpen } from "lucide-react";
import Particles from "../components/Particles";

function FacultyLayout() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const data = localStorage.getItem("userInfo");
    if (data) setUserInfo(JSON.parse(data));
  }, []);

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
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
        <Particles
          particleColors={["#d15c78", "#75001f", "#FEE2E2"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
          pixelRatio={1}
        />
      </div>
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
          background: "rgba(209, 92, 120, 0.5)",
          backdropFilter: "blur(10px)",
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
            {!isCollapsed && <h2 style={{ color: "#fff", margin: 0 }}>Faculty</h2>}
            {!isMobile && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#FEE2E2", display: "flex", alignItems: "center", padding: "4px" }}
              >
                <Menu size={24} />
              </button>
            )}
          </div>

          <div style={{ opacity: (isMobile && isCollapsed) ? 0 : 1, transition: "opacity 0.2s" }}>
            <NavItem to="/faculty/dashboard" icon={<LayoutDashboard size={20} />} isCollapsed={isCollapsed && !isMobile} location={location} end>Dashboard</NavItem>
            <NavItem to="/faculty/dashboard#reports" icon={<BookOpen size={20} />} isCollapsed={isCollapsed && !isMobile} location={location}>Reports</NavItem>
            <NavItem to="/faculty/approved" icon={<CheckCircle size={20} />} isCollapsed={isCollapsed && !isMobile} location={location}>Approved Leaves</NavItem>
            <NavItem to="/faculty/rejected" icon={<XCircle size={20} />} isCollapsed={isCollapsed && !isMobile} location={location}>Rejected Leaves</NavItem>
            <NavItem to="/faculty/profile" icon={<User size={20} />} isCollapsed={isCollapsed && !isMobile} location={location}>Profile</NavItem>
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
                background: "#9F1239",
                color: "#FECDD3",
                border: "none",
                cursor: "pointer",
                width: "100%",
                transition: "all 0.2s ease"
              }}
              title={isCollapsed ? "Logout" : ""}
            >
              <LogOut size={20} color="#FECDD3" />
              {(!isCollapsed || isMobile) && <span style={{ fontWeight: 500 }}>Logout</span>}
            </button>
          </div>

        </aside>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          <header style={{
            height: "60px",
            background: "rgba(209, 92, 120, 0.4)",
            backdropFilter: "blur(10px)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            gap: "15px",
            position: "sticky",
            top: 0,
            zIndex: 10
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              {isMobile && (
                <button
                  onClick={() => setIsCollapsed(false)}
                  style={{ background: "transparent", border: "none", cursor: "pointer", color: "#FEE2E2", display: "flex", alignItems: "center", padding: "4px" }}
                >
                  <Menu size={24} />
                </button>
              )}
              <h3 style={{ margin: 0 }}>Faculty Dashboard</h3>
            </div>

            {userInfo && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#fff" }}>{userInfo.name}</div>
                  <div style={{ fontSize: "12px", color: "#FEE2E2" }}>{userInfo.role.toUpperCase()}</div>
                </div>
                <div style={{ width: "35px", height: "35px", borderRadius: "50%", background: "#9F1239", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
                  {userInfo.name.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </header>

          <main style={{ padding: "20px", flex: 1, overflowX: "auto" }}>
            <Outlet />
          </main>

        </div>

      </div>
    </>
  );
}

function NavItem({ to, icon, children, isCollapsed, end, location }) {
  const currentHash = location.hash;
  
  return (
    <NavLink
      to={to}
      end={end}
      title={isCollapsed ? children : ""}
      style={({ isActive }) => {
        // If the link has a hash, only highlight if hash matches
        // If the link has no hash, only highlight if current location has no hash
        const reallyActive = to.includes('#') 
          ? currentHash === '#' + to.split('#')[1]
          : isActive && (currentHash === "" || currentHash === "#");

        return {
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "flex-start",
          gap: "10px",
          padding: "10px",
          borderRadius: "6px",
          marginBottom: "8px",
          background: reallyActive ? "#9F1239" : "transparent",
          color: reallyActive ? "#fff" : "#FFE4E6",
          whiteSpace: "nowrap",
          transition: "all 0.2s ease"
        };
      }}
    >
      {icon}
      {!isCollapsed && <span>{children}</span>}
    </NavLink>
  );
}

export default FacultyLayout;
