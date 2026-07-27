import { Response } from "express";
import { SiteSettings } from "../models/SiteSettings";
import { AuthRequest } from "../middleware/auth";

// GET /api/settings  (public — frontend ले यहीं प्रयोग गरी college name, logo देखाउँछ)
export const getSettings = async (_req: AuthRequest, res: Response) => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  res.json({ settings });
};

// PUT /api/settings  (admin matra)
export const updateSettings = async (req: AuthRequest, res: Response) => {
  let settings = await SiteSettings.findOne();

  if (!settings) {
    settings = await SiteSettings.create(req.body);
  } else {
    Object.assign(settings, req.body);
    await settings.save();
  }

  res.json({ message: "Site settings updated successfully", settings });
};