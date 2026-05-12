import Layout from "../components/layout/Layout.js";
import ProjectCard from "../components/ProjectCard.js";
import { useProjects } from "../hooks/useProjects.js";

export default function DashboardPage() {
  const { data: projects, isLoading, isError } = useProjects();
  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Projects</h1>
      {isLoading && <p className="text-sm text-gray-400">Loading projects...</p>}
      {isError && <p className="text-sm text-red-400">Failed to load projects.</p>}
      {projects && projects.length === 0 && (
        <p className="text-sm text-gray-400">No projects yet. Create one to get started.</p>
      )}
      {projects && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </Layout>
  );
}