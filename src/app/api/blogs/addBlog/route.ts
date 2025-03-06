import { blogModel } from "@/app/db/models/blog.model";
import { userModel } from "@/app/db/models/user.model";
import { conn } from "@/app/utils/conn";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  await conn();
  try {
    const { title, content } = await req.json();
    const rootUser = await userModel.findById(req.headers.get("userId"));
    if (!rootUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const newBlog = new blogModel({
      userId: rootUser._id,
      title,
      content,
    });
    await newBlog.save();
    rootUser.blogs.push(newBlog._id);
    await rootUser.save();
    return NextResponse.json(
      {
        message: "Blog created successfully",
        post: newBlog,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
