// @ts-nocheck
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RoundContext } from "../context/ContextProvider.jsx";
import { motion } from "framer-motion";

const Profile = () => {
  const { api } = useContext(RoundContext);
  const [userInfo, setUserInfo] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const userRes = await api.get("/api/user/me");
        setUserInfo(userRes.data);
        const subRes = await api.get(`/api/submission/participant/${userRes.data._id}`);
        setSubmissions(subRes.data.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err.response?.data?.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate, api]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-emerald-500 font-mono tracking-widest text-xs animate-pulse">DECRYPTING_USER_PROFILE...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="cyber-card max-w-md w-full border-rose-500/30 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">ACCESS_DENIED</h2>
          <p className="text-slate-500 text-sm mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="neon-button w-full">RETRY_AUTHENTICATION</button>
        </div>
      </div>
    );
  }

  const getRank = (score) => {
    if (score >= 1000) return { label: "ELITE_HACKER", color: "text-rose-500", glow: "shadow-rose-500/20", icon: "💎" };
    if (score >= 500) return { label: "CYBER_NOMAD", color: "text-amber-400", glow: "shadow-amber-500/20", icon: "🛡️" };
    if (score >= 200) return { label: "TECH_SCOUT", color: "text-cyan-400", glow: "shadow-cyan-500/20", icon: "🛰️" };
    return { label: "CODE_INITIATE", color: "text-emerald-400", glow: "shadow-emerald-500/20", icon: "🌱" };
  };

  const rank = getRank(userInfo?.totalScore || 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 pb-20 pt-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow centers */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-emerald-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-[120px]" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Profile Header Card */}
        <div className="cyber-card p-10 mb-12 border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-12 relative z-10">
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-40 h-40 rounded-3xl bg-slate-900 border-2 border-emerald-500/30 flex items-center justify-center relative shadow-[0_0_50px_rgba(16,185,129,0.1)] group-hover:border-emerald-500 transition-all duration-500 overflow-hidden">
                <div className="text-7xl font-bold text-white/10 absolute inset-0 flex items-center justify-center pointer-events-none uppercase">
                  {userInfo.name?.charAt(0)}
                </div>
                <div className="text-6xl text-white relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  {rank.icon}
                </div>
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-4 py-1 rounded-full text-[10px] font-black tracking-widest whitespace-nowrap shadow-lg">
                LEVEL_0{userInfo.unlockedRounds?.length || 1}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-white">
                    {userInfo.name.toUpperCase()}
                  </h1>
                  {userInfo.isDisqualified && (
                    <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-1 rounded animate-pulse">TERMINATED</span>
                  )}
                </div>
                <p className="text-slate-500 font-mono tracking-widest text-xs">{userInfo.email}</p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="px-6 py-3 rounded-2xl glass-panel border-white/5 flex flex-col items-center md:items-start">
                  <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-1">Current_Rank</span>
                  <span className={`font-black tracking-tighter text-lg ${rank.color}`}>{rank.label}</span>
                </div>
                <div className="px-6 py-3 rounded-2xl glass-panel border-white/5 flex flex-col items-center md:items-start">
                  <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-1">Nodes_Captured</span>
                  <span className="font-black tracking-tighter text-lg text-white">{userInfo.totalScore} PTS</span>
                </div>
                <div className="px-6 py-3 rounded-2xl glass-panel border-white/5 flex flex-col items-center md:items-start">
                  <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-1">Host_Station</span>
                  <span className="font-black tracking-tighter text-lg text-white truncate max-w-[150px]">{userInfo.college || "INDEPENDENT"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transmission History */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-xl font-bold text-white tracking-widest uppercase border-l-4 border-emerald-500 pl-4">Transmission_History</h2>
            <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">{submissions.length} PACKETS_SENT</span>
          </div>

          <div className="glass-panel overflow-hidden border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="px-8 py-5 font-mono text-[10px] text-slate-500 tracking-widest uppercase">Phase</th>
                    <th className="px-8 py-5 font-mono text-[10px] text-slate-500 tracking-widest uppercase">Sequence</th>
                    <th className="px-8 py-5 font-mono text-[10px] text-slate-500 tracking-widest uppercase">Status</th>
                    <th className="px-8 py-5 font-mono text-[10px] text-slate-500 tracking-widest uppercase">Yield</th>
                    <th className="px-8 py-5 font-mono text-[10px] text-slate-500 tracking-widest uppercase">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {submissions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-8 py-20 text-center">
                        <div className="text-slate-600 font-mono text-xs tracking-[0.3em]">NO_TRANSMISSIONS_DETECTED</div>
                      </td>
                    </tr>
                  ) : (
                    submissions.map((sub, idx) => (
                      <tr key={sub._id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-5 font-bold text-emerald-500">R{sub.round}</td>
                        <td className="px-8 py-5 text-white font-medium">
                          {sub.problemId?.title || `SEQ_${sub._id.slice(-6).toUpperCase()}`}
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase
                            ${sub.isCorrect ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}
                          `}>
                            {sub.isCorrect ? "ACCEPTED" : "FAILURE"}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-white font-mono">+{sub.scoreAwarded}</td>
                        <td className="px-8 py-5 text-slate-500 font-mono text-[10px]">
                          {new Date(sub.submittedAt).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* System Logs */}
        <div className="mt-16 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-slate-500 tracking-[0.2em] border-t border-white/5 pt-8">
          <div className="flex items-center gap-6">
            <span>SESSION_ID: {userInfo._id.slice(-12).toUpperCase()}</span>
            <span>OS: MC_CORE_v2.0</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            ENCRYPTION_STABLE
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
