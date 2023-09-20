import connectMongoDB from "@/libs/mongo/dbConnect";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { resend } from "../register/route";
import { NewArrivalEmailTemplate } from "@/components/templates/email/New-Arrival";
import { checkRateLimit, checkRateLimitForResend } from "@/utils/ratelimit";

function generateOTP() {
  const otpLength = 6;
  const min = Math.pow(10, otpLength - 1);
  const max = Math.pow(10, otpLength) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function POST(req: NextRequest) {
  // rate limit
  try {
    await checkRateLimitForResend();
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }

  // create verifyKey
  const verifyKey = generateOTP();
  const verifyKeyExpires = Date.now() + 10 * 60 * 1000;

  try {
    const { email } = await req.json();
    if (!email)
      return NextResponse.json({
        success: false,
        message: "Fill all fields!",
      });
    // connect db
    await connectMongoDB();

    // check if user exists
    const user = await User.findOne({ email });

    // save it in DB
    user.verifyKey = verifyKey;
    user.verifyKeyExpires = verifyKeyExpires;
    await user.save();

    const firstName = user.name.split(" ")[0];
    const otp = user.verifyKey as number;

    const data = await resend.emails.send({
      from: "Vista Cart <vista-cart@cleverdevloper.in>",
      to: [user.email],
      subject: "Welcome to Vista Cart!",
      react: NewArrivalEmailTemplate({ firstName, otp }),
    });
    return NextResponse.json({
      success: true,
      message: "OTP sent successfully!",
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
