function StatCard({ title, value, color }) {
    return (
      <div style={{
        background: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(10px)",
        padding: "20px",
        borderRadius: "10px",
        border: "1px solid rgba(226, 232, 240, 0.5)"
      }}>
        <p style={{ color: "#64748B", marginBottom: "8px" }}>{title}</p>
        <h2 style={{ color }}>{value}</h2>
      </div>
    );
  }
  
  export default StatCard;