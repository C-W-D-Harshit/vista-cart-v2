import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import connectMongoDB from "@/libs/mongo/dbConnect";
import Order from "@/models/order";

export async function DELETE(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  // first check for session
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({
      success: false,
      message: "You are not authorized to perform this action!",
    });
  }

  // first connect DB
  await connectMongoDB();

  try {
    const order = await Order.findByIdAndRemove(id);

    if (!order) {
      return NextResponse.json({
        success: false,
        message: "Order not found",
      });
    }

    await Order.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
