import { NextRequest, NextResponse } from "next/server";
// @ts-ignore
import ApkReader from "@devicefarmer/adbkit-apkreader";

// Helper function to compute SHA-256 hash
async function computeSha256(buffer: Buffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(req: NextRequest) {
  try {
    const { fileUrl } = await req.json();

    if (!fileUrl) {
      return NextResponse.json({ error: "No file URL provided" }, { status: 400 });
    }

    // Fetch the file from Vercel Blob
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch APK file from Blob storage");
    }

    // Read file into a buffer
    const fileBuffer = Buffer.from(await response.arrayBuffer());

    // Compute SHA-256 hash
    const hashHex = await computeSha256(fileBuffer);

    // Parse APK manifest
    const reader = await ApkReader.open(fileBuffer);
    const manifest = await reader.readManifest();

    return NextResponse.json({ manifest: manifest, sha256: hashHex });
  } catch (error) {
    console.error("Error processing APK file:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
