import EditorNavBar from "./EditorNavBar.js";
import type { ReactNode } from "react";

type EditorLayoutProps = {
  children: ReactNode;
  projectTitle: string;
  activeView: "screenplay" | "outline";
  onExportPDF: () => void;
  isExporting: boolean;
};

export default function EditorLayout({
  children,
  projectTitle,
  activeView,
  onExportPDF,
  isExporting,
}: EditorLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <EditorNavBar
        projectTitle={projectTitle}
        activeView={activeView}
        onExportPDF={onExportPDF}
        isExporting={isExporting}
      />
      <main>{children}</main>
    </div>
  );
}