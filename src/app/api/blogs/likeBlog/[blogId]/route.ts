import { blogModel } from "@/app/db/models/blog.model";
import { conn } from "@/app/utils/conn";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) => {
  await conn();
  try {
    const userId = req.headers.get("userId");
    const { blogId } = await params;

    const blog = await blogModel.findById(blogId);
    if (blog.likes.includes(userId)) {
      return NextResponse.json(
        {
          message: "Already liked",
        },
        {
          status: 403,
        }
      );
    }
    await blogModel.findByIdAndUpdate(blogId, {
      $push: {
        likes: userId,
      },
    });
    return NextResponse.json(
      { userId, blogId, message: "Liked successfully" },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
