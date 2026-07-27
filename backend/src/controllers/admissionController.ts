import { Response, Request } from "express";
import { Admission } from "../models/Admission";
import { AuthRequest } from "../middleware/auth";

// POST /api/admissions (public — जो कोही पनि apply गर्न सक्छ)
export const submitAdmission = async (req: Request, res: Response) => {
  const {
    fullName,
    email,
    phone,
    address,
    dateOfBirth,
    courseAppliedFor,
    previousSchool,
    previousGpa,
    documentsUrl,
  } = req.body;

  if (!fullName || !email || !phone || !address || !dateOfBirth || !courseAppliedFor || !previousSchool) {
    return res.status(400).json({ message: "Please fill in all required fields" });
  }

  const admission = await Admission.create({
    fullName,
    email,
    phone,
    address,
    dateOfBirth,
    courseAppliedFor,
    previousSchool,
    previousGpa,
    documentsUrl,
  });

  res.status(201).json({
    message: "Application submitted successfully. We will contact you soon.",
    admission,
  });
};

// GET /api/admissions (admin matra)
export const getAdmissions = async (req: AuthRequest, res: Response) => {
  const { status, search, page, limit } = req.query;

  const filter: Record<string, any> = {};

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.fullName = {
      $regex: search,
      $options: "i",
    };
  }

  const pageNum = Number(page) || 1;
  const pageSize = Number(limit) || 10;

  const total = await Admission.countDocuments(filter);

  const admissions = await Admission.find(filter)
    .sort({ createdAt: -1 })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize);

  res.json({
    admissions,
    pagination: {
      total,
      page: pageNum,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  });
};

// PATCH /api/admissions/:id/status (admin matra)
export const updateAdmissionStatus = async (req: AuthRequest, res: Response) => {
  const { status, remarks } = req.body;

  const admission = await Admission.findByIdAndUpdate(
    req.params.id,
    { status, remarks },
    { new: true, runValidators: true }
  );

  if (!admission) return res.status(404).json({ message: "Application not found" });
  res.json({ message: "Application status updated", admission });
};

// DELETE /api/admissions/:id (admin matra)
export const deleteAdmission = async (req: AuthRequest, res: Response) => {
  const admission = await Admission.findByIdAndDelete(req.params.id);
  if (!admission) return res.status(404).json({ message: "Application not found" });
  res.json({ message: "Application deleted" });
};