import { userModel } from "@/app/db/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { conn } from "../../../utils/conn";
import { cookies } from "next/headers";
export const POST = async (req: NextRequest) => {
  await conn();
  try {
    const cookie = await cookies();
    const body = await req.json();
    const { verificationCode } = body;
    const emailAddress = req.nextUrl.searchParams.get("emailAddress");
    // const emailAddress = cookie.get("emailAddress")?.value;
    if (!emailAddress) {
      return NextResponse.json(
        {
          message: "Email address not found",
        },
        { status: 404 }
      );
    }
    const registeredUser = await userModel.findOne({
      email: emailAddress,
    });
    const optExpiryTime = registeredUser.verificationCodeExpiry;
    const otp = registeredUser.verificationCode;
    if (Date.now() > optExpiryTime) {
      return NextResponse.json(
        { message: "Verification code expired" },
        { status: 400 }
      );
    }
    if (verificationCode !== otp) {
      return NextResponse.json(
        { message: "Invalid verification code" },
        { status: 409 }
      );
    }
    if (verificationCode === otp) {
      registeredUser.isVerified = true;
      await registeredUser.save();
      // req.cookies.set({
      //   name: "emailAddress",
      //   value: "",
      // });
    }
    return NextResponse.json(
      { message: "Verification successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while verifying email:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
