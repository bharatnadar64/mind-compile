// @ts-nocheck
import { useState, useContext } from "react";
import { RoundContext } from "../context/ContextProvider";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const { api, loadRounds } = useContext(RoundContext);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        const res = await api.post("/api/user/login", {
          email: form.email,
          password: form.password,
        });

        const { token, participant } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(participant));
        localStorage.setItem("participantId", participant._id);

        await loadRounds();

        setMessage("✓ Access Granted");

        setTimeout(() => {
          if (participant.isAdmin) {
            navigate("/admin", { replace: true });
          } else {
            navigate("/rounds", { replace: true });
          }
        }, 800);
      } else {
        await api.post("/api/user/register", form);
        setMessage("✓ Registration Successful - Switch to Login");
        setIsLogin(true);
        setForm((prev) => ({ ...prev, password: "" }));
      }
    } catch (err) {
      setMessage(
        err.message || err.response?.data?.error || "✗ Operation Failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-green-400 font-mono flex items-center justify-center px-4 relative overflow-hidden scene-3d">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/8 via-transparent to-cyan-900/5 pointer-events-none" />
      <div className="absolute inset-0 scanlines opacity-5 pointer-events-none" />

      {/* Glow centers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(0,255,0,0.1),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(0,255,255,0.05),transparent_60%)] pointer-events-none" />

      {/* Terminal Box */}
      <div className="relative z-10 w-full max-w-md terminal-window depth-panel card-3d">
        {/* Header dots with animation */}
        <div className="terminal-header">
          <span className="terminal-dot bg-red-500 animate-pulse" />
          <span
            className="terminal-dot bg-yellow-500 animate-pulse"
            style={{ animationDelay: "0.3s" }}
          />
          <span
            className="terminal-dot bg-green-500 animate-pulse"
            style={{ animationDelay: "0.6s" }}
          />
          <span className="ml-3 text-green-600 text-xs">
            {isLogin ? "login@mindcompile" : "register@mindcompile"}
          </span>
        </div>

        {/* Content */}
        <div className="p-7 space-y-6">
          {/* Terminal prompt */}
          <p className="text-green-600 text-xs font-mono">
            <span className="text-cyan-500">root</span>@mindcompile{" "}
            <span className="text-cyan-500">~</span>#{" "}
            {isLogin ? "login" : "register"}
          </p>

          <h2 className="text-2xl font-bold tracking-widest text-green-300 glow-text">
            {isLogin ? "ENTER CREDENTIALS" : "CREATE ACCOUNT"}
          </h2>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="text-xs text-cyan-400 block mb-2">
                    $ NAME
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="full_name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="text-xs text-cyan-400 block mb-2">
                    $ COLLEGE
                  </label>
                  <input
                    type="text"
                    name="college"
                    placeholder="institution_name"
                    value={form.college}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-xs text-cyan-400 block mb-2">
                $ EMAIL
              </label>
              <input
                type="email"
                name="email"
                placeholder="user@domain.com"
                value={form.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="text-xs text-cyan-400 block mb-2">
                $ PASSWORD
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-6"
            >
              {loading
                ? ">>> PROCESSING <<<"
                : isLogin
                  ? "→ LOGIN"
                  : "→ REGISTER"}
            </button>
          </form>

          {/* MESSAGE */}
          {message && (
            <div
              className={`text-sm p-3 rounded border ${
                message.startsWith("✓")
                  ? "border-green-500/50 text-green-400 bg-green-500/10"
                  : "border-red-500/50 text-red-400 bg-red-500/10"
              }`}
            >
              {message}
            </div>
          )}

          {/* TOGGLE */}
          <div className="pt-4 border-t border-green-500/20">
            <p
              onClick={toggleMode}
              className="text-green-500/70 text-sm cursor-pointer hover:text-green-300 transition-colors"
            >
              <span className="text-cyan-400">&gt;</span>{" "}
              {isLogin
                ? "New user? Create account →"
                : "Already registered? Login →"}
            </p>
          </div>

          {/* WARNING */}
          <p className="text-red-500/80 text-xs animate-pulse border-t border-red-500/20 pt-4">
            ⚠ Unauthorized access attempts will be logged
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
