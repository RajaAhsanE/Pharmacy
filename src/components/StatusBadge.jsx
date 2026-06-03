const styles = {
  done: { bg: "#D1FAE5", fg: "#065F46", dot: "#10B981", label: "SUCCESS" },
  success: { bg: "#D1FAE5", fg: "#065F46", dot: "#10B981", label: "SUCCESS" },
  error: { bg: "#FEE2E2", fg: "#991B1B", dot: "#EF4444", label: "FAILURE" },
  failure: { bg: "#FEE2E2", fg: "#991B1B", dot: "#EF4444", label: "FAILURE" },
  processing: { bg: "#FEF3C7", fg: "#92400E", dot: "#F59E0B", label: "PROCESSING" },
  pending: { bg: "#FEF3C7", fg: "#92400E", dot: "#F59E0B", label: "PROCESSING" },
};

export default function StatusBadge({ status }) {
  const key = (status || "pending").toLowerCase();
  const s = styles[key] || styles.pending;
  const pulse = key === "processing" || key === "pending";

  return (
    <span className="badge" style={{ background: s.bg, color: s.fg }}>
      <span className={`badge-dot${pulse ? " pulse" : ""}`} style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}
