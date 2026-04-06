import { useState, useEffect } from "react";
import StatusBadge from "../../components/StatusBadge";
import { CheckCircle, XCircle } from "lucide-react";
import { io } from "socket.io-client";

function CoordinatorDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

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
      const res = await fetch(`${API_BASE}/api/leave/coordinator?status=ALL`, {
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
    let reason = "";
    if (action === "reject") {
        reason = window.prompt("Please provide a reason for rejecting:");
        if (reason === null) return; // user cancelled prompt
    } else {
        if (!window.confirm(`Are you sure you want to approve this request?`)) return;
    }

    setActionLoading(id);
    try {
      const token = localStorage.getItem("token");
      const url = `${API_BASE}/api/leave/${id}/coord-${action}`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ reason })
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

  return (
    <div style={{ padding: isMobile() ? "10px" : "20px" }}>
      <h2 style={{ marginBottom: "20px", color: "#1e293b" }}>Coordinator Dashboard</h2>
      <p style={{ color: "#64748b", marginBottom: "30px" }}>
        Review and manage duty leave requests assigned to you as event coordinator.
      </p>

      <div style={{
        background: "#1E3A8A",
        borderRadius: "12px",
        padding: isMobile() ? "15px" : "24px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        maxWidth: "1000px"
      }}>
        <h3 style={{ marginBottom: "20px", color: "#fff" }}>Pending Requests</h3>
        
        {loading ? (
          <p style={{ color: "#fff" }}>Loading requests...</p>
        ) : requests.length === 0 ? (
          <p style={{ color: "#BFDBFE", textAlign: "center", padding: "20px" }}>No pending requests found for you.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {requests.map((request) => (
              <div key={request._id} style={{
                display: "flex",
                flexDirection: isMobile() ? "column" : "row",
                justifyContent: "space-between",
                alignItems: isMobile() ? "flex-start" : "center",
                padding: "20px",
                borderRadius: "10px",
                background: "#1E40AF",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                color: "#fff",
                gap: "15px"
              }}>
                <div style={{ flex: 1, display: "grid", gridTemplateColumns: isMobile() ? "1fr" : "1.5fr 1fr 1fr", gap: "15px", width: "100%" }}>
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", color: "#fff" }}>{request.student?.name || "Unknown Student"}</h4>
                    <p style={{ margin: 0, fontSize: "14px", color: "#DBEAFE" }}>Roll No: {request.student?.rollno || "N/A"}</p>
                    <p style={{ margin: 0, fontSize: "14px", color: "#DBEAFE" }}>Sem {request.student?.semester} • {request.student?.department}</p>
                  </div>
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", color: "#93C5FD", fontSize: "15px" }}>Event Details</h4>
                    <p style={{ margin: 0, fontSize: "14px", color: "#DBEAFE" }}>{request.eventName}</p>
                    <p style={{ margin: 0, fontSize: "14px", color: "#DBEAFE" }}>{new Date(request.eventDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", color: "#93C5FD", fontSize: "15px" }}>Slots Requested</h4>
                    <p style={{ margin: 0, fontSize: "14px", color: "#DBEAFE" }}>{request.slots.join(", ")}</p>
                  </div>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", alignItems: isMobile() ? "flex-start" : "flex-end", gap: "15px", minWidth: "150px" }}>
                  <StatusBadge status={request.status} />
                  
                  {request.status === "PENDING_COORDINATOR" && (
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
          </div>
        )}
      </div>
    </div>
  );
}

const isMobile = () => window.innerWidth < 768;

export default CoordinatorDashboard;
