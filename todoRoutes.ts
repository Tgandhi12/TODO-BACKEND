import { Router, Request, Response } from "express";
import Todo from '../models/todomodels';

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { text, dueDate, scheduledDate, isImportant } = req.body;

  if (!text || !dueDate || !scheduledDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newTodo = new Todo({
    text,
    completed: false,
    dueDate,
    scheduledDate,
    isImportant: isImportant || false,
  });

  try {
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(500).json({ error: "Failed to save todo" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { completed, isImportant } = req.body;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { completed, isImportant },
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(200).json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: "Failed to update todo" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(200).json({ message: "Todo deleted", deletedTodo });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

export default router;
