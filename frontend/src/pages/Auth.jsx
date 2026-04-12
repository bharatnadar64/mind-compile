// @ts-nocheck
import { useState, useContext } from "react";
import { RoundContext } from "../context/ContextProvider";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const { api } = useContext(RoundContext);
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
    setIsLogin(!isLogin);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    console.log(import.meta.env);
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        const res = await api.post("/api/user/login", {
          email: form.email,
          password: form.password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.participant)); // ✅ IMPORTANT
        setMessage("Access Granted 🎉");
        if (res.data.participant.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/rounds");
        }

        setTimeout(() => navigate("/rounds"), 1000);
      } else {
        await api.post("/api/user/register", form);
        setMessage("Registration Successful ✅ Switch to Login");
        setIsLogin(true);
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center px-4 relative overflow-hidden">
      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.15) 3px)",
        }}
      />

      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(0,255,0,0.08),transparent_60%)]" />

      {/* Terminal Box */}
      <div className="relative z-10 w-full max-w-md border border-green-500/30 bg-black/70 backdrop-blur-md p-6 shadow-[0_0_40px_rgba(0,255,0,0.2)]">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="w-3 h-3 bg-yellow-500 rounded-full" />
          <span className="w-3 h-3 bg-green-500 rounded-full" />
        </div>

        <p className="text-green-500/60 text-sm mb-2">
          {isLogin ? "> login mindcompile.sys" : "> register mindcompile.sys"}
        </p>

        <h2 className="text-xl mb-6 tracking-widest">
          {isLogin ? "AUTHENTICATION REQUIRED_" : "CREATE ACCOUNT_"}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="NAME"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-black border border-green-500/30 px-3 py-2 text-green-400 outline-none focus:border-green-400"
              />

              <input
                type="text"
                name="college"
                placeholder="COLLEGE"
                value={form.college}
                onChange={handleChange}
                className="w-full bg-black border border-green-500/30 px-3 py-2 text-green-400 outline-none focus:border-green-400"
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="EMAIL"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full bg-black border border-green-500/30 px-3 py-2 text-green-400 outline-none focus:border-green-400"
          />

          <input
            type="password"
            name="password"
            placeholder="PASSWORD"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full bg-black border border-green-500/30 px-3 py-2 text-green-400 outline-none focus:border-green-400"
          />

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all duration-300"
          >
            {loading ? "Processing..." : isLogin ? "LOGIN" : "REGISTER"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="mt-4 text-sm text-green-400">
            {"> "} {message}
          </p>
        )}

        {/* Toggle */}
        <p
          onClick={toggleMode}
          className="mt-6 text-green-500/70 text-sm cursor-pointer hover:text-green-400"
        >
          {isLogin
            ? "New user? Create account →"
            : "Already registered? Login →"}
        </p>

        {/* Warning */}
        <p className="mt-4 text-red-500 text-xs animate-pulse">
          ⚠ Vibecoders will be eliminated.
        </p>
      </div>
    </div>
  );
};

export default Auth;
