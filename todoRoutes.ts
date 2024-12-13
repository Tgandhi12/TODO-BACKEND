// src/routes/todoRoutes.ts
import { Router } from "express";
import Todo from "../models/Todo";
import { authenticate } from "../middleware/authMiddleware"; // Authentication middleware

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get todos for the authenticated user
router.get("/", async (req, res) => {
  try {
    const userId = req.body.user._id; // Accessing userId from req.body.user (set by authenticate middleware)
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const todos = await Todo.find({ userId });
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).send("Error fetching todos");
  }
});

// Add a new todo for the authenticated user
router.post("/", async (req, res) => {
  try {
    const userId = req.body.user._id; // Accessing userId from req.body.user (set by authenticate middleware)
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const newTodo = new Todo({ ...req.body, userId }); // Ensure userId is included in the Todo
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    console.error("Error creating todo:", err);
    res.status(500).send("Error creating todo");
  }
});

// Update a todo
router.put("/:id", async (req, res) => {
  try {
    const userId = req.body.user._id; // Accessing userId from req.body.user (set by authenticate middleware)
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true }
    );

    if (!updatedTodo) return res.status(404).send("Todo not found");

    res.status(200).json(updatedTodo);
  } catch (err) {
    res.status(500).send("Error updating todo");
  }
});

// Delete a todo
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.body.user._id; // Accessing userId from req.body.user (set by authenticate middleware)
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const deletedTodo = await Todo.findOneAndDelete({ _id: id, userId });

    if (!deletedTodo) return res.status(404).send("Todo not found");

    res.status(200).json(deletedTodo);
  } catch (err) {
    res.status(500).send("Error deleting todo");
  }
});

export default router;
