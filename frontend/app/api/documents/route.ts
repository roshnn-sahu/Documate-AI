import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const files = await fs.readdir(uploadDir);

    const documents = await Promise.all(
      files
        .filter((file) => file !== ".gitkeep")
        .map(async (file) => {
          const filePath = path.join(uploadDir, file);
          const stat = await fs.stat(filePath);

          // Extract original name from UUID-prefixed filename
          const originalName = file.replace(/^[a-f0-9-]+-/, "");

          const typeMap: Record<string, string> = {
            pdf: "application/pdf",
            docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            csv: "text/csv",
            txt: "text/plain",
          };

          const ext = file.split(".").pop()?.toLowerCase() || "";
          const mimeType = typeMap[ext] || "application/octet-stream";

          return {
            id: file,
            name: originalName,
            size: stat.size,
            type: mimeType,
            ext: ext.toUpperCase(),
            uploadedAt: stat.birthtime.toISOString(),
            modifiedAt: stat.mtime.toISOString(),
          };
        }),
    );

    // Sort by upload date descending
    documents.sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    );

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Failed to list documents:", error);
    return NextResponse.json(
      { error: "Failed to list documents" },
      { status: 500 },
    );
  }
}
