import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import todoRoutes from "./routes/todoRoutes";
import { authRoutes } from "./routes/Auth";
import { authenticate } from "./middleware/authMiddleware"; // Middleware for JWT authentication

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/todos")
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("Error connecting to MongoDB:", error));

// Authentication Routes
app.use("/auth", authRoutes);

// Protected Todo Routes
app.use("/todos", authenticate, todoRoutes); // Apply JWT authentication middleware

// Health check
app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
