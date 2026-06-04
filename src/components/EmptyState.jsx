import Icon from "./Icon";

/** Results table empty — matches reference table-card + table-empty */
export function TableEmptyState({ icon, message }) {
  return (
    <div className="table-card">
      <div className="table-empty">
        <Icon name={icon} size={36} className="empty-state-icon" />
        <p>{message}</p>
      </div>
    </div>
  );
}

/** Insights empty / loading — matches reference panel layout */
export function PanelEmptyState({ icon, message, loading = false }) {
  return (
    <div
      className={`panel empty-state-panel${loading ? " empty-state-loading" : ""}`}
    >
      <Icon
        name={loading ? "loader" : icon}
        size={loading ? 32 : 36}
        className={loading ? "empty-state-icon spin" : "empty-state-icon"}
        style={loading ? { color: "var(--violet)" } : undefined}
      />
      <p>{message}</p>
    </div>
  );
}
