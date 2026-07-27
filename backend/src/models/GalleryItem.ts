import { Schema, model, Document, Types } from "mongoose";

export interface IGalleryItem extends Document {
  title: string;
  description?: string;

  imageUrl: string;

  category:
    | "Campus"
    | "Events"
    | "Sports"
    | "Graduation"
    | "Programs"
    | "Facilities"
    | "Others";

  eventDate?: Date;

  displayOrder: number;

  featured: boolean;

  isActive: boolean;

  uploadedBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const galleryItemSchema = new Schema<IGalleryItem>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    imageUrl: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Campus",
        "Events",
        "Sports",
        "Graduation",
        "Programs",
        "Facilities",
        "Others",
      ],
      default: "Campus",
    },

    eventDate: {
      type: Date,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const GalleryItem = model<IGalleryItem>(
  "GalleryItem",
  galleryItemSchema
);