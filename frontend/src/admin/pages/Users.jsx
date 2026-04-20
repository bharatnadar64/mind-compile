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
    <div className="relative min-h-screen bg-black text-green-400 font-mono p-6 overflow-hidden">
      {/* glow */}
      <div className="absolute inset-0 bg-green-500/5 blur-2xl opacity-20 pointer-events-none" />

      {/* scanlines */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.12) 3px)",
        }}
      />

      {/* HEADER */}
      <div className="relative z-10 mb-6">
        <h1 className="text-3xl font-bold tracking-widest text-green-300 drop-shadow-[0_0_10px_#00ff00]">
          {"> USER REGISTRY DATABASE"}
        </h1>
        <p className="text-green-500/60 text-sm">
          system identity & access control panel
        </p>
      </div>

      {/* USERS LIST */}
      <div className="relative z-10 space-y-4">
        {users.map((u) => (
          <div
            key={u._id}
            className="border border-green-500/30 bg-black/70 p-4 rounded"
          >
            {editUserId === u._id ? (
              <>
                {/* EDIT MODE */}
                <div className="space-y-2">
                  <input
                    value={form.name || ""}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="bg-black border border-green-500/40 p-2 w-full"
                    placeholder="> name"
                  />

                  <input
                    value={form.email || ""}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="bg-black border border-green-500/40 p-2 w-full"
                    placeholder="> email"
                  />

                  <input
                    value={form.college || ""}
                    onChange={(e) =>
                      setForm({ ...form, college: e.target.value })
                    }
                    className="bg-black border border-green-500/40 p-2 w-full"
                    placeholder="> college"
                  />

                  <label className="flex items-center gap-2 text-green-400/80">
                    <input
                      type="checkbox"
                      checked={form.isAdmin || false}
                      onChange={(e) =>
                        setForm({ ...form, isAdmin: e.target.checked })
                      }
                    />
                    admin.access
                  </label>

                  <div className="flex gap-3 mt-2 text-sm">
                    <button
                      onClick={handleSave}
                      className="px-3 py-1 border border-green-400 hover:bg-green-400 hover:text-black"
                    >
                      save
                    </button>

                    <button
                      onClick={() => setEditUserId(null)}
                      className="px-3 py-1 border border-green-500/40"
                    >
                      cancel
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* VIEW MODE */}
                <div className="space-y-1">
                  <p className="text-green-300">
                    {"> user:"} {u.name}
                  </p>

                  <p className="text-green-500/70 text-sm">
                    {"> email:"} {u.email}
                  </p>

                  <p className="text-green-500/60 text-sm">
                    {"> college:"} {u.college}
                  </p>

                  <p
                    className={
                      u.isAdmin
                        ? "text-yellow-400 text-sm"
                        : "text-green-500/60 text-sm"
                    }
                  >
                    {"> role:"} {u.isAdmin ? "admin" : "user"}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3 mt-3 text-sm">
                  <button
                    onClick={() => handleEdit(u)}
                    className="px-3 py-1 border border-green-400 hover:bg-green-400 hover:text-black"
                  >
                    edit
                  </button>

                  <button
                    onClick={() => handleDelete(u._id)}
                    className="px-3 py-1 border border-red-500 text-red-400 hover:bg-red-500 hover:text-black"
                  >
                    delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="relative z-10 mt-8 text-xs text-green-500/60 border-t border-green-500/10 pt-3">
        {"> registry.status: ACTIVE"}
      </div>
    </div>
  );
};

export default Users;
