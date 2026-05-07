import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";

type EditorNavbarProps = {
  projectTitle: string;
  activeView: "screenplay" | "outline";
  onExportPDF: () => void;
  isExporting: boolean;
};

export default function EditorNavBar({ 
  projectTitle, 
  activeView, 
  onExportPDF, 
  isExporting 
}: EditorNavbarProps) {
  const { id } = useParams();
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="text-gray-500 hover:text-gray-900 text-sm">
          ← Dashboard
        </Link>
        <span className="text-gray-900 font-semibold">{projectTitle}</span>
      </div>

      <div className="flex items-center gap-1 bg-gray-100 rounded p-1">
        <Link 
          to={`/projects/${id}`}
          className={`px-3 py-1 rounded text-sm font-medium ${
            activeView === "screenplay" 
              ? "bg-white shadow text-gray-900"
              : "text-gray-500 hover:text-gray-900" 
          }`}
        >
          Screenplay
        </Link>
        <Link 
          to={`/projects/${id}/outline`}
          className={`px-3 py-1 rounded text-sm font-medium ${
            activeView === "outline" 
              ? "bg-white shadow text-gray-900"
              : "text-gray-500 hover:text-gray-900" 
          }`}
        >
          Outline
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onExportPDF}
          disabled={isExporting}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {isExporting ? "Exporting..." : "Export"}
        </button>
        <button 
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}