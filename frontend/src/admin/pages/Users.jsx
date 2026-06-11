// @ts-nocheck
import { useEffect, useState, useContext } from "react";
import { RoundContext } from "../../context/ContextProvider";
import { getUsers, updateUser, deleteUser } from "../services/adminApi";
import { motion, AnimatePresence } from "framer-motion";

const Users = () => {
  const { api } = useContext(RoundContext);

  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers(api);
      setUsers(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditUserId(user._id);
    setForm(user);
  };

  const handleSave = async () => {
    await updateUser(api, editUserId, form);
    setEditUserId(null);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (window.confirm("ARE_YOU_SURE_YOU_WANT_TO_TERMINATE_THIS_ENTITY?")) {
      await deleteUser(api, id);
      fetchUsers();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        <p className="text-cyan-500 font-mono tracking-widest text-xs animate-pulse uppercase">Syncing_Identity_Database...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-slate-300 font-mono p-4 sm:p-10 overflow-hidden">
      {/* ===== BACKGROUND FX ===== */}
      <div className="absolute top-0 left-0 w-full h-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, #06b6d4 3px)",
        }}
      />

      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 border-b border-white/5 pb-10 relative z-10">
        <div className="space-y-2 flex-1">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-mono font-black tracking-widest text-cyan-500 glitch break-words" data-text="> cat /etc/passwd">
            {"> cat /etc/passwd"}<span className="blink text-cyan-500">█</span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <p className="text-cyan-500/60 text-xs font-black uppercase tracking-[0.4em]">// AUTHORIZED_IDENTITY_NETWORK</p>
          </div>
        </div>
        
        <div className="text-right">
          <span className="text-xs font-mono text-slate-500 tracking-widest uppercase">ACTIVE_ENTITIES</span>
          <p className="text-2xl font-black text-white tabular-nums">{users.length.toString().padStart(3, '0')}</p>
        </div>
      </div>

      {/* ===== USER GRID ===== */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.map((u, idx) => (
          <div
            key={u._id}
            className="group relative p-8 bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all duration-500"
            style={{ clipPath: "polygon(0 15%, 15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%)" }}
          >
            {/* Index Marker */}
            <div className="absolute top-4 right-8 text-6xl font-black text-white/[0.02] group-hover:text-cyan-500/[0.05] transition-colors pointer-events-none">
              {(idx + 1).toString().padStart(2, '0')}
            </div>

            <div className="flex flex-col h-full relative z-10">
              {editUserId !== u._id ? (
                <>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-slate-900 border-2 border-cyan-500/20 flex items-center justify-center text-2xl font-black text-white"
                         style={{ clipPath: "polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)" }}>
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white tracking-widest uppercase group-hover:text-cyan-400 transition-colors">{u.name}</h2>
                      <p className="text-xs font-mono text-cyan-500/60 tracking-widest uppercase">{u.isAdmin ? "LEVEL_ADMIN_AUTH" : "LEVEL_USER_AUTH"}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-10">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-600 tracking-widest uppercase">COMM_CHANNEL</span>
                      <p className="text-sm font-black text-slate-400 truncate uppercase">{u.email}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-600 tracking-widest uppercase">ORIGIN_STATION</span>
                      <p className="text-sm font-black text-slate-400 truncate uppercase">{u.college || "INDEPENDENT_NODE"}</p>
                    </div>
                  </div>

                  <div className="mt-auto flex gap-4">
                    <button
                      onClick={() => handleEdit(u)}
                      className="flex-1 py-3 bg-white/[0.03] border border-white/5 text-slate-400 hover:text-white hover:border-white/20 transition-all font-black text-xs tracking-widest uppercase"
                    >
                      MODIFY_IDENTITY_
                    </button>
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="px-6 py-3 border border-blue-500/10 text-blue-500/40 hover:text-blue-500 hover:bg-blue-500/5 transition-all font-black text-xs tracking-widest uppercase"
                    >
                      PURGE_
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-cyan-500 tracking-[0.3em] mb-4 uppercase underline underline-offset-4">IDENTITY_RECALIBRATION</h3>
                  
                  {[['name', 'IDENTIFIER'], ['email', 'COMM_LINK'], ['college', 'STATION']].map(([key, label]) => (
                    <div key={key} className="space-y-2">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{label}</label>
                      <input
                        value={form[key] || ""}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 p-4 text-sm text-white focus:border-cyan-500/50 focus:outline-none transition-all font-mono"
                      />
                    </div>
                  ))}

                  <label className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-cyan-500"
                      checked={form.isAdmin || false}
                      onChange={(e) => setForm({ ...form, isAdmin: e.target.checked })}
                    />
                    <span className="text-xs font-black text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest">GRANT_ADMIN_CLEARANCE</span>
                  </label>

                  <div className="flex gap-4 pt-4">
                    <button onClick={handleSave} className="flex-1 py-4 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 font-black text-xs tracking-[0.3em] hover:bg-cyan-500/40 transition-all uppercase">
                      ./COMMIT_SAVE
                    </button>
                    <button onClick={() => setEditUserId(null)} className="px-6 py-4 border border-white/10 text-slate-500 font-black text-xs tracking-[0.3em] hover:bg-white/5 transition-all uppercase">
                      ./ABORT
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ===== SYSTEM LOGS ===== */}
      <div className="mt-16 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500 tracking-[0.3em] border-t border-white/5 pt-8 relative z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            <span>REGISTRY_STATUS: ENCRYPTED</span>
          </div>
          <span>LAST_SYNC: {new Date().toLocaleTimeString()}</span>
        </div>
        <div className="text-cyan-500/60 uppercase">Identity_Propagation_Stable</div>
      </div>
    </div>
  );
};

export default Users;
