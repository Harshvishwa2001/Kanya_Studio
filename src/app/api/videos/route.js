import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import cloudinary from "../../../../lib/cloudinary";
import Video_schema from "../../../../Schema/Video_schema";

export async function GET() {
  try {
    await dbConnect();
    const videos = await Video_schema.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: videos });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { title, videoUrl } = body;

    if (!title || !videoUrl) {
      return NextResponse.json({ success: false, message: "Title and Video URL are required" }, { status: 400 });
    }

    const newVideo = await Video_schema.create({
      title,
      videoUrl,
    });

    return NextResponse.json({ success: true, data: newVideo });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await Video_schema.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Video deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}