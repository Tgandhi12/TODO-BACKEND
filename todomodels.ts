import mongoose, { Document, Schema, Model } from "mongoose";


export interface ITodo extends Document {
  text: string;
  completed: boolean;
  dueDate: string;
  scheduledDate: string;
  isImportant: boolean;
}


const todoSchema: Schema<ITodo> = new Schema({
  text: { type: String, required: true }, // Text of the task
  completed: { type: Boolean, default: false }, // Completion status
  dueDate: { type: String, required: true }, // Due date as a string
  scheduledDate: { type: String, required: true }, // Scheduled date as a string
  isImportant: { type: Boolean, default: false }, // Importance status
});


const Todo: Model<ITodo> = mongoose.model<ITodo>("Todo", todoSchema);

export default Todo;

