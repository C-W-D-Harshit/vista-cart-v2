import connectMongoDB from "@/libs/mongo/dbConnect";
import SessionChecker from "@/libs/session/SessionChecker";
import Product from "@/models/product";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // check for admin
  const isAdminAuthorized = await SessionChecker({ role: "admin" });

  if (isAdminAuthorized !== true) {
    return isAdminAuthorized;
  }

  // connect DB
  await connectMongoDB();

  // create product
  let product = {};
  try {
    // create body
    const body = await req.json();
    product = await Product.create(body);
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
