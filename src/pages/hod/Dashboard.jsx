import { useState, useEffect } from "react";
import StatusBadge from "../../components/StatusBadge";
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { io } from "socket.io-client";

function HodDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});

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
      const res = await fetch(`${API_BASE}/api/leave/hod?status=PENDING_HOD`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
        
        // Expand all initially
        const initialGroups = {};
        const groups = groupByClass(data);
        Object.keys(groups).forEach(key => initialGroups[key] = true);
        setExpandedGroups(initialGroups);
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
      const res = await fetch(`${API_BASE}/api/leave/${id}/hod-${action}`, {
        method: "PATCH",
        headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({})
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

  const groupByClass = (reqs) => {
    return reqs.reduce((acc, req) => {
      const dept = req.student?.department || "Unknown Dept";
      const sem = req.student?.semester || "Unknown Sem";
      const key = `${dept} - Sem ${sem}`;
      
      if (!acc[key]) acc[key] = [];
      acc[key].push(req);
      return acc;
    }, {});
  };

  const toggleGroup = (groupKey) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  const groupedRequests = groupByClass(requests);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px", color: "#1e293b" }}>HOD Dashboard</h2>
      <p style={{ color: "#64748b", marginBottom: "30px" }}>
        Review and manage final approvals for duty leave requests across departments.
      </p>

      <div style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "24px",
        border: "1px solid #E2E8F0",
        maxWidth: "1000px"
      }}>
        <h3 style={{ marginBottom: "20px", color: "#334155" }}>Pending HOD Approvals</h3>
        
        {loading ? (
          <p>Loading requests...</p>
        ) : Object.keys(groupedRequests).length === 0 ? (
          <p style={{ color: "#64748b", textAlign: "center", padding: "20px" }}>No pending requests found for HOD approval.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {Object.keys(groupedRequests).map((groupKey) => (
              <div key={groupKey} style={{ border: "1px solid #E2E8F0", borderRadius: "10px", overflow: "hidden" }}>
                {/* Accordion Header */}
                <div 
                  onClick={() => toggleGroup(groupKey)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "15px 20px",
                    background: "#F8FAFC",
                    cursor: "pointer",
                    userSelect: "none"
                  }}
                >
                  <h4 style={{ margin: 0, color: "#0f172a", fontSize: "16px" }}>
                    {groupKey} <span style={{ color: "#64748b", fontSize: "14px", fontWeight: "normal" }}>({groupedRequests[groupKey].length})</span>
                  </h4>
                  {expandedGroups[groupKey] ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {/* Accordion Content */}
                {expandedGroups[groupKey] && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "15px", background: "#fff" }}>
                    {groupedRequests[groupKey].map((request) => (
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
                          
                          {request.status === "PENDING_HOD" && (
                             <div style={{ display: "flex", gap: "10px" }}>
                               <button
                                  onClick={(e) => { e.stopPropagation(); handleAction(request._id, "approve"); }}
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
                                  onClick={(e) => { e.stopPropagation(); handleAction(request._id, "reject"); }}
                                  disabled={actionLoading === request._id}
                                  style={{
                                    background: "#DC2626",
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HodDashboard;
