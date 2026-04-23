import mongoose, { Schema, model, models } from "mongoose";

const WalletSchema = new Schema({
  name: { type: String, required: true, unique: true }, // 'Payoneer', 'Bank', 'Cash'
  balance: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

if (mongoose.models.Wallet) {
  delete mongoose.models.Wallet;
}

const Wallet = model("Wallet", WalletSchema);
export default Wallet;
