import { Schema, model, Document, Types } from "mongoose";

export type NoticeCategory = "general" | "exam" | "admission" | "event" | "urgent";

export interface INotice extends Document {
  title: string;
  content: string;
  category: NoticeCategory;
  attachmentUrl?: string;
  isPinned: boolean;
  publishedBy: Types.ObjectId;
  publishDate: Date;
  expiryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const noticeSchema = new Schema<INotice>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ["general", "exam", "admission", "event", "urgent"],
      default: "general",
    },
    attachmentUrl: { type: String },
    isPinned: { type: Boolean, default: false },
    publishedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    publishDate: { type: Date, default: Date.now },
    expiryDate: { type: Date },
  },
  { timestamps: true }
);

export const Notice = model<INotice>("Notice", noticeSchema);