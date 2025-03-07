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
    if (
      !rootUser.followers.includes(user._id) &&
      !user.followers.includes(rootUser._id)
    ) {
      return NextResponse.json(
        {
          message:
            "Not connected, you cannot remove someone who is not connected to you",
        },
        { status: 403 }
      );
    }
    rootUser.followers.pull(user._id);
    user.followers.pull(rootUser._id);
    await rootUser.save();
    await user.save();
    return NextResponse.json(
      { message: "follower removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting user:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
