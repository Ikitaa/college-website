import { Request, Response } from "express";

// POST /api/upload  (admin, teacher) — gallery, notices, settings form haru le use garने
export const uploadFile = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({
            message: "No file uploaded",
        });
    }

    res.status(201).json({
        message: "File uploaded successfully",
        fileUrl: `/uploads/${req.file.filename}`,
    });
};