import { Response } from "express";
import { Notice } from "../models/Notice";
import { AuthRequest } from "../middleware/auth";

// GET /api/notices  (public)
export const getNotices = async (req: AuthRequest, res: Response) => {
  const { category, limit, page } = req.query;
  const filter: Record<string, any> = {};
  if (category) filter.category = category;

  const pageNum = page ? Math.max(1, Number(page)) : 1;
  const pageSize = limit ? Math.min(Number(limit), 50) : 10;
  const skip = (pageNum - 1) * pageSize;

  const [notices, total] = await Promise.all([
    Notice.find(filter)
      .populate("publishedBy", "name role")
      .sort({ isPinned: -1, publishDate: -1 })
      .skip(skip)
      .limit(pageSize),
    Notice.countDocuments(filter),
  ]);

  res.json({
    notices,
    pagination: {
      total,
      page: pageNum,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  });
};

// GET /api/notices/:id
export const getNoticeById = async (req: AuthRequest, res: Response) => {
  const notice = await Notice.findById(req.params.id).populate("publishedBy", "name role");
  if (!notice) return res.status(404).json({ message: "Notice not found" });
  res.json({ notice });
};

// POST /api/notices  (admin, teacher)
export const createNotice = async (req: AuthRequest, res: Response) => {
  const { title, content, category, isPinned, expiryDate, attachmentUrl } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  const notice = await Notice.create({
    title,
    content,
    category,
    isPinned,
    expiryDate,
    attachmentUrl,
    publishedBy: req.user?.id,
  });

  res.status(201).json({ message: "Notice published successfully", notice });
};

// PUT /api/notices/:id  (admin, ya tyo banाउne teacher)
export const updateNotice = async (req: AuthRequest, res: Response) => {
  const notice = await Notice.findById(req.params.id);
  if (!notice) return res.status(404).json({ message: "Notice not found" });

  const isOwner = notice.publishedBy.toString() === req.user?.id;
  if (req.user?.role !== "admin" && !isOwner) {
    return res.status(403).json({ message: "You can only edit notices you published" });
  }

  Object.assign(notice, req.body);
  await notice.save();

  res.json({ message: "Notice updated successfully", notice });
};

// DELETE /api/notices/:id
export const deleteNotice = async (req: AuthRequest, res: Response) => {
  const notice = await Notice.findById(req.params.id);
  if (!notice) return res.status(404).json({ message: "Notice not found" });

  const isOwner = notice.publishedBy.toString() === req.user?.id;
  if (req.user?.role !== "admin" && !isOwner) {
    return res.status(403).json({ message: "You can only delete notices you published" });
  }

  await notice.deleteOne();
  res.json({ message: "Notice deleted successfully" });
};