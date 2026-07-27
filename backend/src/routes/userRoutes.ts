import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  toggleUserActive,
  deleteUser,
} from "../controllers/userController";
import { protect, authorize } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(protect, authorize("admin"));

router.get("/", asyncHandler(getUsers));
router.get("/:id", asyncHandler(getUserById));
router.post("/", asyncHandler(createUser));
router.put("/:id", asyncHandler(updateUser));
router.patch("/:id/deactivate", asyncHandler(toggleUserActive));
router.delete("/:id", asyncHandler(deleteUser));

export default router;