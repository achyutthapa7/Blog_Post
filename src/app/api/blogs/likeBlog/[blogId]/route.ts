import { blogModel } from "@/app/db/models/blog.model";
import { notificationModel } from "@/app/db/models/notification.model";
import { userModel } from "@/app/db/models/user.model";
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
    const rootUser = await userModel.findById(userId);
    const blog = await blogModel.findById(blogId);
    const receiver = await userModel.findOne({ _id: blog.userId });
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
    if (rootUser._id.toString() !== blog.userId.toString()) {
      const newNotification = new notificationModel({
        senderId: userId,
        receiverId: blog.userId,
        message: `${
          rootUser.firstName + " " + rootUser.lastName
        } liked your blog`,
      });
      await newNotification.save();
      receiver.notifications.push(newNotification);
      await receiver.save();
    }

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
