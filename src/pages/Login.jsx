import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api";
import Brand from "../components/Brand";
import Button from "../components/Button";
import Icon from "../components/Icon";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) {
        if (!email || !password) {
          setError("Email and password required");
          return;
        }
        await API.post("/auth/register", { email, password });
        toast.success("Registration successful! Please login.");
        setIsRegister(false);
        setEmail("");
        setPassword("");
      } else {
        const res = await API.post("/auth/login", { email, password });
        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem("email", res.data.email);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          (isRegister ? "Registration failed" : "Login failed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login-brand">
        <div className="login-brand-top">
          <Brand />
        </div>
        <div className="login-brand-body">
          <h1>
            Turn pharmacy
            <br />
            conversations into
            <br />
            clear actions.
          </h1>
          <p>
            Upload WAV recordings, get structured insights — triggers, strengths,
            frictions and prioritized improvements — across every pharmacy in your
            group.
          </p>
          <div className="login-stats">
            <div>
              <div className="ls-num">∞</div>
              <div className="ls-lbl">Audio files</div>
            </div>
            <div className="ls-sep" />
            <div>
              <div className="ls-num">AI</div>
              <div className="ls-lbl">Powered insights</div>
            </div>
            <div className="ls-sep" />
            <div>
              <div className="ls-num">FR</div>
              <div className="ls-lbl">Language support</div>
            </div>
          </div>
        </div>
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-grid-bg" />
      </div>

      <div className="login-form-wrap">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-head">
            <h2>{isRegister ? "Create account" : "Welcome back"}</h2>
            <p>
              {isRegister
                ? "Sign up for your analyzer workspace."
                : "Sign in to your analyzer workspace."}
            </p>
          </div>

          <label className="field">
            <span className="field-label">Email address</span>
            <div className="input">
              <Icon name="mail" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@pharmacy.com"
                autoComplete="username"
                required
              />
            </div>
          </label>

          <label className="field">
            <span className="field-label">Password</span>
            <div className="input">
              <Icon name="lock" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={isRegister ? "new-password" : "current-password"}
                required
              />
              <button
                type="button"
                className="input-action"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <Icon name="eye" size={18} />
              </button>
            </div>
          </label>

          {error && <p className="form-error">{error}</p>}

          {!isRegister && (
            <div className="login-row">
              <label className="checkbox">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#forgot" className="link" onClick={(e) => e.preventDefault()}>
                Forgot password?
              </a>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="btn-block"
            disabled={loading}
          >
            {loading ? "Please wait…" : isRegister ? "Create account" : "Login"}
          </Button>

          <p className="login-foot">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              className="link strong"
              style={{ background: "none", border: "none", padding: 0 }}
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
            >
              {isRegister ? "Login" : "Register"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
