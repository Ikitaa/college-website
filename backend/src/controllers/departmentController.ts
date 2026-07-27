import { Response } from "express";
import { Department } from "../models/Department";
import { AuthRequest } from "../middleware/auth";

// GET /api/departments
export const getDepartments = async (
  req: AuthRequest,
  res: Response
) => {
  const departments = await Department.find()
    .sort({ name: 1 });

  res.json({
    count: departments.length,
    departments,
  });
};

// GET /api/departments/:id
export const getDepartmentById = async (
  req: AuthRequest,
  res: Response
) => {
  const department = await Department.findById(req.params.id);

  if (!department) {
    return res.status(404).json({
      message: "Department not found",
    });
  }

  res.json({ department });
};

// POST /api/departments
export const createDepartment = async (
  req: AuthRequest,
  res: Response
) => {
  const { name, code, description } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Department name is required",
    });
  }

  const exists = await Department.findOne({ name });

  if (exists) {
    return res.status(409).json({
      message: "Department already exists",
    });
  }

  const department = await Department.create({
    name,
    code,
    description,
  });

  res.status(201).json({
    message: "Department created successfully",
    department,
  });
};

// PUT /api/departments/:id
export const updateDepartment = async (
  req: AuthRequest,
  res: Response
) => {
  const department = await Department.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!department) {
    return res.status(404).json({
      message: "Department not found",
    });
  }

  res.json({
    message: "Department updated successfully",
    department,
  });
};

// DELETE /api/departments/:id
export const deleteDepartment = async (
  req: AuthRequest,
  res: Response
) => {
  const department = await Department.findByIdAndDelete(
    req.params.id
  );

  if (!department) {
    return res.status(404).json({
      message: "Department not found",
    });
  }

  res.json({
    message: "Department deleted successfully",
  });
};