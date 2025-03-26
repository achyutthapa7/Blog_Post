import { blogModel } from "@/app/db/models/blog.model";
import { commentModel } from "@/app/db/models/comment.model";
import { notificationModel } from "@/app/db/models/notification.model";
import { userModel } from "@/app/db/models/user.model";
import { conn } from "@/app/utils/conn";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) => {
  await conn();

  try {
    const userId = req.headers.get("userId");
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const rootUser = await userModel.findById(userId);
    if (!rootUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { blogId } = await params;
    const { commentText } = await req.json();

    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    const newComment = await commentModel.create({
      userId,
      commentText,
      postedBlogId: blogId,
    });

    blog.comments.push(newComment._id);
    await blog.save();

    let populatedNotification = null;
    if (rootUser._id.toString() !== blog.userId.toString()) {
      const newNotification = await notificationModel.create({
        senderId: userId,
        receiverId: blog.userId,
        blogId: blogId,
        message: `${rootUser.firstName} ${rootUser.lastName} commented on your blog`,
      });

      const receiver = await userModel.findById(blog.userId);
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

    const populatedComment = await newComment.populate(
      "userId",
      "firstName lastName"
    );

    return NextResponse.json(
      {
        blogId,
        newComment: populatedComment,
        newNotification: populatedNotification,
        message: "Comment added successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
