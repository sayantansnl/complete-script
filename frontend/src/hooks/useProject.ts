import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/apiClient.js";

export interface TitlePageData {
  title?: string;
  author?: string;
  basedOn?: string;
  contact?: string;
  draft?: string;
}

export interface FontPreference {
  family: string;
  size: number;
  lineSpacing: number;
}

export interface Project {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  title: string;
  fountainText: string | null;
  outlineText: string | null;
  titlePageData: TitlePageData | null;
  pageSize: string | null;
  fontPreference: FontPreference | null;
}

async function fetchProject(projectId: string): Promise<Project> {
  const { data } = await apiClient.get(`api/projects/${projectId}`);
  return data;
}

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId),
    enabled: !!projectId,
  });
}