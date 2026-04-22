import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Project from "@/models/Project";

export async function GET() {
  try {
    await connectDB();
    const payments = await Payment.find({}).sort({ createdAt: -1 });
    return NextResponse.json(payments);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { projectId, amount, description } = await req.json();

    // 1. Find Project
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // 2. Create Payment
    const payment = await Payment.create({
      projectId,
      clientName: project.clientName,
      amount,
      description
    });

    // 3. Update Project Outstanding Balance
    // We need to handle cases where outstandingBalance might be a string in some old records, so we convert it.
    const currentOutstanding = parseFloat(project.outstandingBalance as any || "0");
    const newOutstanding = Math.max(0, currentOutstanding - amount);
    
    await Project.findByIdAndUpdate(projectId, { 
      $set: { outstandingBalance: newOutstanding.toString() } 
    });

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 });
  }
}
