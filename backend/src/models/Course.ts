import { Schema, model, Document, Types } from "mongoose";

export interface ICourse extends Document {
  title: string;
  code: string;
  faculty: string;

  description: string;

  durationYears: number;

  // semester or year
  studySystem: "semester" | "year";

  // only for semester system
  semesterCount?: number;

  totalCredits: number;

  eligibility: string;

  // Fee Structure
  admissionFee: number;

  semesterFees: number[];

  yearlyFees: number[];

  examFee: string;

  totalFee: number;

  scholarship: string;

  careerOpportunities: string;

  curriculumUrl?: string;

  medium: string;

  intake: string;

  seats?: number;

  coordinator?: Types.ObjectId;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    faculty: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    durationYears: {
      type: Number,
      required: true,
    },

    studySystem: {
      type: String,
      enum: ["semester", "year"],
      required: true,
    },

    semesterCount: {
      type: Number,
      required: function (this: ICourse) {
        return this.studySystem === "semester";
      },
    },

    totalCredits: {
      type: Number,
      default: 0,
    },

    eligibility: {
      type: String,
      default: "",
    },

    admissionFee: {
      type: Number,
      default: 0,
    },

    semesterFees: {
  type: [Number],
  default: [],
  validate: {
    validator: function (this: any, value: number[]) {
      if (this.studySystem !== "semester") return true;
      return value.length > 0;
    },
    message: "Semester fees are required.",
  },
},
    yearlyFees: {
  type: [Number],
  default: [],
  validate: {
    validator: function (this: any, value: number[]) {
      if (this.studySystem !== "year") return true;
      return value.length > 0;
    },
    message: "Yearly fees are required.",
  },
},

    examFee: {
      type: String,
      default: "",
    },

    totalFee: {
      type: Number,
      default: 0,
    },

    scholarship: {
      type: String,
      default: "",
    },

    careerOpportunities: {
      type: String,
      default: "",
    },

    curriculumUrl: {
      type: String,
      default: "",
    },

    medium: {
      type: String,
      default: "English",
    },

    intake: {
      type: String,
      default: "Yearly",
    },

    seats: {
      type: Number,
      default: 0,
    },

    coordinator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Course = model<ICourse>("Course", courseSchema);