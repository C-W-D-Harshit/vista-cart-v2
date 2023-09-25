import { NextRequest, NextResponse } from "next/server";
import SessionChecker from "@/libs/session/SessionChecker";
import { checkRateLimit } from "@/utils/ratelimit";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { addressSchema } from "@/zod/schema";
import Order from "@/models/order";

export async function POST(req: NextRequest) {
  // rate limit
  try {
    await checkRateLimit();
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Too many requests",
    });
  }
  // first check for session
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({
      success: false,
      message: "You are not authorized to perform this action!",
    });
  }

  try {
    const body = await req.json();
    const response = addressSchema.parse(body.address);

    // now create order
    const order = await Order.create(body);

    // execute the order
    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
