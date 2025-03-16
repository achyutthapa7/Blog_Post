import { blogModel } from "@/app/db/models/blog.model";
import { commentModel } from "@/app/db/models/comment.model";
import { userModel } from "@/app/db/models/user.model";
import { conn } from "@/app/utils/conn";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  await conn();
  const cookie = await cookies();
  const token = cookie.get("authToken")?.value;
  try {
    if (!token) {
      return NextResponse.json({ message: "not authenticated" });
    }
    const userId = req.headers.get("userId");
    const rootUser = await userModel
      .findById(userId)
      .select(
        "-password -verificationCode -verificationCodeExpiry -createdAt  -updatedAt -authToken -authTokenExpiry"
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
    if (!rootUser) {
      return NextResponse.json(
        { message: "rootUser not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ isAuthenticated: true, rootUser });
  } catch (error) {
    return NextResponse.json({ isAuthenticated: false });
  }
};
