import { blogModel } from "@/app/db/models/blog.model";
import { commentModel } from "@/app/db/models/comment.model";
import { conn } from "@/app/utils/conn";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  req: NextRequest,
  {
    params: { commentId, blogId },
  }: { params: { commentId: string; blogId: string } }
) => {
  await conn();
  try {
    const blog = await blogModel.findById(blogId);
    await commentModel.findByIdAndDelete(commentId);
    blog.comments.pull(commentId);
    await blog.save();
    return NextResponse.json(
      {
        message: "comment deleted successfully",
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
