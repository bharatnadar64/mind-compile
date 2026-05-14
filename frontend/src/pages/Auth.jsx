// @ts-nocheck
import { useState, useContext } from "react";
import { RoundContext } from "../context/ContextProvider";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
        setMessage("✓ ACCESS_GRANTED");

        setTimeout(() => {
          if (participant.isAdmin) {
            navigate("/admin", { replace: true });
          } else {
            navigate("/rounds", { replace: true });
          }
        }, 800);
      } else {
        await api.post("/api/user/register", form);
        setMessage("✓ REGISTRATION_SUCCESSFUL");
        setTimeout(() => setIsLogin(true), 1500);
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "✗ AUTH_FAILURE");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-glow" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="cyber-card p-8 border-white/5 shadow-2xl">
          <div className="terminal-header mb-8">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
            </div>
            <div className="text-[10px] text-slate-500 font-mono ml-4 tracking-widest uppercase">
              {isLogin ? "auth.login" : "auth.register"}
            </div>
          </div>

          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-black tracking-tighter text-white mb-2">
              {isLogin ? "INITIALIZE_SESSION" : "REGISTER_IDENTITY"}
            </h2>
            <p className="text-slate-500 text-xs font-mono tracking-widest">
              Please enter your parameters to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] text-emerald-500 font-mono tracking-widest uppercase ml-1">Identity_Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. John Doe"
                      value={form.name}
                      onChange={handleChange}
                      required={!isLogin}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-emerald-500 font-mono tracking-widest uppercase ml-1">Host_Station</label>
                    <input
                      type="text"
                      name="college"
                      placeholder="e.g. SIESGST"
                      value={form.college}
                      onChange={handleChange}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] text-emerald-500 font-mono tracking-widest uppercase ml-1">Comms_Link</label>
              <input
                type="email"
                name="email"
                placeholder="user@domain.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-emerald-500 font-mono tracking-widest uppercase ml-1">Access_Key</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="neon-button w-full py-4 text-xs mt-4 uppercase tracking-[0.2em] font-black"
            >
              {loading ? "PROCESSING..." : isLogin ? "EXECUTE_LOGIN" : "INITIALIZE_ACCOUNT"}
            </button>
          </form>

          {message && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-xl text-[10px] font-mono tracking-widest text-center border ${
                message.includes("✓") 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
              }`}
            >
              {message}
            </motion.div>
          )}

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <button
              onClick={toggleMode}
              className="text-slate-500 hover:text-emerald-400 transition-colors text-[10px] font-mono tracking-widest uppercase"
            >
              {isLogin ? "Need access? Request identity →" : "Have identity? Execute login →"}
            </button>
          </div>
        </div>
        
        <p className="mt-8 text-center text-rose-500 text-[8px] font-mono tracking-[0.4em] uppercase animate-pulse">
          Unauthorized_access_is_monitored
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
