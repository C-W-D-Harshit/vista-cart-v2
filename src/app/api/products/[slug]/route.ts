import connectMongoDB from "@/libs/mongo/dbConnect";
import Product from "@/models/product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  // first get slug
  const slug = params.slug;

  // connect DB
  await connectMongoDB();

  // find product in DB
  const product = await Product.find({
    slug,
    status: "published",
  });

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
