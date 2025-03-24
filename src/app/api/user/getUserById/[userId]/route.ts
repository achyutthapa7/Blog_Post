import { blogModel } from "@/app/db/models/blog.model";
import { commentModel } from "@/app/db/models/comment.model";
import { userModel } from "@/app/db/models/user.model";
import { conn } from "@/app/utils/conn";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) => {
  await conn();
  try {
    const { userId } = await params;
    const user = await userModel
      .findById(userId)
      .select(
        "-password -verificationCode -verificationCodeExpiry -createdAt  -updatedAt -followers -sentFollowRequest -receivedFollowRequest -authToken -authTokenExpiry"
      )
      .populate({
        path: "blogs",
        model: blogModel,
        populate: [
          {
            path: "comments",
            model: commentModel,
            populate: { path: "userId", select: "firstName lastName" },
          },
          { path: "likes", select: "firstName lastName" },
        ],
      });
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error while getting user by id:", error);
  }
};
