import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    await Payment.findByIdAndDelete(id);
    return NextResponse.json({ message: "Payment deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete payment" }, { status: 500 });
  }
}
