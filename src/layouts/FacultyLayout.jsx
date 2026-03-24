import { Outlet } from "react-router-dom";
import ShapeGrid from "../components/Background";

function FacultyLayout() {
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
        {/* Placeholder for Sidebar */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Placeholder for Topbar */}
          <main style={{ padding: "20px", flex: 1 }}>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

export default FacultyLayout;
