import mongoose, { Document, Types } from "mongoose";

interface IComment extends Document {
  userId: Types.ObjectId;
  commentText: string;
  postedBlogId: Types.ObjectId;
}

const commentSchema = new mongoose.Schema<IComment>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postedBlogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
    required: true,
  },
  commentText: { type: String, required: true },
});

export const commentModel =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", commentSchema);
