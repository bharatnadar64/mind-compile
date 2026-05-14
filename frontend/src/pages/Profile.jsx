// @ts-nocheck
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RoundContext } from "../context/ContextProvider.jsx";

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
        // Fetch User Info
        const userRes = await api.get("/api/user/me");
        setUserInfo(userRes.data);

        // Fetch Submissions
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
      <div className="min-h-screen bg-black flex items-center justify-center font-mono">
        <div className="text-green-500 text-xl animate-pulse tracking-[0.5em]">
          {">"} INITIALIZING_USER_DATA...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono">
        <div className="text-red-500 border border-red-500/30 p-8 bg-red-500/5 rounded backdrop-blur-sm">
          <div className="font-bold text-2xl mb-2 tracking-tighter">ACCESS_ERROR</div>
          <div className="opacity-70">{error}</div>
          <button onClick={() => window.location.reload()} className="mt-6 px-4 py-2 border border-red-500/50 hover:bg-red-500/20 transition-all text-xs">
            RETRY_CONNECTION
          </button>
        </div>
      </div>
    );
  }

  const getRank = (score) => {
    if (score >= 1000) return { label: "ELITE_HACKER", color: "text-red-500", glow: "shadow-red-500/20" };
    if (score >= 500) return { label: "CYBER_NOMAD", color: "text-orange-400", glow: "shadow-orange-500/20" };
    if (score >= 200) return { label: "TECH_SCOUT", color: "text-cyan-400", glow: "shadow-cyan-500/20" };
    return { label: "CODE_INITIATE", color: "text-green-400", glow: "shadow-green-500/20" };
  };

  const rank = getRank(userInfo?.totalScore || 0);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono pt-24 pb-12 px-4 sm:px-6 relative overflow-hidden">
      {/* BACKGROUND FX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,0,0.05),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* SCANLINE OVERLAY */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.07]" 
        style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.5) 3px)" }} />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
          {/* AVATAR/HEXAGON */}
          <div className="relative group">
            <div className={`w-32 h-32 md:w-40 md:h-40 bg-black border-2 border-green-500/30 flex items-center justify-center relative shadow-[0_0_30px_rgba(0,255,0,0.1)] transition-all duration-500 group-hover:border-green-400 ${rank.glow}`}>
              <div className="text-4xl md:text-6xl text-green-300 drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]">
                {userInfo.name?.charAt(0).toUpperCase()}
              </div>
              
              {/* Corner Accents */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-green-400" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-green-400" />
            </div>
            {/* Status Indicator */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black border border-green-500/40 px-3 py-1 rounded-full text-[10px] tracking-widest whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block mr-1.5 animate-pulse" />
              USER_ONLINE
            </div>
          </div>

          {/* USER BASIC INFO */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-green-300 mb-1 flex items-center gap-3">
                {userInfo.name.toUpperCase()}
                {userInfo.isDisqualified && (
                  <span className="text-xs bg-red-600 text-white px-2 py-0.5 tracking-widest font-bold animate-pulse">DISQUALIFIED</span>
                )}
              </h1>
              <p className="text-green-500/60 text-sm tracking-[0.2em]">{userInfo.email}</p>
            </div>

            <div className="flex flex-wrap gap-4 mt-6">
              <div className="border border-green-500/20 bg-green-500/5 px-4 py-2">
                <div className="text-[10px] text-green-500/40 tracking-widest mb-1">SYSTEM_RANK</div>
                <div className={`font-bold tracking-widest ${rank.color}`}>{rank.label}</div>
              </div>
              <div className="border border-green-500/20 bg-green-500/5 px-4 py-2">
                <div className="text-[10px] text-green-500/40 tracking-widest mb-1">TOTAL_NODES_CAPTURED</div>
                <div className="text-green-300 font-bold tracking-widest text-lg">{userInfo.totalScore} PTS</div>
              </div>
              <div className="border border-green-500/20 bg-green-500/5 px-4 py-2">
                <div className="text-[10px] text-green-500/40 tracking-widest mb-1">ACCESS_LEVEL</div>
                <div className="text-cyan-400 font-bold tracking-widest text-lg">L{userInfo.unlockedRounds?.length || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Institution */}
          <div className="border border-green-500/20 bg-black/60 p-5 rounded relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
            <div className="text-[10px] text-green-500/40 tracking-widest mb-2">HOME_STATION</div>
            <div className="text-green-200 text-lg font-bold">{userInfo.college || "INDEPENDENT_OPERATOR"}</div>
          </div>

          {/* Security Status */}
          <div className={`border p-5 rounded relative overflow-hidden group transition-all duration-300 ${userInfo.isDisqualified ? 'border-red-500/40 bg-red-500/5' : 'border-green-500/20 bg-black/60'}`}>
            <div className="text-[10px] text-green-500/40 tracking-widest mb-2">PROCTOR_STATUS</div>
            <div className={`text-lg font-bold ${userInfo.isDisqualified ? 'text-red-500' : 'text-green-300'}`}>
              {userInfo.isDisqualified ? "TERMINATED" : "IN_GOOD_STANDING"}
            </div>
            <div className="text-[10px] opacity-40 mt-1">TRUST_INDEX: {userInfo.isDisqualified ? "0.00" : "0.98"}</div>
          </div>

          {/* Time Active */}
          <div className="border border-green-500/20 bg-black/60 p-5 rounded relative overflow-hidden group">
            <div className="text-[10px] text-green-500/40 tracking-widest mb-2">TIME_SINCE_INITIALIZATION</div>
            <div className="text-green-200 text-lg font-bold">
              {new Date(userInfo.createdAt).toLocaleDateString()}
            </div>
            <div className="text-[10px] opacity-40 mt-1">UTC_REF: {new Date(userInfo.createdAt).getTime()}</div>
          </div>
        </div>

        {/* RECENT SUBMISSIONS */}
        <div className="border border-green-500/20 bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden">
          <div className="border-b border-green-500/20 px-6 py-4 flex justify-between items-center bg-green-500/5">
            <h2 className="text-green-300 font-bold tracking-[0.2em]">{">"} RECENT_TRANSMISSIONS</h2>
            <div className="text-[10px] text-green-500/40">{submissions.length} ENTRIES_FOUND</div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-green-500/5 text-[10px] text-green-500/50 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-3 font-normal">Round</th>
                  <th className="px-6 py-3 font-normal">Problem</th>
                  <th className="px-6 py-3 font-normal">Result</th>
                  <th className="px-6 py-3 font-normal">Score</th>
                  <th className="px-6 py-3 font-normal">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-500/10">
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-green-500/30 font-mono italic">
                      NO_DATA_TRANSMISSIONS_RECORDED
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub, idx) => (
                    <tr key={sub._id} className="hover:bg-green-500/5 transition-colors duration-200">
                      <td className="px-6 py-4 font-bold text-green-400">R{sub.round}</td>
                      <td className="px-6 py-4 text-green-200">
                        {sub.problemId?.title || `PROBLEM_${sub.problemId?.slice(-4) || '???'}`}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 text-[10px] font-bold tracking-tighter ${sub.isCorrect ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'}`}>
                          {sub.isCorrect ? "ACCEPTED" : "FAILED"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-cyan-400 font-mono">+{sub.scoreAwarded}</td>
                      <td className="px-6 py-4 text-green-500/40 text-[10px]">
                        {new Date(sub.submittedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER ACCENT */}
        <div className="mt-12 flex justify-between items-center text-[10px] text-green-500/30">
          <div>LOGGED_AS: {userInfo._id}</div>
          <div className="flex gap-4">
            <span>ENCRYPTION: AES-256</span>
            <span>OS: MINDCOMPILE_CORE_v1.0</span>
          </div>
        </div>
      </div>

      {/* Decorative Glitch Bar */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-green-900/20">
        <div className="h-full bg-green-500 w-1/3 animate-pulse shadow-[0_0_10px_rgba(0,255,0,0.5)]" 
          style={{ animation: "scanLine 3s ease-in-out infinite" }} />
      </div>

      <style>{`
        @keyframes scanLine {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(200%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default Profile;
