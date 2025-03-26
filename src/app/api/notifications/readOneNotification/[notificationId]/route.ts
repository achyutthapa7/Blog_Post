import { notificationModel } from "@/app/db/models/notification.model";
import { userModel } from "@/app/db/models/user.model";
import { conn } from "@/app/utils/conn";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ notificationId: string }> }
) => {
  await conn();
  try {
    const { notificationId } = await params;
    await notificationModel.findByIdAndUpdate(notificationId, {
      $set: {
        read: true,
      },
      new: true,
    });
    return NextResponse.json(
      { message: "Notification updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update notification" },
      { status: 500 }
    );
  }
};
