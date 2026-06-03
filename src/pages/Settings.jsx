import { useState } from "react";
import AppLayout from "../components/AppLayout";
import Button from "../components/Button";
import Icon from "../components/Icon";
import Toggle from "../components/Toggle";

const ANALYSIS_TOGGLES = [
  {
    title: "Auto-generate insights after upload",
    desc: "Run the cross-analysis as soon as a batch finishes.",
    defaultOn: true,
  },
  {
    title: "Detect speaker frictions",
    desc: "Flag hesitations and complaints in the transcript.",
    defaultOn: true,
  },
  {
    title: "Anonymize patient names",
    desc: "Strip personal identifiers before storing transcripts.",
    defaultOn: false,
  },
];

const NOTIFICATION_TOGGLES = [
  {
    title: "Analysis complete",
    desc: "When a batch finishes processing.",
    defaultOn: true,
  },
  {
    title: "Upload failures",
    desc: "When a file can't be analyzed.",
    defaultOn: false,
  },
  {
    title: "Weekly digest",
    desc: "A Monday summary of new insights.",
    defaultOn: true,
  },
];

const TABS = [
  { key: "profile", label: "Profile" },
  { key: "analysis", label: "Analysis" },
  { key: "notifications", label: "Notifications" },
];

function Avatar({ name, email, size = 64 }) {
  const initials = (name || email || "?")
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((c) => c[0].toUpperCase())
    .join("");

  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {initials}
    </div>
  );
}

export default function Settings() {
  const [tab, setTab] = useState("profile");
  const email = localStorage.getItem("email") || "";
  const displayName = email.split("@")[0] || "User";

  return (
    <AppLayout active="settings" crumbs={["Workspace", "Settings"]}>
      <div className="page-head">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-sub">Manage your workspace and analysis preferences.</p>
        </div>
      </div>

      <div className="tabs" style={{ marginBottom: 22 }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`tab${tab === t.key ? " active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="settings-grid">
          <div className="panel set-panel">
            <div className="set-head">
              <h3>Account</h3>
              <p>Your sign-in identity for the analyzer.</p>
            </div>
            <div className="set-body">
              <div className="set-avatar-row">
                <Avatar name={displayName} email={email} size={64} />
                <div>
                  <Button variant="secondary" icon="upload">
                    Change photo
                  </Button>
                  <div className="set-hint">JPG or PNG, max 1 MB.</div>
                </div>
              </div>
              <div className="set-field">
                <label>Full name</label>
                <div className="input">
                  <input type="text" defaultValue={displayName} />
                </div>
              </div>
              <div className="set-field">
                <label>Email address</label>
                <div className="input">
                  <Icon name="mail" size={18} />
                  <input type="email" defaultValue={email} />
                </div>
              </div>
              <div className="set-actions">
                <Button>Save changes</Button>
              </div>
            </div>
          </div>

          <div className="panel set-panel">
            <div className="set-head">
              <h3>Workspace</h3>
              <p>Defaults applied to new analyses.</p>
            </div>
            <div className="set-body">
              <div className="set-field">
                <label>Default language</label>
                <div className="select">
                  <span>Français (FR)</span>
                  <Icon name="chevronDown" size={16} />
                </div>
              </div>
              <div className="set-field">
                <label>Pharmacy group</label>
                <div className="select">
                  <span>All groups</span>
                  <Icon name="chevronDown" size={16} />
                </div>
              </div>
              <div className="set-actions">
                <Button>Save changes</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "analysis" && (
        <div className="panel set-panel" style={{ maxWidth: 640 }}>
          <div className="set-head">
            <h3>Analysis engine</h3>
            <p>Control how recordings are processed.</p>
          </div>
          <div className="set-body">
            {ANALYSIS_TOGGLES.map((item, i) => (
              <div key={i} className="toggle-row">
                <div>
                  <div className="tr-title">{item.title}</div>
                  <div className="tr-sub">{item.desc}</div>
                </div>
                <Toggle defaultOn={item.defaultOn} />
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "notifications" && (
        <div className="panel set-panel" style={{ maxWidth: 640 }}>
          <div className="set-head">
            <h3>Notifications</h3>
            <p>Choose what we ping you about.</p>
          </div>
          <div className="set-body">
            {NOTIFICATION_TOGGLES.map((item, i) => (
              <div key={i} className="toggle-row">
                <div>
                  <div className="tr-title">{item.title}</div>
                  <div className="tr-sub">{item.desc}</div>
                </div>
                <Toggle defaultOn={item.defaultOn} />
              </div>
            ))}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
