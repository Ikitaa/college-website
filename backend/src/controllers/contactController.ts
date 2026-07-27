import { Request, Response } from "express";
import { ContactMessage } from "../models/ContactMessage";
import { AuthRequest } from "../middleware/auth";

// POST /api/contact (public)
export const submitContactMessage = async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const contactMessage = await ContactMessage.create({ name, email, subject, message });
  res.status(201).json({ message: "Your message has been sent successfully", contactMessage });
};

// GET /api/contact (admin matra)
export const getContactMessages = async (_req: AuthRequest, res: Response) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.json({ count: messages.length, messages });
};

// PATCH /api/contact/:id/read (admin matra)
export const updateMessageStatus = async (
  req: AuthRequest,
  res: Response
) => {
  const { status } = req.body;

  const message = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!message) {
    return res.status(404).json({
      message: "Message not found",
    });
  }

  res.json({
    message: "Status updated successfully",
    contactMessage: message,
  });
};
// DELETE /api/contact/:id (admin matra)
export const deleteContactMessage = async (req: AuthRequest, res: Response) => {
  const message = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!message) return res.status(404).json({ message: "Message not found" });
  res.json({ message: "Message deleted successfully" });
};