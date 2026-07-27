import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { UserRole } from "../models/User";

export interface JwtPayload {
  id: string;
  role: UserRole;
}

export const generateToken = (userId: Types.ObjectId | string, role: UserRole): string => {
  const secret = process.env.JWT_SECRET as string;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign({ id: userId.toString(), role }, secret, { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET as string;
  return jwt.verify(token, secret) as JwtPayload;
};