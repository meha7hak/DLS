import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge";
import { Clock, CheckCircle, XCircle, X } from "lucide-react";
import { io } from "socket.io-client";

function MyApplications() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    fetchLeaves();
    const newSocket = io(API_BASE);
    newSocket.on("leaveCreated", () => fetchLeaves());
    newSocket.on("leaveUpdated", () => fetchLeaves());
    return () => {
      window.removeEventListener('resize', handleResize);
      newSocket.disconnect();
    };
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

  const openTimeline = async (leave) => {
    setSelectedLeave(leave);
    setTimelineLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/leave/${leave._id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTimelineData(data.logs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTimelineLoading(false);
    }
  };

  const closeTimeline = () => {
    setSelectedLeave(null);
    setTimelineData([]);
  };

  const getTimelineIcon = (action) => {
    if (action.includes("REJECTED")) return <XCircle size={20} color="#EF4444" />;
    if (action.includes("APPROVED")) return <CheckCircle size={20} color="#22C55E" />;
    if (action === "SUBMITTED") return <CheckCircle size={20} color="#3B82F6" />;
    return <Clock size={20} color="#F59E0B" />;
  };

  return (
    <div style={{ padding: "20px" }}>
      <style>{`
        .app-card {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border: 1px solid #f1f5f9;
          border-radius: 10px;
          background: #fafafa;
          transition: all 0.2s;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .grid-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          font-size: 13px;
          color: #475569;
        }
        .app-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        @media (max-width: 768px) {
          .app-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .grid-details {
            grid-template-columns: 1fr;
          }
          .app-actions {
            width: 100%;
            justify-content: flex-start;
            flex-wrap: wrap;
          }
        }
      `}</style>
      <h2 style={{ marginBottom: "20px", textTransform: "capitalize", color: "#1e293b" }}>
        My Applications
      </h2>
      
      <div style={{
        background: "#fff",
        borderRadius: "12px",
        padding: isMobile ? "15px" : "24px",
        border: "1px solid #E2E8F0",
        maxWidth: "900px"
      }}>
        {loading ? (
          <p>Loading...</p>
        ) : leaves.length === 0 ? (
          <p style={{ color: "#64748b", textAlign: "center", padding: "20px" }}>No applications found.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {leaves.map((leave) => (
              <div key={leave._id} className="app-card">
                <div style={{ flex: 1, width: "100%" }}>
                  <h4 style={{ margin: "0 0 4px 0", color: "#0f172a", fontSize: "16px" }}>{leave.eventName}</h4>
                  <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#0D9488", fontWeight: "500" }}>
                    {new Date(leave.eventDate).toLocaleDateString()}
                  </p>
                  <div className="grid-details">
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
                
                <div className="app-actions">
                  <StatusBadge status={leave.status} />
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <button
                        onClick={() => openTimeline(leave)}
                        style={{
                          background: "#F8FAFC",
                          border: "1px solid #CBD5E1",
                          color: "#334155",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: "500",
                          transition: "all 0.2s",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "5px"
                        }}
                    >
                        Timeline
                    </button>

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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TIMELINE MODAL */}
      {selectedLeave && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "24px",
            width: "90%",
            maxWidth: "600px",
            maxHeight: "80vh",
            overflowY: "auto",
            position: "relative"
          }}>
            <button 
              onClick={closeTimeline}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#64748b"
              }}
            >
              <X size={24} />
            </button>
            <h3 style={{ marginBottom: "20px", color: "#1e293b" }}>Approval Timeline</h3>
            <p style={{ color: "#64748b", marginBottom: "30px", fontSize: "15px" }}>
              Tracking progress for <strong>{selectedLeave.eventName}</strong>
            </p>

            {timelineLoading ? (
              <p>Loading timeline...</p>
            ) : timelineData.length === 0 ? (
              <p>No timeline data available.</p>
            ) : (
              <div style={{ position: "relative", paddingLeft: "10px" }}>
                {/* Vertical Line */}
                <div style={{
                  position: "absolute",
                  left: "20px",
                  top: "20px",
                  bottom: "20px",
                  width: "2px",
                  background: "#E2E8F0",
                  zIndex: 0
                }} />

                {timelineData.map((log, idx) => (
                  <div key={log._id} style={{ display: "flex", gap: "15px", marginBottom: "24px", position: "relative", zIndex: 1 }}>
                    <div style={{ 
                      background: "#fff", 
                      borderRadius: "50%", 
                      width: "30px", 
                      height: "30px", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      border: "2px solid #E2E8F0"
                    }}>
                      {getTimelineIcon(log.action)}
                    </div>
                    <div>
                      <h4 style={{ margin: "0 0 4px 0", color: "#334155", fontSize: "15px", textTransform: "capitalize" }}>
                        {log.action.replace(/_/g, " ")}
                      </h4>
                      <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                        by {log.role} • {new Date(log.createdAt).toLocaleString()}
                      </p>
                      {log.reason && (
                        <p style={{ margin: "6px 0 0 0", fontSize: "14px", color: "#EF4444", background: "#FEF2F2", padding: "6px 10px", borderRadius: "6px" }}>
                          {log.reason}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyApplications;
