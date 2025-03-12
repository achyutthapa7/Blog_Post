import mongoose, { Document, Types } from "mongoose";

export interface IBlog extends Document {
  userId: Types.ObjectId;
  title: string;
  content: string;
  likes: Types.ObjectId[];
  comments: Types.ObjectId[];
  createdAt: Date;
  updatedAt?: Date;
}

const blogSchema = new mongoose.Schema<IBlog>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    comments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: [] },
    ],
  },
  { timestamps: true }
);
export const blogModel =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", blogSchema);
