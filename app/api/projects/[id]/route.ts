import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import Payment from "@/models/Payment";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const project = await Project.findByIdAndUpdate(id, body, { returnDocument: "after" });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    // Cascade delete: Delete all payments associated with this project
    await Payment.deleteMany({ projectId: id });
    
    // Delete the project itself
    await Project.findByIdAndDelete(id);
    
    return NextResponse.json({ message: "Project and associated data deleted" });
  } catch (error) {
    console.error("DELETE /api/projects/[id] Error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
