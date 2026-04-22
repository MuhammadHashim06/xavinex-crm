import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Retainership from "@/models/Retainership";

export async function GET() {
  try {
    await connectDB();
    const retainerships = await Retainership.find({}).sort({ createdAt: -1 });
    return NextResponse.json(retainerships);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch retainerships" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const retainership = await Retainership.create(body);
    return NextResponse.json(retainership);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create retainership" }, { status: 500 });
  }
}
