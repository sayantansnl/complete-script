import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateProject } from "../hooks/useCreateProject.js";

interface Props {
  onClose: () => void;
}

export default function NewProjectModal({ onClose }: Props) {
  const [title, setTitle] = useState("");
  const { mutate: createProject, isPending, isError } = useCreateProject();
  const navigate = useNavigate();

  function handleSubmit(e: ChangeEvent) {
    e.preventDefault();
    createProject(
      { title },
      {
        onSuccess: (project) => {
          navigate(`/projects/${project.id}`);
        },
      }
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">New Project</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="title" className="text-sm text-gray-700">
              Project Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          {isError && (
            <p className="text-red-500 text-sm">Failed to create project. Please try again.</p>
          )}
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-gray-600 hover:underline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="bg-gray-900 text-white text-sm px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
            >
              {isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}