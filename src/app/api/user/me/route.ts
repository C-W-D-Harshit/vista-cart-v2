import User from "@/models/user";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(req: NextRequest, res: any) {
  // first check for session
  const session: any = await getServerSession();

  // if not session then
  if (!session) {
    return NextResponse.json({
      success: false,
      session: null,
    });
  }

  // lets find the user in DB
  // We would be using email because thats what we are getting from session
  let user = null;
  try {
    user = await User.findOne({ email: session.user.email });
    return NextResponse.json({
      success: true,
      session,
      user,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
