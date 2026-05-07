import { useMutation } from "@tanstack/react-query";
import apiClient from "../services/apiClient.js";
import { type Project } from "./useProject.js";

interface CreateProjectParams {
  title: string;
}

async function createProject(params: CreateProjectParams): Promise<Project> {
  const { data } = await apiClient.post("api/projects", { title: params.title });
  return data;
}

export function useCreateProject() {
  return useMutation({
    mutationFn: createProject,
  });
}