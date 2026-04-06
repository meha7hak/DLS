import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge";
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Info, X } from "lucide-react";
import { io } from "socket.io-client";

function HodDashboard() {
  const { status: routeStatus } = useParams();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});
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
      const res = await fetch(`${API_BASE}/api/leave/hod?status=ALL`, {
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
    let reason = "";
    if (action === "reject") {
      reason = window.prompt("Please provide a reason for rejecting:");
      if (reason === null) return;
    } else {
      if (!window.confirm(`Are you sure you want to approve this request?`)) return;
    }

    setActionLoading(id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/leave/${id}/hod-${action}`, {
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
    } catch (err) {
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

  const filteredRequests = requests.filter(req => {
    if (routeStatus === "approved") {
      return req.status === "FINAL_APPROVED";
    }
    if (routeStatus === "rejected") {
      return req.status.includes("REJECTED");
    }
    return req.status === "PENDING_HOD"; // default for dashboard
  });

  const groupedRequests = groupByClass(filteredRequests);

  let title = "Pending HOD Approvals";
  if (routeStatus === "approved") title = "Approved Leaves";
  if (routeStatus === "rejected") title = "Rejected Leaves";

  return (
    <div style={{ padding: isMobile() ? "10px" : "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "20px", color: "#1e293b", textAlign: "center" }}>HOD Dashboard</h2>

      <div style={{
        background: "#a48cc9",
        borderRadius: "12px",
        padding: isMobile() ? "15px" : "24px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        maxWidth: "1000px",
        margin: "0 auto"
      }}>
        <h3 style={{ marginBottom: "20px", color: "#fff" }}>{title}</h3>

        {loading ? (
          <p style={{ color: "#fff" }}>Loading requests...</p>
        ) : Object.keys(groupedRequests).length === 0 ? (
          <p style={{ color: "#F3E8FF", textAlign: "center", padding: "20px" }}>No requests found for this category.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {Object.keys(groupedRequests).map((groupKey) => (
              <div key={groupKey} style={{ border: "1px solid rgba(255,255,255,0.2)", borderRadius: "10px", overflow: "hidden" }}>
                <div
                  onClick={() => toggleGroup(groupKey)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "15px 20px",
                    background: "#5B21B6",
                    cursor: "pointer",
                    userSelect: "none"
                  }}
                >
                  <h4 style={{ margin: 0, color: "#fff", fontSize: "16px" }}>
                    {groupKey} <span style={{ color: "#C4B5FD", fontSize: "14px", fontWeight: "normal" }}>({groupedRequests[groupKey].length})</span>
                  </h4>
                  {expandedGroups[groupKey] ? <ChevronUp size={20} color="#C4B5FD" /> : <ChevronDown size={20} color="#C4B5FD" />}
                </div>

                {expandedGroups[groupKey] && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "15px", background: "#a48cc9" }}>
                    {groupedRequests[groupKey].map((request) => (
                      <div key={request._id} style={{
                        display: "flex",
                        flexDirection: isMobile() ? "column" : "row",
                        justifyContent: "space-between",
                        alignItems: isMobile() ? "flex-start" : "center",
                        padding: "20px",
                        borderRadius: "10px",
                        background: "#5B21B6",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        color: "#fff",
                        gap: "15px"
                      }}>
                        <div style={{ flex: 1, display: "grid", gridTemplateColumns: isMobile() ? "1fr" : "1.5fr 1fr 1fr", gap: "15px", width: "100%" }}>
                          <div>
                            <h4 style={{ margin: "0 0 4px 0", color: "#fff" }}>{request.student?.name || "Unknown Student"}</h4>
                            <p style={{ margin: 0, fontSize: "14px", color: "#E9D5FF" }}>Roll No: {request.student?.rollno || "N/A"}</p>
                          </div>
                          <div>
                            <h4 style={{ margin: "0 0 4px 0", color: "#C4B5FD", fontSize: "15px" }}>Event Details</h4>
                            <p style={{ margin: 0, fontSize: "14px", color: "#E9D5FF" }}>{request.eventName}</p>
                            <p style={{ margin: 0, fontSize: "14px", color: "#E9D5FF" }}>{new Date(request.eventDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <h4 style={{ margin: "0 0 4px 0", color: "#C4B5FD", fontSize: "15px" }}>Coordinator</h4>
                            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                              <p style={{ margin: 0, fontSize: "14px", color: "#E9D5FF" }}>{request.coordinatorName}</p>
                              <button
                                onClick={(e) => { e.stopPropagation(); fetchCoordinatorDetails(request); }}
                                style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 0, display: "flex" }}
                                title="View Coordinator Details"
                              >
                                <Info size={16} />
                              </button>
                            </div>
                            <p style={{ margin: 0, fontSize: "14px", color: "#E9D5FF" }}>{request.slots.length} Slots</p>
                          </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", alignItems: isMobile() ? "flex-start" : "flex-end", gap: "15px", minWidth: "150px" }}>
                          <StatusBadge status={request.status} />

                          {request.status.includes("REJECTED") && request.rejectionReason && (
                            <div style={{ background: "rgba(255,0,0,0.2)", padding: "8px", borderRadius: "6px", fontSize: "13px", color: "#fff", marginTop: "5px" }}>
                              <strong style={{ color: "#fff" }}>Reason:</strong> {request.rejectionReason}
                            </div>
                          )}

                          {request.status === "PENDING_HOD" && (
                            <div style={{ display: "flex", gap: "10px" }}>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleAction(request._id, "approve"); }}
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
                                onClick={(e) => { e.stopPropagation(); handleAction(request._id, "reject"); }}
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
            ))}
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
            <div style={{ background: "#a48cc9", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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

export default HodDashboard;
