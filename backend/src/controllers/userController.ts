import { Response } from "express";
import { User } from "../models/User";
import { AuthRequest } from "../middleware/auth";

// GET /api/users?role=teacher
export const getUsers = async (req: AuthRequest, res: Response) => {
  const { role, search } = req.query;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const filter: Record<string, any> = {};

  if (role) filter.role = role;

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const total = await User.countDocuments(filter);

  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    count: total,
    page,
    totalPages: Math.ceil(total / limit),
    users,
  });
};

// GET /api/users/:id
export const getUserById = async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
};

// POST /api/users  (admin le teacher/student account direct banauचा)
export const createUser = async (req: AuthRequest, res: Response) => {
  const {
  name,
  email,
  password,
  role,

  // Teacher
  avatarUrl,
  department,
  designation,
  qualification,
  phone,
  bio,

  // Student
  faculty,
  semester,
  rollNumber,
} = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Name, email, password and role are required" });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ message: "A user with this email already exists" });
  }

  const user = await User.create({
  name,
  email,
  password,
  role,

  // Teacher
  avatarUrl,
  department,
  designation,
  qualification,
  phone,
  bio,

  // Student
  faculty,
  semester,
 rollNumber,
});

  res.status(201).json({ message: "User created successfully", user });
};

// PUT /api/users/:id
export const updateUser = async (req: AuthRequest, res: Response) => {
  const updates = { ...req.body };
  delete updates.password; // password change छुट्टै flow बाट हुनुपर्छ
  delete updates.email; // identity hijack बाट बचाउनको लागि

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User updated successfully", user });
};

// PATCH /api/users/:id/deactivate
export const toggleUserActive = async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.isActive = !user.isActive;
  await user.save();

  res.json({ message: `User ${user.isActive ? "activated" : "deactivated"}`, user });
};

// DELETE /api/users/:id
export const deleteUser = async (req: AuthRequest, res: Response) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted successfully" });
};