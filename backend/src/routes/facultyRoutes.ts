import { Router } from "express";
import { getFacultyList, getFacultyById } from "../controllers/facultyController";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(getFacultyList)); // public
router.get("/:id", asyncHandler(getFacultyById)); // public

export default router;