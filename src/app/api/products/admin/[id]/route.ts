import connectMongoDB from "@/libs/mongo/dbConnect";
import SessionChecker from "@/libs/session/SessionChecker";
import Product from "@/models/product";
import { Error } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import catchAsyncErrors from "@/utils/catchAsyncErrors";
import { checkRateLimit } from "@/utils/ratelimit";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // rate limit
  try {
    await checkRateLimit();
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Too many requests",
    });
  }
  // check for admin
  const isAdminAuthorized = await SessionChecker({ role: "admin" });

  if (isAdminAuthorized !== true) {
    return isAdminAuthorized;
  }

  // get id
  const { id } = params;

  // connect DB
  await connectMongoDB();

  // find product in DB
  let product: any = {};
  try {
    product = await Product.findById(id);
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }

  return NextResponse.json({
    success: true,
    product,
  });
}
