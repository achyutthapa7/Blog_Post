import { NextRequest, NextResponse } from "next/server";
import { conn } from "../../utils/conn";
import { userModel } from "../../db/models/user.model";
export const GET = async (req: NextRequest) => {
  await conn();
  try {
    await userModel.deleteMany({
      isVerified: false,
    });
    return NextResponse.json(
      {
        message: "All unverified users deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
