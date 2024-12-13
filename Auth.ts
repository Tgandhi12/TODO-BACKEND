import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

const JWT_SECRET = "123"; // Replace with your actual secret

const router = express.Router();

// POST /register - Register endpoint
router.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already taken" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ email, password: hashedPassword });

    // Save the new user to the database
    await newUser.save();

    return res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST /login - Login endpoint
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log("Received email:", email);  // Log the received email
  console.log("Received password:", password);  // Log the received password

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found"); // Log when user is not found
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Password mismatch"); // Log password mismatch
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

    // Send response with token
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export { router as authRoutes };
