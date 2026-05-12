import { useQuery } from "@tanstack/react-query";
import { type Project } from "./useProject.js";
import apiClient from "../services/apiClient.js";

async function fetchProjects(): Promise<Project[]> {
  const { data } = await apiClient.get("/api/projects");
  return data;
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects
  });
}