import { useNavigate, useLocation } from "react-router-dom";
import Icon from "./Icon";
import Brand from "./Brand";

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: "dashboard", path: "/dashboard" },
  { key: "uploads", label: "Uploads", icon: "upload", path: "/uploads" },
  { key: "insights", label: "Insights", icon: "insights", path: "/dashboard?tab=insights" },
  { key: "settings", label: "Settings", icon: "settings", path: "/settings" },
];

const ROUTES = {
  dashboard: "/dashboard",
  uploads: "/uploads",
  insights: "/dashboard?tab=insights",
  settings: "/settings",
};

function Avatar({ name, email, size = 38 }) {
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

function Sidebar({ active, onNav }) {
  const email = localStorage.getItem("email") || "";
  const displayName = email.split("@")[0] || "User";

  return (
    <aside className="sidebar">
      <Brand onClick={() => onNav("dashboard")} />
      <nav className="nav">
        <div className="nav-label">Menu</div>
        {NAV.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`nav-link${active === item.key ? " active" : ""}`}
            onClick={() => onNav(item.key)}
          >
            <Icon name={item.icon} size={18} />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-foot">
        <div className="user-card">
          <Avatar name={displayName} email={email} />
          <div className="user-meta">
            <div className="user-name">{displayName}</div>
            <div className="user-email">{email}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ crumbs, onLogout }) {
  const email = localStorage.getItem("email") || "";
  const displayName = email.split("@")[0] || "User";

  return (
    <header className="topbar">
      <div className="crumbs">
        {crumbs.map((c, i) => (
          <span key={`${c}-${i}`}>
            {i > 0 && <span className="crumb-sep">/</span>}
            <span className={i === crumbs.length - 1 ? "crumb-current" : "crumb"}>{c}</span>
          </span>
        ))}
      </div>
      <div className="topbar-search">
        <Icon name="search" size={17} />
        <input type="search" placeholder="Search pharmacies, audio IDs…" />
        <kbd>⌘K</kbd>
      </div>
      <div className="topbar-right">
        <button type="button" className="icon-btn" aria-label="Notifications">
          <Icon name="bell" size={17} />
          <span className="badge-dot-float" />
        </button>
        <Avatar name={displayName} email={email} size={34} />
        <div className="topbar-divider" />
        <button type="button" className="btn btn-secondary" onClick={onLogout}>
          <Icon name="logout" size={17} />
          Logout
        </button>
      </div>
    </header>
  );
}

export function useSidebarActive() {
  const { pathname, search } = useLocation();
  const tab = new URLSearchParams(search).get("tab");
  if (pathname.startsWith("/uploads")) return "uploads";
  if (pathname.startsWith("/settings")) return "settings";
  if (tab === "insights") return "insights";
  return "dashboard";
}

export default function AppLayout({ active: activeProp, crumbs, children }) {
  const navigate = useNavigate();
  const detectedActive = useSidebarActive();
  const active = activeProp ?? detectedActive;

  const handleNav = (key) => {
    navigate(ROUTES[key] || "/dashboard");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="app">
      <Sidebar active={active} onNav={handleNav} />
      <div className="main">
        <Topbar crumbs={crumbs} onLogout={logout} />
        <div className="content">{children}</div>
      </div>
    </div>
  );
}
