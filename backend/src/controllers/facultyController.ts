import { Response } from "express";
import { User } from "../models/User";
import { AuthRequest } from "../middleware/auth";

// GET /api/faculty
export const getFacultyList = async (
  req: AuthRequest,
  res: Response
) => {
  const { department } = req.query;

  const filter: Record<string, any> = {
    role: "teacher",
    isActive: true,
  };

  if (department) {
    filter.department = department;
  }

  const faculty = await User.find(filter)
    .select(
      `
      name
      email
      avatarUrl
      department
      designation
      qualification
      phone
      bio
      `
    )
    .sort({ name: 1 });

  res.json({
    count: faculty.length,
    faculty,
  });
};

// GET /api/faculty/:id
export const getFacultyById = async (
  req: AuthRequest,
  res: Response
) => {
  const teacher = await User.findOne({
    _id: req.params.id,
    role: "teacher",
    isActive: true,
  }).select(
    `
    name
    email
    avatarUrl
    department
    designation
    qualification
    phone
    bio
    `
  );

  if (!teacher) {
    return res.status(404).json({
      message: "Faculty member not found",
    });
  }

  res.json({
    teacher,
  });
};