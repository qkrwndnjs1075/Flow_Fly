import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const comparePasswords = async (inputPassword: string, storedPassword: string) => {
  return await bcrypt.compare(inputPassword, storedPassword);
};

export const generateAccessToken = (userId: string) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (userId: string) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
