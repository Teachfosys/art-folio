import { adminAuth } from "@/lib/firebase-admin";
import dbConnect from "@/lib/mongodb";
import Content from "@/models/Content";
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

export async function GET(req, { params }) {
  try {
    const { section } = await params;
    await dbConnect();
    
    let content = await Content.findOne({ section });
    if (!content) {
       // Return empty default if not found
       return NextResponse.json({ section, data: {} }, { status: 200 });
    }
    
    return NextResponse.json(content, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const decodedToken = await verifyAuth(req);
    if (!decodedToken) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { section } = await params;
    const { data } = await req.json();

    await dbConnect();
    
    const content = await Content.findOneAndUpdate(
      { section },
      { data },
      { upsert: true, new: true }
    );
    
    return NextResponse.json(content, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
