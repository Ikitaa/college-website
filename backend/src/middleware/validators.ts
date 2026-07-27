import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const handleValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: (e as any).path, message: e.msg })),
    });
  }
  next();
};

export const loginRules = [
  body("email").isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

export const registerStudentRules = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }),
  body("email").isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

export const contactRules = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }),
  body("email").isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("subject").trim().notEmpty().withMessage("Subject is required").isLength({ max: 150 }),
  body("message").trim().notEmpty().withMessage("Message is required").isLength({ max: 3000 }),
];

export const admissionRules = [
  body("fullName").trim().notEmpty().withMessage("Full name is required"),
  body("email").isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 7, max: 15 })
    .withMessage("Phone number looks invalid"),
  body("address").trim().notEmpty().withMessage("Address is required"),
  body("dateOfBirth").isISO8601().withMessage("A valid date of birth is required"),
  body("courseAppliedFor").trim().notEmpty().withMessage("Please select a course"),
  body("previousSchool").trim().notEmpty().withMessage("Previous school/college is required"),
];

export const noticeRules = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 200 }),
  body("content").trim().notEmpty().withMessage("Content is required"),
];

export const courseRules = [
  body("title").trim().notEmpty().withMessage("Course title is required"),
  body("code").trim().notEmpty().withMessage("Course code is required"),
  body("faculty").trim().notEmpty().withMessage("Faculty/program name is required"),
  body("durationYears").isFloat({ min: 0.5, max: 8 }).withMessage("Duration must be a realistic number of years"),
];