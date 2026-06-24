import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Photo_Schema from "../../../../Schema/Photo_Schema";
import cloudinary from "../../../../lib/cloudinary";

export async function GET() {
  try {
    await dbConnect();
    const photos = await Photo_Schema.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: photos });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    
    const { name, imageUrl } = body;

    if (!name || !imageUrl) {
      return NextResponse.json({ success: false, message: "Name and Image URL are required" }, { status: 400 });
    }

    const newPhoto = await Photo_Schema.create({
      name,
      imageUrl,
    });

    return NextResponse.json({ success: true, data: newPhoto });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json();
    
    const { id, name, imageUrl } = body;

    if (!id) return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });

    let updateData = { name };

    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    const updatedPhoto = await Photo_Schema.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedPhoto) return NextResponse.json({ success: false, message: "Photo not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: updatedPhoto });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });

    const deletedPhoto = await Photo_Schema.findByIdAndDelete(id);
    if (!deletedPhoto) return NextResponse.json({ success: false, message: "Photo not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Photo deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}