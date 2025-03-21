import { conn } from "@/app/utils/conn";
import { IUser, userModel } from "@/app/db/models/user.model";
import { sendMail } from "@/app/utils/sendMail";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
export const POST = async (req: NextRequest) => {
  await conn();
  try {
    const cookie = await cookies();
    const body: IUser = await req.json();
    const { firstName, lastName, email, password } = body;
    const otp = Math.floor(Math.random() * 100000 + 899999);
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        {
          message: "missing required field",
        },
        { status: 400 }
      );
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return NextResponse.json(
        {
          message: "email already exists",
        },
        { status: 409 }
      );
    const newUser = new userModel({
      firstName,
      lastName,
      email,
      password,
      verificationCode: otp,
      verificationCodeExpiry: Date.now() + 1000 * 60 * 5,
    });
    await newUser.save();
    if (newUser.authToken === null) {
      newUser.authTokenExpiry = null;
      await newUser.save();
    }
    // cookie.set("emailAddress", newUser.email, {
    //   httpOnly: true,
    //   maxAge: 60 * 60 * 24,
    // });
    sendMail(newUser.email, "mail sent", otp).catch(console.error);
    return NextResponse.json(
      {
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error while registration:" + error);
  }
};
