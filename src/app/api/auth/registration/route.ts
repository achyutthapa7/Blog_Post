import { conn } from "@/app/utils/conn";
import { IUser, userModel } from "@/app/db/models/user.model";
import { sendMail } from "@/app/utils/sendMail";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  await conn();
  try {
    const body: IUser = await req.json();
    const { firstName, lastName, email, password } = body;
    const otp = Math.floor(Math.random() * 100000 + 899999);
    if (!firstName || !lastName || !email || !password) {
      return Response.json(
        {
          message: "missing required field",
        },
        { status: 400 }
      );
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return Response.json(
        {
          message: "email already exists",
        },
        { status: 400 }
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
    const response = NextResponse.json(
      {
        message: "User created successfully",
      },
      { status: 201 }
    );
    response.cookies.set({
      name: "emailAddress",
      value: newUser.email,
    });
    console.log(otp);
    await sendMail(newUser.email, "mail sent", otp);
    return response;
  } catch (error) {
    console.log("Error while registration:" + error);
  }
};
