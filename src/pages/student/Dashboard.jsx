import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";

function Dashboard() {
  return (
    <div>

      <h2 style={{ marginBottom: "20px" }}>Dashboard</h2>

      {/* STATS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
        marginBottom: "30px"
      }}>
        <StatCard title="Pending Requests" value="3" color="#F59E0B" />
        <StatCard title="Approved" value="8" color="#22C55E" />
        <StatCard title="Rejected" value="1" color="#EF4444" />
      </div>

      {/* TABLE */}
      <div style={{
        background: "#fff",
        borderRadius: "10px",
        padding: "20px",
        border: "1px solid #E2E8F0"
      }}>
        <h3 style={{ marginBottom: "15px" }}>Recent Applications</h3>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E2E8F0", textAlign: "left" }}>
              <th>Event</th>
              <th>Date</th>
              <th>Slots</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr style={{ borderBottom: "1px solid #E2E8F0" , marginTop: "10"}}>
              <td>Tech Fest</td>
              <td>Oct 24</td>
              <td>3</td>
              <td><StatusBadge status="Pending Coordinator" /></td>
            </tr>

            <tr>
              <td>Sports Day</td>
              <td>Oct 20</td>
              <td>2</td>
              <td><StatusBadge status="Approved" /></td>
            </tr>
          </tbody>
        </table>

      </div>

    </div>
  );
}

export default Dashboard;