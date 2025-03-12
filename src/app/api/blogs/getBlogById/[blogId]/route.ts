import { blogModel } from "@/app/db/models/blog.model";
import { conn } from "@/app/utils/conn";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) => {
  await conn();
  try {
    const { blogId } = await params;
    if (!blogId) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }
    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    return NextResponse.json("Error fetching data", { status: 500 });
  }
};
