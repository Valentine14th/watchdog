import { NextRequest, NextResponse } from "next/server";
import ApkReader from "@devicefarmer/adbkit-apkreader";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Read the file as an array buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Compute SHA-256 hash
    const hashBuffer = await crypto.subtle.digest("SHA-256", fileBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    // Parse APK manifest using adbkit-apkreader
    const reader = await ApkReader.open(fileBuffer);
    const manifest = await reader.readManifest();

    return NextResponse.json({ manifest: manifest, sha256: hashHex });
  } catch (error) {
    console.error("Error processing APK file:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
