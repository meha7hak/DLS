import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge";
import { CheckCircle, XCircle } from "lucide-react";
import { io } from "socket.io-client";

function CoordinatorDashboard() {
  const { status: routeStatus } = useParams();
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
    } catch (err) {
      console.error(err);
      alert(`Error trying to ${action} request`);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredRequests = requests.filter(req => {
    if (routeStatus === "approved") {
      return req.status === "PENDING_CI" || req.status === "PENDING_HOD" || req.status === "FINAL_APPROVED";
    }
    if (routeStatus === "rejected") {
      return req.status.includes("REJECTED");
    }
    return req.status === "PENDING_COORDINATOR"; // default to pending
  });

  let title = "Pending Requests";
  if (routeStatus === "approved") title = "Approved Leaves";
  if (routeStatus === "rejected") title = "Rejected Leaves";

  return (
    <div style={{ padding: isMobile() ? "10px" : "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "20px", color: "#1e293b", textAlign: "center" }}>Recent Applications</h2>
      <div style={{
        background: "rgba(180, 158, 219, 0.6)",
        backdropFilter: "blur(10px)",
        borderRadius: "12px",
        padding: isMobile() ? "15px" : "24px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        maxWidth: "1000px",
        margin: "0 auto"
      }}>
        <h3 style={{ marginBottom: "25px", color: "#fff" }}>{title}</h3>

        {loading ? (
          <p style={{ color: "#fff" }}>Loading requests...</p>
        ) : filteredRequests.length === 0 ? (
          <p style={{ color: "#BFDBFE", textAlign: "center", padding: "20px" }}>No requests found for this category.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {filteredRequests.map((request) => (
              <div key={request._id} style={{
                display: "flex",
                flexDirection: isMobile() ? "column" : "row",
                justifyContent: "space-between",
                alignItems: isMobile() ? "flex-start" : "center",
                padding: "20px",
                borderRadius: "10px",
                background: "rgba(187, 31, 188, 0.4)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                color: "#fff",
                gap: "15px"
              }}>
                <div style={{ flex: 1, display: "grid", gridTemplateColumns: isMobile() ? "1fr" : "1.5fr 1fr 1fr", gap: "15px", width: "100%" }}>
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", color: "#040404ff" }}>{request.student?.name || "Unknown Student"}</h4>
                    <p style={{ margin: 0, fontSize: "14px", color: "#DBEAFE" }}>Roll No: {request.student?.rollno || "N/A"}</p>
                    <p style={{ margin: 0, fontSize: "14px", color: "#DBEAFE" }}>Sem {request.student?.semester} • {request.student?.department}</p>
                  </div>
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", color: "#040404ff", fontSize: "15px" }}>Event Details</h4>
                    <p style={{ margin: 0, fontSize: "14px", color: "#DBEAFE" }}>{request.eventName}</p>
                    <p style={{ margin: 0, fontSize: "14px", color: "#DBEAFE" }}>{new Date(request.eventDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", color: "#040404ff", fontSize: "15px" }}>Slots Requested</h4>
                    <p style={{ margin: 0, fontSize: "14px", color: "#DBEAFE" }}>{request.slots.join(", ")}</p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: isMobile() ? "flex-start" : "flex-end", gap: "15px", minWidth: "150px" }}>
                  <StatusBadge status={request.status} />

                  {request.status.includes("REJECTED") && request.rejectionReason && (
                    <div style={{ background: "rgba(255,0,0,0.2)", padding: "8px", borderRadius: "6px", fontSize: "13px", color: "#fff", marginTop: "5px" }}>
                      <strong style={{ color: "#fff" }}>Reason:</strong> {request.rejectionReason}
                    </div>
                  )}

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
