function StatusBadge({ status }) {
  const colors = {
    PENDING_COORDINATOR: "#F59E0B",
    PENDING_CI: "#3B82F6",
    PENDING_HOD: "#8B5CF6",
    FINAL_APPROVED: "#22C55E",
    REJECTED_BY_COORD: "#EF4444",
    REJECTED_BY_CI: "#EF4444",
    REJECTED_BY_HOD: "#EF4444",
  };
  
  const displayStatus = status.replace(/_/g, " ");

  return (
    <span style={{
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      color: "#fff",
      background: colors[status]
    }}>
      {displayStatus}
    </span>
  );
}

export default StatusBadge;