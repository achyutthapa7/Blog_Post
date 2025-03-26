import mongoose, { Document, Types } from "mongoose";
interface INotification extends Document {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  blogId: Types.ObjectId;
  message: string;
  read: boolean;
}

const notificationSchema = new mongoose.Schema<INotification>(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const notificationModel =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", notificationSchema);
