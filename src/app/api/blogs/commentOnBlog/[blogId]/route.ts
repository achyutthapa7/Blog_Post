import { blogModel } from "@/app/db/models/blog.model";
import { commentModel } from "@/app/db/models/comment.model";
import { conn } from "@/app/utils/conn";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) => {
  await conn();
  try {
    const { blogId } = await params;
    const { commentText } = await req.json();
    const blog = await blogModel.findById(blogId);
    const newComment = new commentModel({
      userId: req.headers.get("userId"),
      commentText,
      postedBlogId: blogId,
    });
    await newComment.save();
    blog.comments.push(newComment._id);
    await blog.save();

    return NextResponse.json(
      {
        message: "commented  successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
