import { Router } from "express";
import { login, registerStudent, logout, getMe } from "../controllers/authController";
import { protect } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { loginLimiter, formLimiter } from "../middleware/rateLimiters";
import { loginRules, registerStudentRules, handleValidation } from "../middleware/validators";

const router = Router();

router.post("/login", loginLimiter, loginRules, handleValidation, asyncHandler(login));
router.post(
  "/register-student",
  formLimiter,
  registerStudentRules,
  handleValidation,
  asyncHandler(registerStudent)
);
router.post("/logout", asyncHandler(logout));
router.get("/me", protect, asyncHandler(getMe));

export default router;