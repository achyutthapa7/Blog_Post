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
    let populatedNotification = null;
    if (rootUser._id.toString() !== blog.userId.toString()) {
      const newNotification = new notificationModel({
        senderId: userId,
        receiverId: blog.userId,
        message: `${
          rootUser.firstName + " " + rootUser.lastName
        } liked your blog`,
      });
      await newNotification.save();
      const receiver = await userModel.findOne({ _id: blog.userId });
      if (receiver) {
        receiver.notifications.push(newNotification._id);
        await receiver.save();
      }
      populatedNotification = await notificationModel
        .findById(newNotification._id)
        .populate("senderId", "firstName lastName")
        .populate("receiverId", "firstName lastName")
        .populate({
          path: "blogId",
          model: blogModel,
          select: "title",
        });
    }

    return NextResponse.json(
      {
        userId,
        blogId,
        newNotification: populatedNotification,
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
