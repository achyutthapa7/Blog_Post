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
    const rootUser = await userModel.findById(req.headers.get("userId"));
    const { blogId } = await params;
    const { commentText } = await req.json();

    const blog = await blogModel.findById(blogId);
    const receiver = await userModel.findOne({ _id: blog.userId });
    const newComment = new commentModel({
      userId: req.headers.get("userId"),
      commentText,
      postedBlogId: blogId,
    });
    await newComment.save();
    blog?.comments?.push(newComment._id);
    await blog.save();

    if (rootUser._id.toString() != blog.userId.toString()) {
      const newNotification = new notificationModel({
        senderId: req.headers.get("userId"),
        receiverId: blog.userId,
        message: `${
          rootUser.firstName + " " + rootUser.lastName
        } commented on your blog`,
      });
      await newNotification.save();
      receiver.notifications.push(newNotification);
      await receiver.save();
    }

    const populatedComment = await newComment.populate({
      path: "userId",
      select: "firstName lastName",
    });

    return NextResponse.json(
      {
        blogId,
        newComment: populatedComment,
        message: "commented  successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
