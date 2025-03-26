import { blogModel } from "@/app/db/models/blog.model";
import { notificationModel } from "@/app/db/models/notification.model";
import { userModel } from "@/app/db/models/user.model";
import { conn } from "@/app/utils/conn";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  await conn();
  try {
    const userId = req.headers.get("userId");
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const rootUser = await userModel.findById(userId).populate({
      path: "notifications",
      model: notificationModel,
      options: { sort: { createdAt: -1 } },
      populate: [
        {
          path: "senderId",
          model: userModel,
          select: "firstName lastName",
        },
        {
          path: "receiverId",
          model: userModel,
          select: "firstName lastName",
        },
        {
          path: "blogId",
          model: blogModel,
          select: "title",
        },
      ],
    });

    if (!rootUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(rootUser.notifications, { status: 200 });
  } catch (error) {
    console.error("Error getting notifications:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
