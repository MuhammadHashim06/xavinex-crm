import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";

export async function GET() {
  try {
    await connectDB();
    const leads = await Lead.find({}).sort({ createdAt: -1 });
    return NextResponse.json(leads);
  } catch (error) {
    console.error("GET /api/leads Error:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const lead = await Lead.create(body);
    return NextResponse.json(lead);
  } catch (error) {
    console.error("POST /api/leads Error:", error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
