import mongoose, { Schema, model, models } from "mongoose";

const RetainershipSchema = new Schema({
  projectName: { type: String, required: true },
  clientName: { type: String, required: true },
  date: { type: String, default: () => new Date().toISOString().split("T")[0] },
  duration: { type: String, required: true }, // e.g. "6 Months"
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

if (mongoose.models.Retainership) {
  delete mongoose.models.Retainership;
}

const Retainership = model("Retainership", RetainershipSchema);
export default Retainership;
