function StatCard({ title, value, color }) {
    return (
      <div style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        border: "1px solid #E2E8F0"
      }}>
        <p style={{ color: "#64748B", marginBottom: "8px" }}>{title}</p>
        <h2 style={{ color }}>{value}</h2>
      </div>
    );
  }
  
  export default StatCard;