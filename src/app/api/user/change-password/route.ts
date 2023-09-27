import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  // check session
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({
      success: false,
      message: "You are not authorized to perform this action!",
    });
  }

  try {
    const { currentPassword, newPassword, confirmPassword } = await req.json();
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({
        success: false,
        message: "Please fill all the fields!",
      });
    }
    if (newPassword !== confirmPassword) {
      return NextResponse.json({
        success: false,
        message: "Passwords do not match!",
      });
    }
    const user = await User.findById(session?.user.id);
    if (!(await user.checkPassword(currentPassword, user.password))) {
      return NextResponse.json({
        success: false,
        message: "Current password is incorrect!",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();
    return NextResponse.json({
      success: true,
      message: "Password changed successfully!",
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
