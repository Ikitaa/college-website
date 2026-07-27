import { Schema, model, Document } from "mongoose";

export type AdmissionStatus = "pending" | "reviewed" | "accepted" | "rejected";

export interface IAdmission extends Document {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: Date;
  courseAppliedFor: string;
  previousSchool: string;
  previousGpa?: string;
  documentsUrl?: string;
  status: AdmissionStatus;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const admissionSchema = new Schema<IAdmission>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    courseAppliedFor: { type: String, required: true },
    previousSchool: { type: String, required: true },
    previousGpa: { type: String },
    documentsUrl: { type: String },
    status: { type: String, enum: ["pending", "reviewed", "accepted", "rejected"], default: "pending" },
    remarks: { type: String },
  },
  { timestamps: true }
);

export const Admission = model<IAdmission>("Admission", admissionSchema);