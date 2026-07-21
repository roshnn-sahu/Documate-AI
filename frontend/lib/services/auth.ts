import apiClient from "./client";

export async function signOut(): Promise<void> {
  await apiClient.post("/auth/signout");
}

export async function refreshAccessToken(): Promise<string> {
  const response = await apiClient.post("/auth/refresh-token");
  return response.data.accessToken;
}
