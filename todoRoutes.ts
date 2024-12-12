import { Router, Request, Response } from "express";
import Todo from "../models/Todo";
import mongoose from "mongoose";

const router = Router();

// Get all todos
router.get("/", async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).send(errorMessage);
  }
});

// Add a new todo
router.post("/", async (req: Request, res: Response) => {
  try {
    const newTodo = new Todo(req.body);
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).send(errorMessage);
  }
});

// Update a todo
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("------",id)
  console.log(req.body);
  // Check if ID is valid
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid or missing Todo ID");
  }

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedTodo) {
      return res.status(404).send("Todo not found");
    }
    res.status(200).json(updatedTodo);
  } catch (err) {
    console.log(err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).send(errorMessage);
  }
});

// Delete a todo
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if ID is valid
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid or missing Todo ID");
  }

  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).send("Todo not found");
    }
    res.status(200).json(deletedTodo);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).send(errorMessage);
  }
});

export default router;
