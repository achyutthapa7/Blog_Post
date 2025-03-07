import { userModel } from "@/app/db/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { conn } from "@/app/utils/conn";

export const POST = async (
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
    if (rootUserId === userId) {
      return NextResponse.json(
        { message: "Cannot follow yourself" },
        { status: 403 }
      );
    }
    const rootUser = await userModel.findById(rootUserId);
    if (!rootUser) {
      return NextResponse.json(
        { message: "root user not found" },
        { status: 404 }
      );
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }
    if (
      rootUser.sentFollowRequest.includes(user._id) &&
      user.receivedFollowRequest.includes(rootUser._id)
    ) {
      return NextResponse.json(
        { message: "Follow request already sent" },
        { status: 409 }
      );
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
    rootUser.sentFollowRequest.push(user._id);
    user.receivedFollowRequest.push(rootUser._id);

    await rootUser.save();
    await user.save();
    return NextResponse.json(
      {
        message: "Follow request sent successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error fetching user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
