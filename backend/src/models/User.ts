import { Schema, model, Document, Types } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "admin" | "teacher" | "student";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatarUrl?: string;
  // teacher-specific
  // ================= Teacher-specific =================

department?: Types.ObjectId;
designation?: string;
qualification?: string;
phone?: string;
bio?: string;
  // student-specific
  rollNumber?: string;
  faculty?: string;
  semester?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: true },
    role: { type: String, enum: ["admin", "teacher", "student"], default: "student" },
    avatarUrl: { type: String },
    // ================= Teacher Fields =================

department: {
  type: Schema.Types.ObjectId,
  ref: "Department",
},

designation: {
  type: String,
  trim: true,
},

qualification: {
  type: String,
  trim: true,
},

phone: {
  type: String,
  trim: true,
},

bio: {
  type: String,
  trim: true,
},
    rollNumber: { type: String },
    faculty: { type: String },
    semester: { type: Number },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Mongoose 9: pre middleware no longer receives a `next` callback.
// Async functions resolve automatically — Mongoose waits for the
// function to finish before continuing.
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

// Never send password hash back in API responses
userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    const { password, ...user } = ret;
    return user;
  },
});

export const User = model<IUser>("User", userSchema);