import { useMutation } from "@tanstack/react-query";
import apiClient from "../services/apiClient.js";

interface SaveProjectParams {
  projectId: string;
  fountainText?: string;
  outlineText?: string;
  titlePageTitle?: string;
  titlePageAuthor?: string;
  titlePageBasedOn?: string;
  titlePageContact?: string;
  titlePageDraft?: string;
  pageSize?: string;
  fontPreferenceFamily?: string;
  fontPreferenceSize?: number;
  fontPreferenceLineSpacing?: number;
}

async function saveProject({ projectId, ...rest }: SaveProjectParams): Promise<void> {
  await apiClient.put(`/api/projects/${projectId}`, rest);
}

export function useSaveProject() {
  return useMutation({
    mutationFn: saveProject,
  });
}