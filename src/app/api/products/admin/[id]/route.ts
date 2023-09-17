import connectMongoDB from "@/libs/mongo/dbConnect";
import SessionChecker from "@/libs/session/SessionChecker";
import Product from "@/models/product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
  const product = await Product.findById(id);

  return NextResponse.json({
    success: true,
    product,
  });
}
