import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const update = body.update || body;
    const options = body.options || {};
    const lead = await Lead.findByIdAndUpdate(id, update, { ...options, new: true });
    console.log("Updated Lead:", lead);
    return NextResponse.json(lead);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    await Lead.findByIdAndDelete(id);
    return NextResponse.json({ message: "Lead deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
  }
}
