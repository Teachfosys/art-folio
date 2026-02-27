import { adminAuth } from "@/lib/firebase-admin";
import dbConnect from "@/lib/mongodb";
import Storage from "@/models/Storage";
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

export async function GET(req) {
  try {
    const decodedToken = await verifyAuth(req);
    if (!decodedToken) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();

    let storage = await Storage.findOne({ type: "global" });
    if (!storage) {
       storage = await Storage.create({ type: "global", totalBytesUsed: 0 });
    }

    const stats = {
      usedBytes: storage.totalBytesUsed,
      maxBytes: storage.maxBytesLimit,
      usedPercentage: ((storage.totalBytesUsed / storage.maxBytesLimit) * 100).toFixed(2)
    };

    return NextResponse.json({ stats }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
