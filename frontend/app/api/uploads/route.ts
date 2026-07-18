import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { processFile } from "@/lib/uploads/process-file";

// Vision/OCR + embedding on the free tier can take a while.
export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.formData();
    const file = data.get("file") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Create a session for this upload
    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .insert({ user_id: user.id, title: file.name })
      .select("id")
      .single();

    if (sessionError || !session) {
      throw new Error(sessionError?.message || "Failed to create session");
    }

    // Create a placeholder document row first so chunks get document_id in metadata
    const { data: doc, error: docError } = await supabase
      .from("documents")
      .insert({
        user_id: user.id,
        session_id: session.id,
        file_name: file.name,
        mime_type: file.type,
        size_bytes: file.size,
        chunk_count: 0,
      })
      .select("id")
      .single();

    if (docError || !doc) {
      throw new Error(docError?.message || "Failed to create document row");
    }

    // Process file (validates, saves, extracts text, ingests into vector store)
    const result = await processFile(file, {
      userId: user.id,
      sessionId: session.id,
      documentId: doc.id,
    });

    // Update document with processing results
    const { error: updateError } = await supabase
      .from("documents")
      .update({
        cloudinary_url: result.cloudinaryUrl,
        cloudinary_public_id: result.cloudinaryPublicId,
        extracted_text: result.text,
        chunk_count: result.chunks.length,
      })
      .eq("id", doc.id);

    if (updateError) {
      console.error("Failed to update document:", updateError);
    }

    if (docError) {
      console.error("Failed to insert document:", docError);
    }

    return NextResponse.json({
      success: true,
      id: doc?.id || session.id,
      sessionId: session.id,
      name: file.name,
      cloudinary_url: result.cloudinaryUrl,
      chunk_count: result.chunks.length,
    });
  } catch (error: any) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 },
    );
  }
}