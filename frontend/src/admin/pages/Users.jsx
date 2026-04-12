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
    <div className="min-h-screen bg-black text-green-400 p-6 font-mono">
      <h1 className="text-2xl mb-4">Users</h1>

      {users.map((u) => (
        <div key={u._id} className="border p-4 mb-3 rounded">
          {editUserId === u._id ? (
            <>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-black border p-1 mr-2"
              />

              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-black border p-1 mr-2"
              />

              <input
                value={form.college}
                onChange={(e) => setForm({ ...form, college: e.target.value })}
                className="bg-black border p-1 mr-2"
              />

              <label className="mr-2">
                Admin:
                <input
                  type="checkbox"
                  checked={form.isAdmin}
                  onChange={(e) =>
                    setForm({ ...form, isAdmin: e.target.checked })
                  }
                />
              </label>

              <button onClick={handleSave} className="bg-green-500 px-2">
                Save
              </button>
            </>
          ) : (
            <>
              <p>Name: {u.name}</p>
              <p>Email: {u.email}</p>
              <p>College: {u.college}</p>
              <p>Role: {u.isAdmin ? "Admin" : "User"}</p>

              <div className="flex gap-2 mt-2">
                <button onClick={() => handleEdit(u)} className="border px-2">
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(u._id)}
                  className="bg-red-500 px-2"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Users;
