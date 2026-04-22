import mongoose, { Schema, model, models } from "mongoose";

const PaymentSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  clientName: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  description: String,
  createdAt: { type: Date, default: Date.now }
});

if (mongoose.models.Payment) {
  delete mongoose.models.Payment;
}

const Payment = model("Payment", PaymentSchema);
export default Payment;
