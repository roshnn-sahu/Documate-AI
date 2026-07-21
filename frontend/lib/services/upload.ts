import apiClient from "./client";

/** Upload a file to be processed and ingested. */
export async function uploadFile(
  formData: FormData,
): Promise<{ success: boolean; document?: unknown; sessionId?: string }> {
  // NOTE: Do NOT set Content-Type manually — axios will set the correct
  // multipart boundary when it detects FormData.
  const { data } = await apiClient.post("/api/uploads", formData);
  return data;
}
