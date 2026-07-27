import { Response } from "express";
import { Course } from "../models/Course";
import { AuthRequest } from "../middleware/auth";

// ================= GET ALL COURSES =================

export const getCourses = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { faculty, active } = req.query;

    const filter: Record<string, any> = {};

    if (faculty) {
      filter.faculty = faculty;
    }

    if (active !== undefined) {
      filter.isActive = active === "true";
    }

    const courses = await Course.find(filter)
      .populate("coordinator", "name designation")
      .sort({
        faculty: 1,
        title: 1,
      });

    return res.json({
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch courses.",
    });
  }
};

// ================= GET SINGLE COURSE =================

export const getCourseById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "coordinator",
      "name designation"
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    return res.json({
      course,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch course.",
    });
  }
};

// ================= CREATE COURSE =================

export const createCourse = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      title,
      code,
      faculty,
      description,
      durationYears,
      studySystem,
      semesterCount,
      totalCredits,
      eligibility,
      admissionFee,
      semesterFees,
      yearlyFees,
      examFee,
      totalFee,
      scholarship,
      careerOpportunities,
      curriculumUrl,
      medium,
      intake,
      seats,
      coordinator,
      isActive,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        message: "Course title is required.",
      });
    }

    if (!code?.trim()) {
      return res.status(400).json({
        message: "Course code is required.",
      });
    }

    if (!faculty?.trim()) {
      return res.status(400).json({
        message: "Faculty is required.",
      });
    }

    if (!durationYears) {
      return res.status(400).json({
        message: "Duration is required.",
      });
    }

    if (!studySystem) {
      return res.status(400).json({
        message: "Study system is required.",
      });
    }

    if (
      studySystem === "semester" &&
      (!semesterFees || semesterFees.length === 0)
    ) {
      return res.status(400).json({
        message: "Please enter semester fees.",
      });
    }

    if (
      studySystem === "year" &&
      (!yearlyFees || yearlyFees.length === 0)
    ) {
      return res.status(400).json({
        message: "Please enter yearly fees.",
      });
    }

    const existing = await Course.findOne({
      code: code.toUpperCase(),
    });

    if (existing) {
      return res.status(409).json({
        message: "Course code already exists.",
      });
    }

    const courseData: any = {
      title: title.trim(),
      code: code.toUpperCase(),
      faculty,
      description,
      durationYears,
      studySystem,
      semesterCount:
        studySystem === "semester"
          ? semesterCount
          : undefined,
      totalCredits,
      eligibility,
      admissionFee,
      semesterFees:
        studySystem === "semester"
          ? semesterFees
          : [],
      yearlyFees:
        studySystem === "year"
          ? yearlyFees
          : [],
      examFee,
      totalFee,
      scholarship,
      careerOpportunities,
      curriculumUrl,
      medium,
      intake,
      seats,
      isActive,
    };

    // Only save coordinator if a valid value exists
    if (
      coordinator &&
      typeof coordinator === "string" &&
      coordinator.trim() !== ""
    ) {
      courseData.coordinator = coordinator;
    }

    const course = await Course.create(courseData);

    return res.status(201).json({
      message: "Course created successfully.",
      course,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= UPDATE COURSE =================

export const updateCourse = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const updateData: any = {
      ...req.body,
    };

    if (
      !updateData.coordinator ||
      updateData.coordinator === ""
    ) {
      delete updateData.coordinator;
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    return res.json({
      message: "Course updated successfully.",
      course,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= DELETE COURSE =================

export const deleteCourse = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const course = await Course.findByIdAndDelete(
      req.params.id
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    return res.json({
      message: "Course deleted successfully.",
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};