import { useMutation } from "@tanstack/react-query";
import apiClient from "../services/apiClient.js";

interface UpdateProfileParams {
  username?: string;
  email?: string;
  password?: string;
}

async function updateProfile(params: UpdateProfileParams): Promise<void> {
  await apiClient.put("/api/users", params);
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: updateProfile
  });
}