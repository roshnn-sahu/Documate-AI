// Vision-based text extraction for image uploads.
// Uses an OpenRouter vision model to OCR + describe an image so it can be
// ingested into the RAG pipeline like any other document.
import {OPENROUTER_API_KEY} from "@/config/config";

const VISION_MODEL = "nvidia/nemotron-nano-12b-v2-vl:free";

export async function describeImage(
  buffer: Buffer,
  mimeType: string,
  fileName: string,
) {
  const apiKey = OPENROUTER_API_KEY;
 
  const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;

  // Free-tier vision models can be slow / rate-limited; fail with a clear
  // message instead of hanging the request indefinitely.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  let response: Response;
  try {
    response = await fetch("https://openrouter.ai/api/v1/embeddings", {
      signal: controller.signal,
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: VISION_MODEL,
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Transcribe ALL visible text in this image verbatim, then describe the image in detail (objects, layout, charts, tables, diagrams). Be thorough — this text will be used to answer questions about the image.",
              },
              {
                type: "image_url",
                image_url: { url: dataUrl },
              },
            ],
          },
        ],
      }),
    });
  } catch (err: any) {
    if (err?.name === "AbortError") {
      throw new Error(
        "Image processing timed out. The free vision model is busy — please try again in a moment.",
      );
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Vision model request failed (${response.status}). ${detail.slice(0, 200)}`,
    );
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content || typeof content !== "string" || !content.trim()) {
    throw new Error("Vision model returned no text for this image");
  }

  return `Image file: ${fileName}\n\n${content.trim()}`;
}
