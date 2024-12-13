// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = "123"; // Replace with your actual JWT secret

// Middleware for Authenticated Routes
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return; // Ensure control exits after sending the response
  }

  try {
    // Verify token and extract payload
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // Attach user object to req for downstream use (with userId)
    req.body.user = { _id: decoded.userId }; // Attach user object with _id

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return; // Ensure control exits after sending the response
  }
};

export default authenticate;
