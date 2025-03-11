import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  const cookie = await cookies();
  const token = cookie.get("authToken")?.value;
  try {
    if (!token) {
      return NextResponse.json({ message: "hello" });
    }
    return NextResponse.json({ isAuthenticated: true });
  } catch (error) {
    return NextResponse.json({ isAuthenticated: false });
  }
};
