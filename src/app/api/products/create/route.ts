import connectMongoDB from "@/libs/mongo/dbConnect";
import SessionChecker from "@/libs/session/SessionChecker";
import Product from "@/models/product";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";

export async function POST(req: NextRequest) {
  // check for admin
  const isAdminAuthorized = await SessionChecker({ role: "admin" });

  if (isAdminAuthorized !== true) {
    return isAdminAuthorized;
  }

  // connect cloudinary
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // connect DB
  await connectMongoDB();

  // create product
  let product = {};
  try {
    // create body
    let body = await req.json();

    // create img
    const { images } = body;
    if (!images)
      return NextResponse.json({
        success: false,
        message: "images are required",
      });

    const imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "trend-hub/products",
      });
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    body.images = imagesLinks;

    product = await Product.create(body);
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
  return NextResponse.json({
    success: true,
    msd: "sd",
    product,
  });
}
