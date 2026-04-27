import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { io } from "socket.io-client";

function FacultyDashboard() {
  const { status: routeStatus } = useParams();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [expanded, setExpanded] = useState(false);
  const [selectedCoordinator, setSelectedCoordinator] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    fetchRequests();
    const newSocket = io(API_BASE);
    newSocket.on("leaveCreated", () => fetchRequests());
    newSocket.on("leaveUpdated", () => fetchRequests());

    // Handle scroll to hash
    if (window.location.hash === "#reports") {
      setTimeout(() => {
        const el = document.getElementById("reports");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }

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
      const res = await fetch(`${API_BASE}/api/leave/${id}/ci-${action}`, {
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

  const filteredRequests = requests.filter(req => {
    if (routeStatus === "approved") {
      return req.status === "FINAL_APPROVED" || req.status === "PENDING_HOD";
    }
    if (routeStatus === "rejected") {
      return req.status.includes("REJECTED");
    }
    // default for "dashboard"
    return req.status === "PENDING_CI";
  });

  const displayedRequests = expanded ? filteredRequests : filteredRequests.slice(0, 4);

  let title = "Requests Overview";
  if (routeStatus === "approved") title = "Approved Leaves";
  else if (routeStatus === "rejected") title = "Rejected Leaves";

  const generateReport = () => {
    if (requests.length === 0) {
      alert("No data available to generate report");
      return;
    }

    const headers = ["Student Name", "Roll No", "Semester", "Department", "Event Name", "Event Date", "Coordinator", "Slots Count", "Status", "Applied On"];
    const csvContent = [
      headers.join(","),
      ...requests.map(req => [
        `"${req.student?.name || 'Unknown'}"`,
        `"${req.student?.rollno || 'N/A'}"`,
        `"${req.student?.semester || 'N/A'}"`,
        `"${req.student?.department || 'N/A'}"`,
        `"${req.eventName}"`,
        `"${new Date(req.eventDate).toLocaleDateString()}"`,
        `"${req.coordinatorName}"`,
        req.slots.length,
        `"${req.status}"`,
        `"${new Date(req.createdAt).toLocaleDateString()}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Full_Leave_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: isMobile() ? "10px" : "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <h2 style={{ margin: 0, color: "#1e293b" }}>{title}</h2>
      </div>

      {(!routeStatus || routeStatus === "dashboard" || window.location.hash === "#reports") ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile() ? "1fr" : "1fr 1fr 1fr", gap: "20px" }}>
            {/* Pending Section */}
            <div style={{ gridColumn: isMobile() ? "1" : "1 / -1" }}>
              <h3 style={{ color: "#1e293b", marginBottom: "15px" }}>Pending Actions</h3>
              <div style={{ background: "rgba(209, 92, 120, 0.4)", backdropFilter: "blur(10px)", borderRadius: "12px", padding: "15px" }}>
                {requests.filter(r => r.status === "PENDING_CI").length === 0 ? (
                  <p style={{ color: "#64748b", textAlign: "center" }}>No pending actions.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {requests.filter(r => r.status === "PENDING_CI").map(req => <RequestCard key={req._id} request={req} isMobile={isMobile()} handleAction={handleAction} actionLoading={actionLoading} fetchCoordinatorDetails={fetchCoordinatorDetails} />)}
                  </div>
                )}
              </div>
            </div>

            {/* Approved Column */}
            <div>
              <h3 style={{ color: "#1e293b", marginBottom: "15px" }}>Approved Leaves</h3>
              <div style={{ background: "rgba(16, 185, 129, 0.1)", borderRadius: "12px", padding: "15px", border: "1px solid rgba(16, 185, 129, 0.2)", minHeight: "150px", display: "flex", flexDirection: "column" }}>
                {requests.filter(r => r.status === "FINAL_APPROVED" || r.status === "PENDING_HOD").length === 0 ? (
                  <p style={{ color: "#64748b", textAlign: "center" }}>No approved leaves.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {requests.filter(r => r.status === "FINAL_APPROVED" || r.status === "PENDING_HOD").slice(0, 5).map(req => (
                      <div key={req._id} style={{ padding: "10px", background: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                        <div style={{ fontWeight: "600", fontSize: "14px" }}>{req.student?.name}</div>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>{req.eventName} • {new Date(req.eventDate).toLocaleDateString()}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Rejected Column */}
            <div>
              <h3 style={{ color: "#1e293b", marginBottom: "15px" }}>Rejected Leaves</h3>
              <div style={{ background: "rgba(239, 68, 68, 0.1)", borderRadius: "12px", padding: "15px", border: "1px solid rgba(239, 68, 68, 0.2)", minHeight: "150px", display: "flex", flexDirection: "column" }}>
                {requests.filter(r => r.status.includes("REJECTED")).length === 0 ? (
                  <p style={{ color: "#64748b", textAlign: "center" }}>No rejected leaves.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {requests.filter(r => r.status.includes("REJECTED")).slice(0, 5).map(req => (
                      <div key={req._id} style={{ padding: "10px", background: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                        <div style={{ fontWeight: "600", fontSize: "14px" }}>{req.student?.name}</div>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>{req.eventName} • {new Date(req.eventDate).toLocaleDateString()}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Reports Column */}
            <div id="reports" style={{ scrollMarginTop: "80px" }}>
              <h3 style={{ color: "#1e293b", marginBottom: "15px" }}>Reports</h3>
              <div style={{ 
                background: "rgba(13, 148, 136, 0.1)", 
                borderRadius: "12px", 
                padding: "15px", 
                border: "1px solid rgba(13, 148, 136, 0.2)", 
                display: "flex", 
                flexDirection: "column",
                minHeight: "150px"
              }}>
                <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "15px" }}>
                  Generate a CSV file containing all leave applications for your department.
                </p>
                <div style={{ flex: 1 }}></div>
                <button 
                  onClick={generateReport}
                  style={{
                    background: "#0D9488",
                    color: "#fff",
                    border: "none",
                    padding: "12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "0 4px 6px -1px rgba(13, 148, 136, 0.3)",
                    width: "100%"
                  }}
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>


        </div>
      ) : (
        <div style={{
          background: "rgba(209, 92, 120, 0.6)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          padding: isMobile() ? "15px" : "24px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          maxWidth: "1000px",
          margin: "0 auto"
        }}>
          {loading ? (
            <p style={{ color: "#fff" }}>Loading requests...</p>
          ) : filteredRequests.length === 0 ? (
            <p style={{ color: "#FFE4E6", textAlign: "center", padding: "20px" }}>No requests found for this category.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {displayedRequests.map((request) => (
                <RequestCard 
                  key={request._id} 
                  request={request} 
                  isMobile={isMobile()} 
                  handleAction={handleAction} 
                  actionLoading={actionLoading} 
                  fetchCoordinatorDetails={fetchCoordinatorDetails} 
                />
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
      )}

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
            <div style={{ background: "#d15c78", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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

function RequestCard({ request, isMobile, handleAction, actionLoading, fetchCoordinatorDetails }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between",
      alignItems: isMobile ? "flex-start" : "center",
      padding: "20px",
      borderRadius: "10px",
      background: "rgba(159, 18, 57, 0.6)",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      color: "#fff",
      gap: "15px"
    }}>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.5fr 1fr 1fr", gap: "15px", width: "100%" }}>
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
              style={{ background: "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", color: "#fff", padding: "2px 8px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px" }}
              title="View Coordinator Details"
            >
              <Info size={14} />
              Details
            </button>
          </div>
          <p style={{ margin: 0, fontSize: "14px", color: "#FFE4E6" }}>{request.slots.length} Slots</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: isMobile ? "flex-start" : "flex-end", gap: "15px", minWidth: "150px" }}>
        <StatusBadge status={request.status} />

        {request.status.includes("REJECTED") && request.rejectionReason && (
          <div style={{ background: "rgba(255,0,0,0.2)", padding: "8px", borderRadius: "6px", fontSize: "13px", marginTop: "5px" }}>
            <strong>Reason:</strong> {request.rejectionReason}
          </div>
        )}

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
  );
}

const isMobile = () => window.innerWidth < 768;

export default FacultyDashboard;

