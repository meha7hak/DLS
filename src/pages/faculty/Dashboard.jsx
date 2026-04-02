import { useState, useEffect } from "react";
import StatusBadge from "../../components/StatusBadge";
import { CheckCircle, XCircle } from "lucide-react";

function FacultyDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/leave/faculty-requests`, {
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
      const res = await fetch(`${API_BASE}/api/leave/faculty-${action}/${id}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (res.ok) {
        // Refresh requests
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
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px", color: "#1e293b" }}>Faculty Dashboard</h2>
      <p style={{ color: "#64748b", marginBottom: "30px" }}>
        Review and manage duty leave requests for your assigned class.
      </p>

      <div style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "24px",
        border: "1px solid #E2E8F0",
        maxWidth: "1000px"
      }}>
        <h3 style={{ marginBottom: "20px", color: "#334155" }}>Pending Requests</h3>
        
        {loading ? (
          <p>Loading requests...</p>
        ) : requests.length === 0 ? (
          <p style={{ color: "#64748b", textAlign: "center", padding: "20px" }}>No pending requests found for your class.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {requests.map((request) => (
              <div key={request._id} style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px",
                border: "1px solid #f1f5f9",
                borderRadius: "10px",
                background: "#fafafa",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
              }}>
                <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "15px" }}>
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", color: "#0f172a" }}>{request.student?.name || "Unknown Student"}</h4>
                    <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>Roll No: {request.student?.rollno || "N/A"}</p>
                    <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>Sem {request.student?.semester} • {request.student?.department}</p>
                  </div>
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", color: "#334155", fontSize: "15px" }}>Event Details</h4>
                    <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>{request.eventName}</p>
                    <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>{new Date(request.eventDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", color: "#334155", fontSize: "15px" }}>Coordinator</h4>
                    <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>{request.coordinatorName}</p>
                    <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>{request.slots.length} Slots</p>
                  </div>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "15px", minWidth: "150px" }}>
                  <StatusBadge status={request.status} />
                  
                  {request.status === "Pending ClassIncharge" && (
                     <div style={{ display: "flex", gap: "10px" }}>
                       <button
                          onClick={() => handleAction(request._id, "approve")}
                          disabled={actionLoading === request._id}
                          style={{
                            background: "#0D9488",
                            border: "none",
                            color: "#fff",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            cursor: actionLoading === request._id ? "not-allowed" : "pointer",
                            fontSize: "13px",
                            fontWeight: "500",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            opacity: actionLoading === request._id ? 0.7 : 1
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
                            gap: "5px",
                            opacity: actionLoading === request._id ? 0.7 : 1
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

export default FacultyDashboard;
