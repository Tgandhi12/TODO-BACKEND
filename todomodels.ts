import mongoose, { Schema, Document } from "mongoose";

export interface ITodo extends Document {
  text: string;
  completed: boolean;
  dueDate: string;
  scheduledDate: string;
  isImportant: boolean;
  createdAt: Date;  
  updatedAt: Date;
}

const TodoSchema: Schema = new Schema(
  {
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    dueDate: { type: String, required: true },
    scheduledDate: { type: String, required: true },
    isImportant: { type: Boolean, default: false },
  },
  { timestamps: true } 
);

export default mongoose.model<ITodo>("Todo", TodoSchema);
