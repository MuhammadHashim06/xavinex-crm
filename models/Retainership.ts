import mongoose, { Schema, model, models } from "mongoose";

const RetainershipSchema = new Schema({
  projectName: { type: String, required: true },
  clientName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

if (mongoose.models.Retainership) {
  delete mongoose.models.Retainership;
}

const Retainership = model("Retainership", RetainershipSchema);
export default Retainership;
