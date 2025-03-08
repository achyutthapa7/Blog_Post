import { NextRequest, NextResponse } from "next/server";
import { conn } from "../../../utils/conn";
import { userModel } from "@/app/db/models/user.model";
import bcrypt from "bcrypt";
import { generateToken } from "@/app/utils/generateToken";
import { cookies } from "next/headers";
export const POST = async (req: NextRequest) => {
  await conn();
  try {
    const cookie = await cookies();
    const body: { email: string; password: string } = await req.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json(
        {
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 }
      );
    }
    if (!user.isVerified) {
      return NextResponse.json(
        {
          message: "Email not verified",
        },
        { status: 401 }
      );
    }
    const isPassword = await bcrypt.compare(password, user?.password);

    if (!isPassword) {
      return NextResponse.json(
        {
          message: "Invalid credentials",
        },
        { status: 401 }
      );
    }
    cookie.set("authToken", generateToken(user._id), {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
    });
    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
  }
};
