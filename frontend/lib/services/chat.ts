import apiClient from "./client";

export interface Session {
  id: string;
  title: string;
  updated_at?: string;
}

/** Fetch all sessions for the current user. */
export async function listSessions(): Promise<Session[]> {
  const { data } = await apiClient.get<{ sessions: Session[] }>(
    "/api/chat/sessions",
  );
  return data.sessions || [];
}

/** Create a new chat session (optionally with a file). */
export async function createSession(formData: FormData): Promise<{
  sessionId: string;
  message: string;
  document?: unknown;
}> {
  // NOTE: Do NOT set Content-Type manually — axios will set the correct
  // multipart boundary when it detects FormData.
  const { data } = await apiClient.post("/api/chat/create", formData);
  return data;
}

/** Rename a session. */
export async function renameSession(
  sessionId: string,
  title: string,
): Promise<void> {
  await apiClient.patch(`/api/chat/sessions/${sessionId}`, { title });
}

/** Delete a session. */
export async function deleteSession(sessionId: string): Promise<void> {
  await apiClient.delete(`/api/chat/sessions/${sessionId}`);
}

/**
 * Send a message to a session and get back a ReadableStream response.
 * Uses native fetch because axios doesn't support streaming responses in the browser.
 */
export async function sendMessage(
  sessionId: string,
  message: string,
  files?: File[],
): Promise<Response> {
  if (files && files.length > 0) {
    const formData = new FormData();
    formData.append("message", message);
    files.forEach((file) => formData.append("files", file));
    return fetch(`/api/chat/${sessionId}`, { method: "POST", body: formData });
  }

  return fetch(`/api/chat/${sessionId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
}
