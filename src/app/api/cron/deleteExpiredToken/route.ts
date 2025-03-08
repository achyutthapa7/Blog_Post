import { userModel } from "@/app/db/models/user.model";
import { conn } from "@/app/utils/conn";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
export const DELETE = async (req: NextRequest) => {
  await conn();
  try {
    const cookie = await cookies();
    const userId = req.headers.get("userId");
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const rootUser = await userModel.findById(userId);
    if (Date.now() > rootUser.authTokenExpiry) {
      rootUser.authToken = null;
      rootUser.authTokenExpiry = null;
      cookie.delete("authToken");
      await rootUser.save();
    } else {
      return NextResponse.json(
        { message: "Session is not expired yet" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "token set to null successfully" },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      JSON.stringify({ message: "Internal Server Error" }),
      {
        status: 500,
      }
    );
  }
};
