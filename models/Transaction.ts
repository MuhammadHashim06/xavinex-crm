import mongoose, { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema({
  walletName: { type: String, required: true }, // 'Payoneer', 'Bank', 'Cash'
  type: { type: String, enum: ['In', 'Out', 'Adjustment'], required: true },
  amount: { type: Number, required: true },
  description: { type: String, default: "" },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

if (mongoose.models.Transaction) {
  delete mongoose.models.Transaction;
}

const Transaction = model("Transaction", TransactionSchema);
export default Transaction;
