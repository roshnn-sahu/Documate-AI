import apiClient from "./client";

export async function signOut(): Promise<void> {
  await apiClient.post("/auth/signout");
}
