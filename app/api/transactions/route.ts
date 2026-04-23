import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import Wallet from "@/models/Wallet";

export async function GET() {
  try {
    await connectDB();
    const transactions = await Transaction.find({}).sort({ date: -1 }).limit(100);
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { walletName, type, amount, description, date } = await req.json();
    
    // Create transaction
    const transaction = await Transaction.create({
      walletName,
      type,
      amount,
      description,
      date: date || new Date()
    });
    
    // Update wallet balance
    const adjustment = type === "In" ? amount : -amount;
    await Wallet.findOneAndUpdate(
      { name: walletName },
      { $inc: { balance: adjustment }, updatedAt: new Date() },
      { upsert: true }
    );
    
    return NextResponse.json(transaction);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}
