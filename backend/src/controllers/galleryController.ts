import { Response } from "express";
import { GalleryItem } from "../models/GalleryItem";
import { AuthRequest } from "../middleware/auth";

// ================= GET ALL GALLERY ITEMS =================

export const getGalleryItems = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { category, active, page, limit } = req.query;

    const filter: Record<string, any> = {};

    if (category) {
      filter.category = category;
    }

    if (active !== undefined) {
      filter.isActive = active === "true";
    }

    const pageNum = page ? Math.max(1, Number(page)) : 1;
    const pageSize = limit ? Math.min(Number(limit), 50) : 12;
    const skip = (pageNum - 1) * pageSize;

    const [items, total] = await Promise.all([
      GalleryItem.find(filter)
        .populate("uploadedBy", "name")
        .sort({
          featured: -1,
          displayOrder: 1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(pageSize),

      GalleryItem.countDocuments(filter),
    ]);

    return res.json({
      count: total,
      items,
      pagination: {
        page: pageNum,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch gallery items.",
    });
  }
};

// ================= GET SINGLE GALLERY ITEM =================

export const getGalleryItemById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const item = await GalleryItem.findById(req.params.id).populate(
      "uploadedBy",
      "name"
    );

    if (!item) {
      return res.status(404).json({
        message: "Gallery item not found.",
      });
    }

    return res.json({
      item,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch gallery item.",
    });
  }
};

// ================= CREATE GALLERY ITEM =================

export const createGalleryItem = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      title,
      description,
      imageUrl,
      category,
      eventDate,
      displayOrder,
      featured,
      isActive,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        message: "Gallery title is required.",
      });
    }

    if (!imageUrl?.trim()) {
      return res.status(400).json({
        message: "Image is required.",
      });
    }

    const item = await GalleryItem.create({
      title: title.trim(),
      description,
      imageUrl,
      category,
      eventDate,
      displayOrder,
      featured,
      isActive,
      uploadedBy: req.user?.id || undefined,
    });

    return res.status(201).json({
      message: "Gallery item added successfully.",
      item,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= UPDATE GALLERY ITEM =================

export const updateGalleryItem = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const item = await GalleryItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!item) {
      return res.status(404).json({
        message: "Gallery item not found.",
      });
    }

    return res.json({
      message: "Gallery item updated successfully.",
      item,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= DELETE GALLERY ITEM =================

export const deleteGalleryItem = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const item = await GalleryItem.findByIdAndDelete(
      req.params.id
    );

    if (!item) {
      return res.status(404).json({
        message: "Gallery item not found.",
      });
    }

    return res.json({
      message: "Gallery item deleted successfully.",
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};