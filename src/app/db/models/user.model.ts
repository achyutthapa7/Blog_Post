import mongoose, { CallbackError, Document, Types } from "mongoose";
import bcrypt from "bcrypt";
export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isVerified: boolean;
  verificationCode: number;
  verificationCodeExpiry: Date;
  authToken: string;
  authTokenExpiry: Date;
  blogs: Types.ObjectId[];
  followers: Types.ObjectId[];
  sentFollowRequest: Types.ObjectId[];
  receivedFollowRequest: Types.ObjectId[];
  notifications: Types.ObjectId[];
}
const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: Number },
    verificationCodeExpiry: { type: Date, default: Date.now() },
    authToken: { type: String, default: null },
    authTokenExpiry: { type: Date, default: Date.now() },
    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog", default: [] }],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    sentFollowRequest: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    receivedFollowRequest: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
        default: [],
      },
    ],
  },
  { timestamps: true }
);
userSchema.pre<IUser>("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error("Error while pre-saving user", error);
    next(error as CallbackError);
  }
});
export const userModel =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
