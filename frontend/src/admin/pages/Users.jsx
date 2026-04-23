// @ts-nocheck
import { useEffect, useState, useContext } from "react";
import { RoundContext } from "../../context/ContextProvider";
import { getUsers, updateUser, deleteUser } from "../services/adminApi";

const Users = () => {
  const { api } = useContext(RoundContext);

  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await getUsers(api);
    setUsers(res || []);
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
    await deleteUser(api, id);
    fetchUsers();
  };

  return (
    <div className="relative min-h-screen bg-black text-green-300 font-mono p-4 sm:p-6 overflow-hidden">
      {/* ===== BACKGROUND ENGINE ===== */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 via-black to-black opacity-80 pointer-events-none" />

      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.10) 3px)",
        }}
      />

      {/* moving ambient glow (subtle “system breathing”) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,0,0.12),transparent_50%)] animate-pulse pointer-events-none" />

      {/* ===== HEADER ===== */}
      <div className="relative z-10 mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-[0.2em] text-green-200">
          USER REGISTRY
        </h1>

        <div className="mt-2 flex items-center gap-3 text-xs sm:text-sm text-green-500/60">
          <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
          secure identity network active
        </div>
      </div>

      {/* ===== USER GRID ===== */}
      <div className="relative z-10 grid gap-4 sm:gap-5">
        {users.map((u, idx) => (
          <div
            key={u._id}
            className="
            relative group
            border border-green-500/20
            bg-black/60
            backdrop-blur-sm
            p-4 sm:p-5
            pl-14 sm:pl-16
            rounded-xl
            transition-all duration-300
            hover:border-green-400/50
            hover:shadow-[0_0_25px_rgba(0,255,0,0.12)]
            hover:-translate-y-0.5
          "
          >
            {/* subtle index glow */}
            <div className="absolute -left-1 top-3 text-green-500/20 text-5xl font-bold">
              {String(idx + 1).padStart(2, "0")}
            </div>

            {/* ===== VIEW MODE ===== */}
            {editUserId !== u._id && (
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                {/* identity block */}
                <div className="space-y-1">
                  <p className="text-green-100 text-lg font-semibold tracking-wide group-hover:text-green-200 transition">
                    {u.name}
                  </p>

                  <p className="text-green-500/70 text-sm">{u.email}</p>

                  <p className="text-green-500/50 text-sm">{u.college}</p>

                  <div className="mt-2 inline-flex items-center gap-2">
                    <span
                      className={`
                      px-2 py-0.5 text-xs rounded
                      border
                      ${
                        u.isAdmin
                          ? "border-yellow-400/40 text-yellow-300 bg-yellow-500/10"
                          : "border-green-500/20 text-green-400/70"
                      }
                    `}
                    >
                      {u.isAdmin ? "ADMIN" : "USER"}
                    </span>
                  </div>
                </div>

                {/* actions */}
                <div className="flex sm:flex-col gap-3 sm:items-end text-sm">
                  <button
                    onClick={() => handleEdit(u)}
                    className="
                    px-3 py-1.5 rounded-md
                    border border-green-400/30
                    bg-green-500/5
                    hover:bg-green-400/10
                    hover:border-green-300/60
                    transition
                    active:scale-95
                  "
                  >
                    modify
                  </button>

                  <button
                    onClick={() => handleDelete(u._id)}
                    className="
                    px-3 py-1.5 rounded-md
                    border border-red-500/30
                    text-red-400
                    bg-red-500/5
                    hover:bg-red-500/10
                    hover:border-red-400/60
                    transition
                    active:scale-95
                  "
                  >
                    remove
                  </button>
                </div>
              </div>
            )}

            {/* ===== EDIT MODE ===== */}
            {editUserId === u._id && (
              <div className="space-y-3">
                <div className="text-green-300 text-sm mb-2">
                  editing record: {u.name}
                </div>

                {[
                  ["name", "Name"],
                  ["email", "Email"],
                  ["college", "College"],
                ].map(([key, label]) => (
                  <input
                    key={key}
                    value={form[key] || ""}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    className="
                    w-full
                    bg-black
                    border border-green-500/20
                    p-2.5
                    rounded-md
                    text-green-200
                    focus:outline-none
                    focus:border-green-400/60
                    focus:shadow-[0_0_10px_rgba(0,255,0,0.1)]
                    transition
                  "
                    placeholder={label}
                  />
                ))}

                <label className="flex items-center gap-2 text-green-300 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isAdmin || false}
                    onChange={(e) =>
                      setForm({ ...form, isAdmin: e.target.checked })
                    }
                  />
                  grant admin access
                </label>

                <div className="flex gap-3 pt-2 text-sm">
                  <button
                    onClick={handleSave}
                    className="
                    px-3 py-1.5 rounded-md
                    bg-green-500/10
                    border border-green-400/40
                    hover:bg-green-400/20
                    transition
                  "
                  >
                    save
                  </button>

                  <button
                    onClick={() => setEditUserId(null)}
                    className="
                    px-3 py-1.5 rounded-md
                    text-green-400/70
                    hover:text-green-300
                    transition
                  "
                  >
                    cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ===== FOOTER ===== */}
      <div className="relative z-10 mt-10 text-xs text-green-500/50 border-t border-green-500/10 pt-3 flex justify-between">
        <span>registry.status: ACTIVE</span>
        <span className="text-green-400/70 animate-pulse">
          syncing identities...
        </span>
      </div>
    </div>
  );
};

export default Users;
