import { blogModel, IBlog } from "@/app/db/models/blog.model";
import { commentModel } from "@/app/db/models/comment.model";
import { userModel } from "@/app/db/models/user.model";
import redis from "@/app/lib/redis";
import { conn } from "@/app/utils/conn";
import { NextRequest, NextResponse } from "next/server";
export const GET = async (req: NextRequest) => {
  await conn();
  try {
    const searchParams = req.nextUrl.searchParams;
    const page: number = Number(searchParams?.get("page")) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    const totalBlogs = await blogModel.countDocuments();

    // const cachedBlogs = await redis.get("blogs");
    // if (cachedBlogs) {
    //   console.log("🚀 Serving from Redis cache");
    //   return NextResponse.json(JSON.parse(cachedBlogs), { status: 200 });
    // }
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
      .skip(skip)
      .limit(limit)
      .exec();
    if (blogs.length === 0) {
      return NextResponse.json({ message: "No blogs found" }, { status: 404 });
    }
    // await redis.setex(
    //   "blogs",
    //   3600,
    //   JSON.stringify({ blogs, totalBlogs, limit })
    // );

    return NextResponse.json({ blogs, totalBlogs, limit }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error);
  }
};
