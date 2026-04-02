import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge";

function MyApplications() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    fetchLeaves();
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

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px", textTransform: "capitalize", color: "#1e293b" }}>
        My Applications
      </h2>
      
      <div style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "24px",
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
                  
                  {(leave.status.includes("Pending") || leave.status === "Rejected") && (
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
    </div>
  );
}

export default MyApplications;
