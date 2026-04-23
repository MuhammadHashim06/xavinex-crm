import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Wallet from "@/models/Wallet";

export async function GET() {
  try {
    await connectDB();
    let wallets = await Wallet.find({});
    
    // Initialize if empty
    if (wallets.length === 0) {
      const initialWallets = [
        { name: "Payoneer", balance: 0 },
        { name: "Bank", balance: 0 },
        { name: "Cash", balance: 0 }
      ];
      await Wallet.insertMany(initialWallets);
      wallets = await Wallet.find({});
    }
    
    return NextResponse.json(wallets);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch wallets" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { name, balance } = await req.json();
    const wallet = await Wallet.findOneAndUpdate(
      { name },
      { balance, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    return NextResponse.json(wallet);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update wallet" }, { status: 500 });
  }
}
