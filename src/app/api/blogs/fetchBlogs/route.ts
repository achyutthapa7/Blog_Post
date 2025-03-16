import { blogModel, IBlog } from "@/app/db/models/blog.model";
import { commentModel } from "@/app/db/models/comment.model";
import { userModel } from "@/app/db/models/user.model";
import { conn } from "@/app/utils/conn";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  await conn();
  try {
    // userId: { $ne: req.headers.get("userId") },
    const blogs = await blogModel
      .find<IBlog>({})
      .populate({
        path: "userId",
        model: userModel,
        select: "firstName lastName",
      })
      .populate({
        path: "comments",
        model: commentModel,
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "userId",
          model: userModel,
          select: "firstName lastName",
        },
      })
      .sort({ createdAt: -1 })
      .exec();
    if (blogs.length === 0) {
      return NextResponse.json({ message: "No blogs found" }, { status: 404 });
    }
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error);
  }
};
