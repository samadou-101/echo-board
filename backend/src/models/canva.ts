import { Schema, model, Document } from "mongoose";

interface ICanvas extends Document {
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CanvasSchema = new Schema<ICanvas>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Canvas = model<ICanvas>("Canvas", CanvasSchema);
