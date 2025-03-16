import { blogModel } from "@/app/db/models/blog.model";
import { commentModel } from "@/app/db/models/comment.model";
import { conn } from "@/app/utils/conn";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { commentId: string; blogId: string } }
) => {
  await conn();
  try {
    const { commentId, blogId } = params;
    const userId = req.headers.get("userId"); // Extract userId from headers

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized request" },
        { status: 401 }
      );
    }

    // Find the comment
    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    // Ensure the comment belongs to the requesting user
    if (comment.userId.toString() !== userId) {
      return NextResponse.json(
        { message: "Forbidden: You cannot delete this comment" },
        { status: 403 }
      );
    }

    // Find the blog and remove the comment
    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    await commentModel.findByIdAndDelete(commentId);
    blog.comments.pull(commentId);
    await blog.save();

    return NextResponse.json(
      {
        message: "Comment deleted successfully",
        commentId,
        blogId,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
