import { adminAuth } from "@/lib/firebase-admin";
import dbConnect from "@/lib/mongodb";
import { uploadToR2 } from "@/lib/r2";
import Storage from "@/models/Storage";
import crypto from "crypto";
import { NextResponse } from "next/server";

async function verifyAuth(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.split("Bearer ")[1];
  try {
    return await adminAuth.verifyIdToken(token);
  } catch (err) {
    return null;
  }
}

export async function POST(req) {
  try {
    const decodedToken = await verifyAuth(req);
    if (!decodedToken) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileSize = buffer.length;

    await dbConnect();
    
    let storage = await Storage.findOne({ type: "global" });
    if (!storage) {
       storage = await Storage.create({ type: "global", totalBytesUsed: 0 });
    }

    // 2GB LIMIT CHECK
    if (storage.totalBytesUsed + fileSize > storage.maxBytesLimit) {
      return NextResponse.json(
        { message: `Upload failed: 2GB storage limit exceeded. Need ${fileSize} bytes, but only ${storage.maxBytesLimit - storage.totalBytesUsed} bytes remaining.` },
        { status: 403 }
      );
    }

    // Generate unique filename
    const ext = file.name.split('.').pop();
    const uniqueFileName = `${crypto.randomUUID()}.${ext}`;

    // Upload to Cloudflare R2
    const url = await uploadToR2(buffer, uniqueFileName, file.type);

    // Update Storage Logic
    storage.totalBytesUsed += fileSize;
    await storage.save();

    return NextResponse.json({ url, message: "File uploaded successfully" }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "Server error during upload" }, { status: 500 });
  }
}
