import { useState, useEffect } from "react";
import StatusBadge from "../../components/StatusBadge";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { io } from "socket.io-client";

function FacultyDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  
  const [activeTab, setActiveTab] = useState("requests");
  const [expanded, setExpanded] = useState(false);
  const [selectedCoordinator, setSelectedCoordinator] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    fetchRequests();
    const newSocket = io(API_BASE);
    newSocket.on("leaveCreated", () => fetchRequests());
    newSocket.on("leaveUpdated", () => fetchRequests());
    return () => newSocket.disconnect();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/leave/faculty?status=ALL`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this request?`)) return;
    
    setActionLoading(id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/leave/${id}/ci-${action}`, {
        method: "PATCH",
        headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json" 
        }
      });
      
      if (res.ok) {
        fetchRequests();
      } else {
        const data = await res.json();
        alert(data.message || `Failed to ${action} request`);
      }
    } catch(err) {
      console.error(err);
      alert(`Error trying to ${action} request`);
    } finally {
      setActionLoading(null);
    }
  };

  const fetchCoordinatorDetails = async (request) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/auth/users?role=COORDINATOR`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const coordinators = await res.json();
        const coordinator = coordinators.find(c => c.name === request.coordinatorName);
        if (coordinator) {
          setSelectedCoordinator(coordinator);
        } else {
          setSelectedCoordinator({ name: request.coordinatorName, email: "Not Available", phone: "Not Available" });
        }
      }
    } catch (err) {
      console.error("Failed to fetch coordinator details");
      setSelectedCoordinator({ name: request.coordinatorName, email: "Not Available", phone: "Not Available" });
    }
  };

  const filteredRequests = requests.filter(req => {
    if (activeTab === "requests") return req.status === "PENDING_CI";
    if (activeTab === "hod_approved") return req.status === "FINAL_APPROVED";
    if (activeTab === "accepted") return req.status === "PENDING_HOD" || req.status === "FINAL_APPROVED";
    if (activeTab === "rejected") return req.status.includes("REJECTED");
    return true;
  });

  const displayedRequests = expanded ? filteredRequests : filteredRequests.slice(0, 4);

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => { setActiveTab(id); setExpanded(false); }}
      style={{
        padding: "10px 20px",
        background: activeTab === id ? "#9F1239" : "transparent",
        color: activeTab === id ? "#fff" : "#FFE4E6",
        border: "none",
        borderBottom: activeTab === id ? "2px solid #fff" : "2px solid transparent",
        cursor: "pointer",
        fontWeight: activeTab === id ? "600" : "500",
        transition: "all 0.2s"
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ padding: isMobile() ? "10px" : "20px" }}>
      <h2 style={{ marginBottom: "20px", color: "#1e293b" }}>Requests Overview</h2>

      <div style={{
        background: "#BE123C",
        borderRadius: "12px",
        padding: isMobile() ? "15px" : "24px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        maxWidth: "1000px"
      }}>
        <div style={{ display: "flex", gap: "10px", borderBottom: "1px solid rgba(255,255,255,0.2)", marginBottom: "20px", overflowX: "auto" }}>
          <TabButton id="requests" label="Requests" />
          <TabButton id="accepted" label="Accepted" />
          <TabButton id="rejected" label="Rejected" />
          <TabButton id="hod_approved" label="HOD Approved" />
        </div>
        
        {loading ? (
          <p style={{ color: "#fff" }}>Loading requests...</p>
        ) : filteredRequests.length === 0 ? (
          <p style={{ color: "#FFE4E6", textAlign: "center", padding: "20px" }}>No requests found for this category.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {displayedRequests.map((request) => (
              <div key={request._id} style={{
                display: "flex",
                flexDirection: isMobile() ? "column" : "row",
                justifyContent: "space-between",
                alignItems: isMobile() ? "flex-start" : "center",
                padding: "20px",
                borderRadius: "10px",
                background: "#9F1239",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                color: "#fff",
                gap: "15px"
              }}>
                <div style={{ flex: 1, display: "grid", gridTemplateColumns: isMobile() ? "1fr" : "1.5fr 1fr 1fr", gap: "15px", width: "100%" }}>
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", color: "#fff" }}>{request.student?.name || "Unknown Student"}</h4>
                    <p style={{ margin: 0, fontSize: "14px", color: "#FFE4E6" }}>Roll No: {request.student?.rollno || "N/A"}</p>
                    <p style={{ margin: 0, fontSize: "14px", color: "#FFE4E6" }}>Sem {request.student?.semester} • {request.student?.department}</p>
                  </div>
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", color: "#FECDD3", fontSize: "15px" }}>Event Details</h4>
                    <p style={{ margin: 0, fontSize: "14px", color: "#FFE4E6" }}>{request.eventName}</p>
                    <p style={{ margin: 0, fontSize: "14px", color: "#FFE4E6" }}>{new Date(request.eventDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", color: "#FECDD3", fontSize: "15px" }}>Coordinator</h4>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <p style={{ margin: 0, fontSize: "14px", color: "#FFE4E6" }}>{request.coordinatorName}</p>
                      <button 
                        onClick={() => fetchCoordinatorDetails(request)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 0, display: "flex" }}
                        title="View Coordinator Details"
                      >
                        <Info size={16} />
                      </button>
                    </div>
                    <p style={{ margin: 0, fontSize: "14px", color: "#FFE4E6" }}>{request.slots.length} Slots</p>
                  </div>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", alignItems: isMobile() ? "flex-start" : "flex-end", gap: "15px", minWidth: "150px" }}>
                  <StatusBadge status={request.status} />
                  
                  {request.status === "PENDING_CI" && (
                     <div style={{ display: "flex", gap: "10px" }}>
                       <button
                          onClick={() => handleAction(request._id, "approve")}
                          disabled={actionLoading === request._id}
                          style={{
                             background: "#10B981",
                             border: "none",
                             color: "#fff",
                             padding: "8px 12px",
                             borderRadius: "6px",
                             cursor: actionLoading === request._id ? "not-allowed" : "pointer",
                             fontSize: "13px",
                             fontWeight: "500",
                             display: "flex",
                             alignItems: "center",
                             gap: "5px"
                          }}
                       >
                          <CheckCircle size={16} />
                          Approve
                       </button>
                       <button
                          onClick={() => handleAction(request._id, "reject")}
                          disabled={actionLoading === request._id}
                          style={{
                             background: "#EF4444",
                             border: "none",
                             color: "#fff",
                             padding: "8px 12px",
                             borderRadius: "6px",
                             cursor: actionLoading === request._id ? "not-allowed" : "pointer",
                             fontSize: "13px",
                             fontWeight: "500",
                             display: "flex",
                             alignItems: "center",
                             gap: "5px"
                          }}
                       >
                          <XCircle size={16} />
                          Reject
                       </button>
                     </div>
                  )}
                </div>
              </div>
            ))}
            
            {filteredRequests.length > 4 && (
              <button 
                onClick={() => setExpanded(!expanded)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff",
                  padding: "10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "500",
                  marginTop: "10px",
                  transition: "background 0.2s"
                }}
                onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
                onMouseLeave={(e) => e.target.style.background = "rgba(255,255,255,0.1)"}
              >
                {expanded ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
        )}
      </div>

      {selectedCoordinator && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
        }}>
          <div style={{
            background: "#fff", borderRadius: "12px", width: "100%", maxWidth: "400px",
            overflow: "hidden", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"
          }}>
            <div style={{ background: "#BE123C", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, color: "#fff" }}>Coordinator Details</h3>
              <button onClick={() => setSelectedCoordinator(null)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: "20px" }}>
              <p style={{ margin: "0 0 10px 0", color: "#334155" }}><strong>Name:</strong> {selectedCoordinator.name}</p>
              <p style={{ margin: "0 0 10px 0", color: "#334155" }}><strong>Email:</strong> {selectedCoordinator.email}</p>
              <p style={{ margin: "0 0 10px 0", color: "#334155" }}><strong>Phone:</strong> {selectedCoordinator.phone || "N/A"}</p>
              {selectedCoordinator.department && <p style={{ margin: "0 0 10px 0", color: "#334155" }}><strong>Department:</strong> {selectedCoordinator.department}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const isMobile = () => window.innerWidth < 768;

export default FacultyDashboard;

