import connectMongoDB from "@/libs/mongo/dbConnect";
import User from "@/models/user";
import { checkRateLimit } from "@/utils/ratelimit";
import { NextRequest, NextResponse } from "next/server";

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

  try {
    const { email, otp } = await req.json();
    if (!email || !otp)
      return NextResponse.json({
        success: false,
        message: "Fill all fields!",
      });
    // connect db
    await connectMongoDB();
    const user = await User.findOne({
      email,
      verifyKey: otp,
      verifyKeyExpires: {
        $gt: Date.now(),
      },
    });

    if (user) {
      user.verified = true;
      await user.save();
      return NextResponse.json({
        success: true,
        message: "User verified successfully!",
      });
    } else {
      throw new Error("OTP did'nt match! or is expired!");
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
