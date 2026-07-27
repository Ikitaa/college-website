import { Request, Response } from "express";

import { User } from "../models/User";
import { Notice } from "../models/Notice";
import { Course } from "../models/Course";
import { Admission } from "../models/Admission";
import { GalleryItem } from "../models/GalleryItem";
import { ContactMessage } from "../models/ContactMessage";

export const getDashboardStats = async (
  req: Request,
  res: Response
) => {
  const [
    users,
    faculty,
    notices,
    courses,
    admissions,
    galleryItems,
    messages,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "teacher" }),
    Notice.countDocuments(),
    Course.countDocuments(),
    Admission.countDocuments(),
    GalleryItem.countDocuments(),
    ContactMessage.countDocuments(),
  ]);

  res.json({
    users,
    faculty,
    notices,
    courses,
    admissions,
    galleryItems,
    messages,
  });
};