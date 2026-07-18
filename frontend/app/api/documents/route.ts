import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: docs, error } = await supabase
      .from("documents")
      .select("id, file_name, mime_type, size_bytes, cloudinary_url, chunk_count, is_favourite, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    // Map DB columns to the shape the frontend expects
    const documents = (docs || []).map((doc) => ({
      id: doc.id,
      name: doc.file_name,
      size: doc.size_bytes || 0,
      type: doc.mime_type || "application/octet-stream",
      ext: (doc.file_name.split(".").pop()?.toUpperCase() || "FILE"),
      uploadedAt: doc.created_at,
      modifiedAt: doc.created_at,
      cloudinaryUrl: doc.cloudinary_url,
      isFavourite: doc.is_favourite,
    }));

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Failed to list documents:", error);
    return NextResponse.json(
      { error: "Failed to list documents" },
      { status: 500 },
    );
  }
}
