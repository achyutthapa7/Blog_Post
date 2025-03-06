import { userModel } from "@/app/db/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { conn } from "@/app/utils/conn";
export const GET = async (req: NextRequest, res: NextResponse) => {
  await conn();
  try {
    const userId = req.headers.get("userId");
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = await userModel
      .findById(userId)
      .select(
        "-password -verificationCode -verificationCodeExpiry -createdAt  -updatedAt"
      )
      .populate({
        path: "blogs",
        populate: [
          {
            path: "comments",
            populate: { path: "userId", select: "firstName lastName" },
          },
          { path: "likes", select: "firstName lastName" },
        ],
      })
      .populate({
        path: "followers",
        select: "firstName lastName",
      })
      .populate({
        path: "sentFollowRequest",
        select: "firstName lastName",
      })
      .populate({
        path: "receivedFollowRequest",
        select: "firstName lastName",
      });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(error);
    NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
