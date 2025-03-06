import { blogModel } from "@/app/db/models/blog.model";
import { conn } from "@/app/utils/conn";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  req: NextRequest,
  { params: { blogId } }: { params: { blogId: string } }
) => {
  await conn();
  try {
    const blog = await blogModel.findById(blogId);
    if (blog.likes.includes(req.headers.get("userId"))) {
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
        likes: req.headers.get("userId"),
      },
    });
    return NextResponse.json(
      {
        message: "Liked successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
