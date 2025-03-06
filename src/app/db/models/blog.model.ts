import mongoose, { Document, Types } from "mongoose";

interface IPost extends Document {
  userId: Types.ObjectId;
  title: string;
  content: string;
  likes: Types.ObjectId[];
  comments: Types.ObjectId[];
}

const blogSchema = new mongoose.Schema<IPost>(
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
  mongoose.models.Blog || mongoose.model<IPost>("Blog", blogSchema);
