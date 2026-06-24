import { NextResponse } from 'next/server';
import cloudinary from '../../../../lib/cloudinary';

export async function POST(req) {
  try {
    const { folder } = await req.json();
    if (!folder) return NextResponse.json({ error: "Folder is required" }, { status: 400 });

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({
      timestamp,
      signature,
      cloudName: process.env.CLOUDINARY_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
