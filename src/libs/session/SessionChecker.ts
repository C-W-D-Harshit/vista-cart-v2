import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

async function SessionChecker({ role }: { role: string }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== role)
    return NextResponse.json({
      success: false,
      message: "You are not authorized to perform this action!",
    });

  return true;
}

export default SessionChecker;
