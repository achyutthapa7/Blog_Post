import { blogModel } from "@/app/db/models/blog.model";
import { userModel } from "@/app/db/models/user.model";
import { conn } from "@/app/utils/conn";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) => {
  await conn();
  try {
    const { blogId } = await params;
    const rootUser = await userModel.findById(req.headers.get("userId"));
    if (!rootUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    await blogModel.findByIdAndDelete(blogId);
    rootUser.blogs.pull(blogId);
    await rootUser.save();
    return NextResponse.json(
      {
        message: "blog is deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
