import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import connectMongoDB from "@/libs/mongo/dbConnect";

export async function POST(req: NextRequest) {
  // getting the reset token
  const { resetToken, password, confirmPassword } = await req.json();

  // if not getting the token, return an error
  if (!resetToken) {
    return NextResponse.json({
      success: false,
      message: "No reset token provided",
    });
  }

  // checking if the token is valid
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // connect to DB
  await connectMongoDB();

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  // if the token is not valid, return an error
  if (!user || user.provider !== "credentials")
    return NextResponse.json({
      success: false,
      message: "Token is invalid or has expired",
    });

  // handle the error
  if (!password || !confirmPassword)
    return NextResponse.json({
      success: false,
      message: "Fill all the fields!",
    });

  if (password !== confirmPassword)
    return NextResponse.json({
      success: false,
      message: "Passwords do not match!",
    });

  // if everything is fine, reset the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // setting the fileds
  user.password = hashedPassword;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save();

  // return success message
  return NextResponse.json({
    success: true,
    message: "Password reset successfully",
  });
}
