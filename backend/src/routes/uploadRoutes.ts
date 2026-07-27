import { Router } from "express";
import { uploadFile } from "../controllers/uploadController";
import { protect, authorize } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post(
    "/",
    protect,
    authorize("admin","teacher"),
    upload.single("file"),
    asyncHandler(uploadFile)
);
export default router;