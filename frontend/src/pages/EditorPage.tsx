import { useParams } from "react-router-dom";
import { useProject } from "../hooks/useProject.js";
import { useExportPDF } from "../hooks/useExportPDF.js";
import EditorLayout from "../components/layout/EditorLayout.js";

export default function EditorPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project, isLoading, isError } = useProject(projectId ?? "");
  const { mutate: exportPDF, isPending: isExporting } = useExportPDF();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !project) {
    return <div>Failed to load project.</div>;
  }

  return (
    <EditorLayout
      projectTitle={project.title}
      activeView="screenplay"
      onExportPDF={() => exportPDF({ projectId: project.id, projectTitle: project.title })}
      isExporting={isExporting}
    >
      {/* Tiptap screenplay editor goes here */}
      TiptapScreenplayEditor
    </EditorLayout>
  );
}