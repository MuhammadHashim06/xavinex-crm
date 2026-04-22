import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectDB();
    
    const adminEmail = "admin@xavinex.com";
    const existingUser = await User.findOne({ email: adminEmail });

    if (existingUser) {
      return NextResponse.json({ message: "Admin user already exists" });
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);
    const newUser = await User.create({
      email: adminEmail,
      password: hashedPassword,
      name: "Super Admin",
      role: "admin",
    });

    return NextResponse.json({ 
      message: "Admin user created successfully",
      credentials: {
        email: adminEmail,
        password: "admin123"
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to initialize admin" }, { status: 500 });
  }
}
