export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ error: "Unauthorized" });
};

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET = process.env.SESSION_SECRET;

export const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Get token from header

  if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};