import { userModel } from "@/app/db/models/user.model";
import { conn } from "@/app/utils/conn";
import { sendMail } from "@/app/utils/sendMail";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ emailAddress: string }> }
) => {
  await conn();
  try {
    const { emailAddress } = await params;
    const user = await userModel.findOne({ email: emailAddress });
    const otp = Math.floor(Math.random() * 100000 + 899999);
    await sendMail(emailAddress, "email resend", otp).catch(console.error);
    user.verificationCode = otp;
    user.verificationCodeExpiry = Date.now() + 1000 * 60 * 5;
    await user.save();
    return NextResponse.json(
      {
        message: "OTP sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
