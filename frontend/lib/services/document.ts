import apiClient from "./client";

export interface DocumentItem {
  id: string;
  name: string;
  size: number;
  type: string;
  ext?: string;
  uploadedAt?: string;
  modifiedAt?: string;
}

/** Fetch all documents for the current user. */
export async function listDocuments(): Promise<DocumentItem[]> {
  const { data } = await apiClient.get<{ documents: DocumentItem[] }>(
    "/api/documents",
  );
  return data.documents || [];
}
