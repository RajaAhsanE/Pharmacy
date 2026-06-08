import Icon from "./Icon";
import StatusBadge from "./StatusBadge";
import {
  parseCrossAnalysis,
  parsePriorityActions,
  parseCellBullets,
} from "../utils/parseInsights";

function InlineText({ text }) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function BulletCell({ items, fallback }) {
  if (items.length) {
    return (
      <ul className="dot-list">
        {items.map((item, i) => (
          <li key={i}>
            <InlineText text={item} />
          </li>
        ))}
      </ul>
    );
  }

  const bullets = parseCellBullets(fallback);
  if (bullets.length) {
    return (
      <ul className="dot-list">
        {bullets.map((item, i) => (
          <li key={i}>
            <InlineText text={item} />
          </li>
        ))}
      </ul>
    );
  }

  if (!fallback || fallback === "—") {
    return <span className="cross-empty">—</span>;
  }

  return <InlineText text={fallback} />;
}

export function CrossAnalysisTable({ text }) {
  const { headers, themes } = parseCrossAnalysis(text);

  if (!themes.length) {
    return <p className="cross-empty">—</p>;
  }

  const successHeader = headers[1] || "Groupe SUCCESS";
  const failureHeader = headers[2] || "Groupe FAILURE";

  return (
    <div className="cross-grid">
      {/* <div className="cross-head">
        <div>Thème</div>
        <div>{successHeader}</div>
        <div>{failureHeader}</div>
      </div> */}
      {themes.map((row, i) => (
        <div key={i} className="cross-row">
          <div className="cross-theme">
            <span className="cross-ico">
              <Icon name="insights" size={14} />
            </span>
            <InlineText text={row.theme} />
          </div>
          <BulletCell items={row.successItems} fallback={row.success} />
          <BulletCell items={row.failureItems} fallback={row.failure} />
        </div>
      ))}
    </div>
  );
}

const PRIORITY_STYLES = [
  { match: (p) => p.includes("🔴") || /critique/i.test(p), bg: "#FEE2E2", fg: "#991B1B", label: "Critique" },
  { match: (p) => p.includes("🟠") || /haute/i.test(p), bg: "#FEF3C7", fg: "#92400E", label: "Haute" },
  { match: (p) => p.includes("🟡") || /moyenne/i.test(p), bg: "#EEF1F6", fg: "#4A5568", label: "Moyenne" },
];

function getPriorityStyle(priority) {
  const p = priority || "";
  return PRIORITY_STYLES.find((s) => s.match(p)) || PRIORITY_STYLES[2];
}

function PriorityBadge({ priority }) {
  const s = getPriorityStyle(priority);
  return (
    <span className="badge priority-badge" style={{ background: s.bg, color: s.fg }}>
      {s.label}
    </span>
  );
}

export function PriorityActionsTable({ text }) {
  const { headers, actions } = parsePriorityActions(text);

  if (!actions.length) {
    return <p className="cross-empty">—</p>;
  }

  const cols = headers.length
    ? headers
    : ["#", "Action", "Priorité", "Groupe concerné", "Détail / Contexte"];

  return (
    <div className="table-card insights-table">
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {cols.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {actions.map((row, i) => (
              <tr key={i}>
                <td className="col-n">{row.num}</td>
                <td>
                  <span className="ph-name">
                    <InlineText text={row.action} />
                  </span>
                </td>
                <td>
                  <PriorityBadge priority={row.priority} />
                </td>
                <td>
                  <GroupeBadge groupe={row.groupe} />
                </td>
                <td>
                  <InlineText text={row.detail} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GroupeBadge({ groupe }) {
  const g = (groupe || "").toLowerCase();
  if (g.includes("success")) return <StatusBadge status="success" />;
  if (g.includes("failure")) return <StatusBadge status="failure" />;
  return <span className="chip">{groupe || "—"}</span>;
}
