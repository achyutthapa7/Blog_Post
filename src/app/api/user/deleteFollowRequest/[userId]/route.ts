import { conn } from "@/app/utils/conn";
import { userModel } from "@/app/db/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) => {
  await conn();
  try {
    const rootUserId = req.headers.get("userId");
    if (!rootUserId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await params;

    const [rootUser, user] = await Promise.all([
      userModel.findById(rootUserId),
      userModel.findById(userId),
    ]);

    if (!rootUser || !user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (
      rootUser.followers.includes(user._id) &&
      user.followers.includes(rootUser._id)
    ) {
      return NextResponse.json(
        { message: "Already connected" },
        { status: 200 }
      );
    }

    const requestExists =
      rootUser.sentFollowRequest.includes(user._id) &&
      user.receivedFollowRequest.includes(rootUser._id);

    if (!requestExists) {
      return NextResponse.json(
        { message: "No follow request found" },
        { status: 400 }
      );
    }

    rootUser.sentFollowRequest.pull(user._id);
    user.receivedFollowRequest.pull(rootUser._id);

    await Promise.all([rootUser.save(), user.save()]);

    return NextResponse.json(
      { message: "Follow request deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting follow request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
