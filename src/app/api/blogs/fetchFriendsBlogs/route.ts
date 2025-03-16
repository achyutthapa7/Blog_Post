import { blogModel, IBlog } from "@/app/db/models/blog.model";
import { IUser, userModel } from "@/app/db/models/user.model";
import { conn } from "@/app/utils/conn";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  await conn();
  try {
    const userId = req.headers.get("userId");
    const friends = await userModel
      .find<IUser>({ followers: { $in: [userId] } })
      .populate({
        path: "blogs",
        model: blogModel,
      });
    if (friends.length === 0) {
      return NextResponse.json(
        { message: "No friends found" },
        { status: 404 }
      );
    }
    let blogs;
    friends.forEach((friend) => {
      blogs = friend.blogs;
    });
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error);
  }
};
