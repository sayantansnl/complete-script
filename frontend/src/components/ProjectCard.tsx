import { useNavigate } from "react-router-dom";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useDeleteProject } from "../hooks/useDeleteProject";
import { type Project } from "../hooks/useProject";

interface Props {
  project: Project
};

export default function ProjectCard({ project }: Props) {
  const navigate = useNavigate();
  const { mutate: deleteProject, isPending } = useDeleteProject();

  function handleDelete(e: ReactMouseEvent) {
    e.stopPropagation();
    deleteProject(project.id);
  }

  return (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      className= "bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow flex flex-col gap-2"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-gray-900 font-medium">{project.title}</h3>
        <button
          onClick={(e) => handleDelete(e)}
          disabled={isPending}
          className="text-sm text-red-500 hover:underline disabled:opacity-50"
        >
          {isPending ? "Deleting..." : "Delete"}
        </button>
      </div>
      <div className="text-xs text-gray-400 flex flex-col gap-1">
        <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
        <span>Last Saved: {new Date(project.updatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}