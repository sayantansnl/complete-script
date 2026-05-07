import { useMutation } from "@tanstack/react-query";
import apiClient from "../services/apiClient.js";

interface ExportPDFParams {
  projectId: string;
  projectTitle: string;
}

async function exportPDF({ projectId, projectTitle }: ExportPDFParams): Promise<void> {
  const response = await apiClient.get(`api/projects/${projectId}/export-pdf`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${projectTitle}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export function useExportPDF() {
  return useMutation({
    mutationFn: exportPDF,
  });
}