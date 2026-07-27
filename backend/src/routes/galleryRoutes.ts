import { Router } from "express";
import {
  getGalleryItems,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "../controllers/galleryController";

import { protect, authorize } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// ================= PUBLIC =================

router.get("/", asyncHandler(getGalleryItems));

router.get("/:id", asyncHandler(getGalleryItemById));

// ================= ADMIN / TEACHER =================

router.post(
  "/",
  protect,
  authorize("admin", "teacher"),
  asyncHandler(createGalleryItem)
);

router.put(
  "/:id",
  protect,
  authorize("admin", "teacher"),
  asyncHandler(updateGalleryItem)
);

router.delete(
  "/:id",
  protect,
  authorize("admin", "teacher"),
  asyncHandler(deleteGalleryItem)
);

export default router;