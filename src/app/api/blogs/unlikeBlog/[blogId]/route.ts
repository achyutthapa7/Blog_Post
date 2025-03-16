import { blogModel } from "@/app/db/models/blog.model";
import { conn } from "@/app/utils/conn";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) => {
  await conn();
  try {
    const { blogId } = await params;
    const userId = req.headers.get("userId");
    const blog = await blogModel.findOne({
      _id: blogId,
      likes: { $in: [userId] },
    });
    if (!blog)
      return NextResponse.json(
        { message: "you haven't like this blog" },
        { status: 400 }
      );
    if (blog.likes.includes(req.headers.get("userId"))) {
      await blogModel.findByIdAndUpdate(blogId, {
        $pull: {
          likes: userId,
        },
      });
    }
    return NextResponse.json(
      { userId, blogId, message: "unliked successfully" },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
