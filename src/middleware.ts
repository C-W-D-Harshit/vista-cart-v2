import { getServerSession } from "next-auth";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import Error from "next/error";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "./app/api/auth/[...nextauth]/options";
import { getSession } from "next-auth/react";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      req.nextauth.token?.role !== "admin"
    ) {
      return new NextResponse("You are not authorized!");
    }
  },
  {
    callbacks: {
      authorized: (params) => {
        let { token } = params;
        return !!token;
      },
    },
  }
);

// export const config = {
//   matcher: ["/admin/:anything*"],
// };

export const config = {
  matcher: [
    "/admin/:anything*",
    // "/((?!api|auth|_next/static|_next/image|favicon.ico).*)",
    // "/((?!api|auth|_next/static|_next/image|favicon.ico).*)|/admin/(.+)",
  ],
};

// export async function middleware(req: NextRequest) {
//   let cookie = req.cookies.get("next-auth.session-token");
//   if (req.nextUrl.pathname.startsWith("/auth") && cookie) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }
// }
