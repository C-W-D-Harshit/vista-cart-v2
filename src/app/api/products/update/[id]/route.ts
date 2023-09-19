import connectMongoDB from "@/libs/mongo/dbConnect";
import SessionChecker from "@/libs/session/SessionChecker";
import Product from "@/models/product";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

  // create necessary fields
  let product: any = {};
  const { id } = params;

  try {
    let body = await req.json();
    if (body.images) {
      let images = [];

      images = body.images;
      const imagesLinks = [];
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "vista-cart-v2/products",
        });
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
      body.images = imagesLinks;
    }
    product = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    product.save();
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }

  if (!product) {
    return NextResponse.json({
      success: false,
      message: "Product not found",
    });
  }
  return NextResponse.json({
    success: true,
    product,
  });
}
