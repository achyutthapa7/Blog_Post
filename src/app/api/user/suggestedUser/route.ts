import { userModel } from "@/app/db/models/user.model";
import { conn } from "@/app/utils/conn";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  await conn();
  try {
    const userId = req.headers.get("userId");
    const rootUser = await userModel.findById(userId);
    const suggestedUsers = await userModel
      .find({
        _id: { $ne: rootUser._id },
      })
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
      })
      .select(
        "-password -verificationCode -verificationCodeExpiry -createdAt  -updatedAt -authToken -authTokenExpiry"
      )
      .limit(5);
    return NextResponse.json(suggestedUsers);
  } catch (error) {
    console.error("Error getting user:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
