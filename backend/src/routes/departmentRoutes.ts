import { Router } from "express";
import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departmentController";

import { protect, authorize } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Public
router.get("/", asyncHandler(getDepartments));
router.get("/:id", asyncHandler(getDepartmentById));

// Admin
router.post(
  "/",
  protect,
  authorize("admin"),
  asyncHandler(createDepartment)
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  asyncHandler(updateDepartment)
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  asyncHandler(deleteDepartment)
);

export default router;