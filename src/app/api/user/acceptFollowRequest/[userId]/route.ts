import { NextRequest, NextResponse } from "next/server";
import { conn } from "@/app/utils/conn";
import { userModel } from "@/app/db/models/user.model";

export const POST = async (
  req: NextRequest,
  { params }: { params: { userId: string } }
) => {
  await conn();
  try {
    const rootUserId = req.headers.get("userId");
    const { userId } = await params;
    if (!rootUserId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const [rootUser, user] = await Promise.all([
      userModel.findById(rootUserId),
      userModel.findById(userId),
    ]);
    if (!rootUser || !user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (rootUserId === userId) {
      return NextResponse.json({ message: "you cannot accept yourself " });
    }
    if (
      rootUser.followers.includes(user._id) &&
      user.followers.includes(rootUser._id)
    ) {
      return NextResponse.json(
        { message: "Already connected" },
        { status: 409 }
      );
    }
    if (rootUser.sentFollowRequest.includes(user._id)) {
      return NextResponse.json({
        message:
          "you sent the follow request, that's why you cannot accepet yourself",
      });
    }
    if (rootUser.receivedFollowRequest.includes(user._id)) {
      rootUser.followers.push(user._id);
      user.followers.push(rootUser._id);
      rootUser.receivedFollowRequest.pull(user._id);
      user.sentFollowRequest.pull(rootUser._id);
      await rootUser.save();
      await user.save();
      return NextResponse.json(
        { message: "Follow request accepted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "No follow request found" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("Error sending email:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
