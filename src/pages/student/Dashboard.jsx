import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";
import { io } from "socket.io-client";

function Dashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    const data = localStorage.getItem("userInfo");
    if (data) {
      setUserInfo(JSON.parse(data));
    }
    fetchLeaves();
    const newSocket = io(API_BASE);
    newSocket.on("leaveCreated", () => fetchLeaves());
    newSocket.on("leaveUpdated", () => fetchLeaves());
    return () => newSocket.disconnect();
  }, []);

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/leave/my-leaves`, {
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

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this leave application?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/leave/delete/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setLeaves(leaves.filter(l => l._id !== id));
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete");
      }
    } catch(err) {
      console.error(err);
      alert("Error deleting application.");
    }
  };

  const pendingCount = leaves.filter(l => l.status.includes('PENDING')).length;
  const approvedCount = leaves.filter(l => l.status === 'FINAL_APPROVED').length;
  const rejectedCount = leaves.filter(l => l.status.includes('REJECTED')).length;

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
                  <h4 style={{ margin: "0 0 4px 0", color: "#0f172a", fontSize: "16px" }}>{leave.eventName}</h4>
                  <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#0D9488", fontWeight: "500" }}>
                    {new Date(leave.eventDate).toLocaleDateString()}
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "13px", color: "#475569" }}>
                    <div>
                      <strong style={{ color: "#334155" }}>Coordinator:</strong> {leave.coordinatorName}
                    </div>
                    <div>
                      <strong style={{ color: "#334155" }}>Department:</strong> {leave.department}
                    </div>
                    <div>
                      <strong style={{ color: "#334155" }}>Slots Requested:</strong> {leave.slots ? leave.slots.join(", ") : "N/A"}
                    </div>
                    {leave.rejectionReason && (
                      <div style={{ gridColumn: "1 / -1", color: "#EF4444", marginTop: "4px", background: "#FEF2F2", padding: "6px 10px", borderRadius: "6px", border: "1px solid #FECACA" }}>
                        <strong>Rejection Reason:</strong> {leave.rejectionReason}
                      </div>
                    )}
                  </div>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <StatusBadge status={leave.status} />
                  
                  {(leave.status.includes("PENDING") || leave.status.includes("REJECTED")) && (
                     <div style={{ display: "flex", gap: "8px" }}>
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
                          onMouseEnter={(e) => { e.target.style.background = "#0D9488"; e.target.style.color = "#fff"; }}
                          onMouseLeave={(e) => { e.target.style.background = "#fff"; e.target.style.color = "#0D9488"; }}
                       >
                          Edit
                       </button>
                       <button
                          onClick={() => handleDelete(leave._id)}
                          style={{
                            background: "#fff",
                            border: "1px solid #EF4444",
                            color: "#EF4444",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: "500",
                            transition: "all 0.2s"
                          }}
                          onMouseEnter={(e) => { e.target.style.background = "#EF4444"; e.target.style.color = "#fff"; }}
                          onMouseLeave={(e) => { e.target.style.background = "#fff"; e.target.style.color = "#EF4444"; }}
                       >
                          Delete
                       </button>
                     </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FLOATING ACTION BUTTON */}
      <button
        onClick={() => navigate("/student/apply")}
        title="Apply Leave"
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "#0D9488",
          color: "#fff",
          fontSize: "28px",
          lineHeight: "60px",
          textAlign: "center",
          border: "none",
          boxShadow: "0 4px 10px rgba(13, 148, 136, 0.4)",
          cursor: "pointer",
          zIndex: 1000,
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.1)";
          e.target.style.boxShadow = "0 6px 14px rgba(13, 148, 136, 0.5)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "0 4px 10px rgba(13, 148, 136, 0.4)";
        }}
      >
        +
      </button>

    </div>
  );
}

export default Dashboard;