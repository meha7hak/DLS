function StatusBadge({ status }) {
  const colors = {
    "Pending Coordinator": "#F59E0B",
    "Pending Teacher": "#3B82F6",
    "Pending HOD": "#8B5CF6",
    Approved: "#22C55E",
    Rejected: "#EF4444"
  };

  return (
    <span style={{
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      color: "#fff",
      background: colors[status]
    }}>
      {status}
    </span>
  );
}

export default StatusBadge;