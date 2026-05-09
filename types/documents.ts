export interface DocumentItem {
  id: string;
  name: string;
  status: "uploading" | "processing" | "ready";
  createdAt: string;
}
