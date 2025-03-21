import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export const middleware = async (req: NextRequest) => {
  try {
    const cookie = await cookies();
    const path = req.nextUrl.pathname;
    if (
      path === "/api/auth/login" ||
      path === "/api/auth/registration" ||
      path === "/api/auth/verification"
    ) {
      return NextResponse.next();
    }

    const token = cookie.get("authToken")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized access token" },
        { status: 401 }
      );
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const { payload } = await jwtVerify(token, secret);
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("userId", payload.userId as string);
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const config = {
  matcher: [
    "/api/auth/:path*",
    "/api/user/:path*",
    "/api/blogs/:path*",
    "/api/cron/:path*",
  ],
};
