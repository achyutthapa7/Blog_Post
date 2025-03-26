import { blogModel } from "@/app/db/models/blog.model";
import { notificationModel } from "@/app/db/models/notification.model";
import { userModel } from "@/app/db/models/user.model";
import { conn } from "@/app/utils/conn";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest) => {
  await conn();
  try {
    const userId = req.headers.get("userId");
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const rootUser = await userModel.findById(userId);
    if (!rootUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const result = await notificationModel.updateMany(
      { receiverId: rootUser._id, read: false },
      { $set: { read: true } }
    );
    const notifications = await notificationModel
      .find({
        receiverId: rootUser._id,
        read: true,
      })
      .populate({
        path: "blogId",
        model: blogModel,
        select: "title",
      });
    if (result.modifiedCount > 0) {
      return NextResponse.json(
        { message: "Notifications marked as read successfully", notifications },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "No unread notifications found" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      { message: "Failed to update notifications" },
      { status: 500 }
    );
  }
};
