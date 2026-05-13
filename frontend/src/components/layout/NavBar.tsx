import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";
import NewProjectModal from "../NewProjectModal.js";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  console.log(`showModal: ${showModal}`);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <>
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="text-xl font-bold text-gray-900">
          CompleteScript
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-gray-900 text-white text-sm px-4 py-2 rounded hover:bg-gray-700"
          >
            New Project
          </button>
          <Link to="/profile" className="text-sm text-gray-600 hover:underline">
            {user?.username}
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </nav>

      {showModal && <NewProjectModal onClose={() => setShowModal(false)} />}
    </>
  );
}