import { Router } from "express";
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController";
import { protect, authorize } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { courseRules, handleValidation } from "../middleware/validators";

const router = Router();

router.get("/", asyncHandler(getCourses)); // public
router.get("/:id", asyncHandler(getCourseById)); // public

router.post("/", protect, authorize("admin"), courseRules, handleValidation, asyncHandler(createCourse));
router.put("/:id", protect, authorize("admin"), asyncHandler(updateCourse));
router.delete("/:id", protect, authorize("admin"), asyncHandler(deleteCourse));

export default router;