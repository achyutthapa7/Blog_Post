import { userModel } from "@/app/db/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
export const GET = async (request: NextRequest) => {
  try {
    const cookie = await cookies();
    const userId = request.headers.get("userId");
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const rootUser = await userModel.findById(userId);
    cookie.delete("authToken");
    rootUser.authToken = null;
    rootUser.authTokenExpiry = null;
    await rootUser.save();
    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
