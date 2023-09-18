import connectMongoDB from "@/libs/mongo/dbConnect";
import SessionChecker from "@/libs/session/SessionChecker";
import Product from "@/models/product";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // check for admin
  const isAdminAuthorized = await SessionChecker({ role: "admin" });

  if (isAdminAuthorized !== true) {
    return isAdminAuthorized;
  }

  // connect DB
  await connectMongoDB();

  // create necessary fields
  let product: any = {};
  const { id } = params;

  try {
    const body = await req.json();
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
