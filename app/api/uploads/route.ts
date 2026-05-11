import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import {PDFParse} from "pdf-parse";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  try {
    const data = await req.formData();

    const file = data.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // unique filename
    const fileName = `${uuid()}-${file.name}`;

    // upload path
    const uploadDir = path.join(process.cwd(), "uploads");

    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);

    // save file
    await fs.writeFile(filePath, buffer);

    // parse pdf
    const pdfData = await pdfParse(buffer);

    return NextResponse.json({
      success: true,
      fileName,
      text: pdfData.text.slice(0, 1000),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}