import { v2 as cloudinary } from "cloudinary";
import {CLOUDINARY_URL} from "@/config/config"

// Configure Cloudinary only when env vars are present.
const configured = Boolean(CLOUDINARY_URL);

if (configured) {
  cloudinary.config({
    secure: true,
  });
}

export const cloudinaryEnabled = configured;

/**
 * Upload a file buffer to Cloudinary.
 * Returns { url, publicId } or null if Cloudinary is not configured.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
): Promise<{ url: string; publicId: string } | null> {
  if (!configured) return null;

  // Determine resource type from mime
  let resourceType: "raw" | "image" | "video" | "auto" = "auto";
  if (mimeType.startsWith("image/")) resourceType = "image";
  else if (mimeType.startsWith("video/")) resourceType = "video";
  else resourceType = "raw";

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder: "documate",
        public_id: fileName.replace(/\.[^/.]+$/, ""), // strip extension
        type: "upload",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          resolve(null);
          return;
        }
        if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        } else {
          resolve(null);
        }
      },
    );

    uploadStream.end(buffer);
  });
}
