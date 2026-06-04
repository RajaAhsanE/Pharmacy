import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import AppLayout from "../components/AppLayout";
import Button from "../components/Button";
import Icon from "../components/Icon";
import StatusBadge from "../components/StatusBadge";
import { mapDetailAnalysis } from "../utils/parseAnalysis";

const ANALYSIS_CARDS = [
  { key: "trigger", title: "Déclencheur / Usage", icon: "target", color: "#6C47FF" },
  { key: "strengths", title: "Points forts / Aha moment", icon: "bulb", color: "#22C55E" },
  { key: "frictions", title: "Frictions rencontrées", icon: "alert", color: "#EF4444" },
  { key: "suggestions", title: "Suggestions d'amélioration", icon: "sparkles", color: "#F59E0B" },
];

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

  const analysis = mapDetailAnalysis(data);
  const uploaded = data.uploaded_at
    ? new Date(data.uploaded_at).toLocaleString("fr-FR")
    : "—";
  const processed = data.processed_at
    ? new Date(data.processed_at).toLocaleString("fr-FR")
    : "—";
  const ready = data.status === "done" && analysis;

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
            {ANALYSIS_CARDS.map((card) => {
              const items = analysis[card.key] || [];
              return (
                <div key={card.key} className="analysis-card">
                  <div className="ac-strip" style={{ background: card.color }} />
                  <div className="ac-head">
                    <span
                      className="ac-icon"
                      style={{ background: `${card.color}1a`, color: card.color }}
                    >
                      <Icon name={card.icon} size={18} />
                    </span>
                    <h3>{card.title}</h3>
                    <span className="ac-count">{items.length}</span>
                  </div>
                  <ul
                    className="ac-list"
                    style={{ "--marker": card.color }}
                  >
                    {items.length ? (
                      items.map((item, i) => <li key={i}>{item}</li>)
                    ) : (
                      <li>—</li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </>
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
