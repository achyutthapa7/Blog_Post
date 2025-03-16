import mongoose, { Document, Types } from "mongoose";

export interface IBlog extends Document {
  _id: string;
  userId: Types.ObjectId;
  title: string;
  content: string;
  likes: Types.ObjectId[] | undefined;
  comments: {
    _id: Types.ObjectId;
    userId: {
      _id: string;
      firstName: string;
      lastName: string;
    };
    commentText: string;
    createdAt: Date;
  }[];
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
