import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";

function Dashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("userInfo");
    if (data) {
      setUserInfo(JSON.parse(data));
    }
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/leave/my-leaves", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLeaves(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = leaves.filter(l => l.status.includes('Pending')).length;
  const approvedCount = leaves.filter(l => l.status === 'Approved').length;
  const rejectedCount = leaves.filter(l => l.status === 'Rejected').length;

  return (
    <div>
      <h2 style={{ marginBottom: "20px", textTransform: "capitalize" }}>
        {userInfo ? `${userInfo.name}'s Dashboard` : "Dashboard"}
      </h2>

      {/* STATS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        marginBottom: "30px"
      }}>
        <StatCard title="Pending Requests" value={pendingCount} color="#F59E0B" />
        <StatCard title="Approved" value={approvedCount} color="#22C55E" />
        <StatCard title="Rejected" value={rejectedCount} color="#EF4444" />
      </div>

      {/* RECENT APPLICATIONS */}
      <div style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "24px",
        border: "1px solid #E2E8F0",
        maxWidth: "900px",
        margin: "0 auto"
      }}>
        <h3 style={{ marginBottom: "20px", color: "#1e293b" }}>Recent Applications</h3>

        {loading ? (
          <p>Loading...</p>
        ) : leaves.length === 0 ? (
          <p style={{ color: "#64748b", textAlign: "center", padding: "20px" }}>No recent applications found.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {leaves.map((leave) => (
              <div key={leave._id} style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
                border: "1px solid #f1f5f9",
                borderRadius: "10px",
                background: "#fafafa",
                transition: "all 0.2s",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
              }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: "0 0 4px 0", color: "#0f172a" }}>{leave.eventName}</h4>
                  <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
                    {new Date(leave.eventDate).toLocaleDateString()} • {leave.slots.length} Slots
                  </p>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <StatusBadge status={leave.status} />
                  
                  {leave.status === "Rejected" && (
                     <button
                        onClick={() => navigate("/student/apply", { state: { editLeave: leave } })}
                        style={{
                          background: "#fff",
                          border: "1px solid #0D9488",
                          color: "#0D9488",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: "500",
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "#0D9488";
                          e.target.style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "#fff";
                          e.target.style.color = "#0D9488";
                        }}
                     >
                        Edit & Re-submit
                     </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;