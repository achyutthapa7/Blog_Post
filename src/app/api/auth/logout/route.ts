import { NextResponse, NextRequest } from "next/server";

export const GET = async () => {
  try {
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
    response.cookies.set({
      name: "authToken",
      value: "",
    });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
