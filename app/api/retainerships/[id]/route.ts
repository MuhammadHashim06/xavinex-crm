import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Retainership from "@/models/Retainership";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    await Retainership.findByIdAndDelete(id);
    return NextResponse.json({ message: "Retainership deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete retainership" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const retainership = await Retainership.findByIdAndUpdate(id, { $set: body }, { returnDocument: "after" });
    return NextResponse.json(retainership);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update retainership" }, { status: 500 });
  }
}
