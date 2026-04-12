// src/admin/components/AdminNavbar.jsx

import { Link, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/"); // go to home
  };
  return (
    <div className="bg-black border-b border-red-500 p-4 flex gap-6 text-red-400 font-mono">
      <Link to="/admin">Dashboard</Link>
      <Link to="/admin/leaderboard">Leaderboard</Link>
      <Link to="/admin/submissions">Submissions</Link>
      <Link to="/admin/users">Users</Link> {/* ✅ NEW */}
      <button onClick={handleLogout}>Exit Admin</button>
    </div>
  );
};

export default AdminNavbar;
