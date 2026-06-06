import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import AppLayout from "../components/AppLayout";
import Button from "../components/Button";
import Icon from "../components/Icon";
import StatusBadge from "../components/StatusBadge";
import { mapDetailSections } from "../utils/parseAnalysis";

const SECTION_STYLES = {
  "Déclencheur / Usage": { icon: "target", color: "#6C47FF" },
  "Points forts / Aha moment": { icon: "bulb", color: "#22C55E" },
  "Frictions rencontrées": { icon: "alert", color: "#EF4444" },
  "Suggestions d'amélioration": { icon: "sparkles", color: "#F59E0B" },
  "Contexte 1ère commande": { icon: "target", color: "#6C47FF" },
  "Expérience de bout en bout": { icon: "bulb", color: "#22C55E" },
  "Raisons du retour aux habitudes": { icon: "alert", color: "#EF4444" },
  "Conditions de retour / Suggestions": { icon: "sparkles", color: "#F59E0B" },
};

const SECTION_PALETTE = [
  { icon: "target", color: "#6C47FF" },
  { icon: "bulb", color: "#22C55E" },
  { icon: "alert", color: "#EF4444" },
  { icon: "sparkles", color: "#F59E0B" },
];

function getSectionStyle(title, index) {
  return SECTION_STYLES[title] || SECTION_PALETTE[index % SECTION_PALETTE.length];
}

export default function AudioDetail() {
  const { audio_id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/data/${audio_id}`);
        setData(res.data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load audio details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [audio_id]);

  if (loading) {
    return (
      <AppLayout crumbs={["Workspace", "Dashboard", "Loading…"]}>
        <div className="table-empty">
          <Icon name="loader" size={32} className="spin" style={{ color: "var(--violet)" }} />
          <p style={{ marginTop: 12 }}>Loading audio details…</p>
        </div>
      </AppLayout>
    );
  }

  if (error || !data) {
    return (
      <AppLayout crumbs={["Workspace", "Dashboard", "Error"]}>
        <div className="empty-detail">
          <div className="empty-icon fail">
            <Icon name="alert" size={28} />
          </div>
          <h3>{error || "Not found"}</h3>
          <p>Could not load this audio record.</p>
          <Button variant="secondary" onClick={() => navigate("/dashboard")}>
            Back to dashboard
          </Button>
        </div>
      </AppLayout>
    );
  }

  const sections = mapDetailSections(data);
  const uploaded = data.uploaded_at
    ? new Date(data.uploaded_at).toLocaleString("fr-FR")
    : "—";
  const processed = data.processed_at
    ? new Date(data.processed_at).toLocaleString("fr-FR")
    : "—";
  const ready = data.status === "done" && sections.length > 0;

  return (
    <AppLayout crumbs={["Workspace", "Dashboard", data.pharmacy]}>
      <button type="button" className="back-link" onClick={() => navigate("/dashboard")}>
        <Icon name="arrowLeft" size={18} />
        Back to dashboard
      </button>

      <div className="detail-hero">
        <div className="hero-main">
          <div className="hero-avatar">
            <Icon name="capsule" size={26} />
          </div>
          <div className="hero-info">
            <div className="hero-titlerow">
              <h1>{data.pharmacy}</h1>
            </div>
            <div className="hero-chips">
              <div className="hero-chip-row">
                <span className="hero-chip-label">Groupe</span>
                <StatusBadge status={data.groupe} />
              </div>
              <div className="hero-chip-row">
                <span className="hero-chip-label">Status</span>
                <StatusBadge status={data.status} />
                <span className="badge badge-soft">{data.status}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-actions">
          <Button variant="secondary" icon="download">
            Export report
          </Button>
        </div>
        <div className="hero-meta">
          <div className="meta-item">
            <span className="meta-key">Audio ID</span>
            <span className="meta-val mono">{data.audio_id}</span>
          </div>
          <div className="meta-item">
            <span className="meta-key">Uploaded</span>
            <span className="meta-val">
              <Icon name="upload" size={15} /> {uploaded}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-key">Processed</span>
            <span className="meta-val">
              <Icon name="check" size={15} /> {processed}
            </span>
          </div>
        </div>
      </div>

      {ready ? (
        <>
          <div className="section-label">
            <Icon name="wave" size={18} />
            Analysis
          </div>
          <div className="analysis-grid">
            {sections.map((section, index) => {
              const style = getSectionStyle(section.title, index);
              return (
                <div key={section.title} className="analysis-card">
                  <div className="ac-strip" style={{ background: style.color }} />
                  <div className="ac-head">
                    <span
                      className="ac-icon"
                      style={{ background: `${style.color}1a`, color: style.color }}
                    >
                      <Icon name={style.icon} size={18} />
                    </span>
                    <h3>{section.title}</h3>
                    <span className="ac-count">{section.items.length}</span>
                  </div>
                  <ul className="ac-list" style={{ "--marker": style.color }}>
                    {section.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </>
      ) : data.status === "done" ? (
        <div className="empty-detail">
          <div className="empty-icon proc">
            <Icon name="wave" size={28} />
          </div>
          <h3>No analysis data</h3>
          <p>This recording has no analysis content to display.</p>
        </div>
      ) : (
        <div className="empty-detail">
          <div className={`empty-icon ${data.status === "error" ? "fail" : "proc"}`}>
            <Icon name={data.status === "error" ? "alert" : "clock"} size={28} />
          </div>
          <h3>
            {data.status === "processing" && "Processing audio"}
            {data.status === "pending" && "Waiting in queue"}
            {data.status === "error" && "Processing failed"}
          </h3>
          <p>
            {data.status === "processing" && "Analysis is in progress — check back soon."}
            {data.status === "pending" && "This file is queued for analysis."}
            {data.status === "error" && (data.error || "An error occurred during processing.")}
          </p>
        </div>
      )}
    </AppLayout>
  );
}
