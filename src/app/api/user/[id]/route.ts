import SessionChecker from "@/libs/session/SessionChecker";
import User from "@/models/user";
import { checkRateLimit } from "@/utils/ratelimit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  // check for admin
  const isAdminAuthorized = await SessionChecker({ role: "admin" });

  if (isAdminAuthorized !== true) {
    return isAdminAuthorized;
  }

  try {
    const user = await User.findById(id).select(
      "-createdAt -updatedAt -passwordChangedAt -verifyKey -verifyKeyExpires -password"
    );
    if (!user)
      return NextResponse.json({ success: false, message: "User not found" });
    return NextResponse.json({ success: true, user });
  } catch (error) {}
}

export async function PATCH(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  // check for admin
  const isAdminAuthorized = await SessionChecker({ role: "admin" });

  if (isAdminAuthorized !== true) {
    return isAdminAuthorized;
  }
  try {
    const { role, status } = await req.json();
    const user = await User.findById(id);

    if (!user)
      return NextResponse.json({ success: false, message: "User not found" });

    user.role = role;
    user.status = status;

    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error });
  }
}
