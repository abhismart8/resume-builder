import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";

export async function POST(request) {
  await connectDB();
  const { email, password } = await request.json();

  const existing = await User.findOne({ email });
  if (existing) {
    return Response.json(
      { success: false, error: "User already exists" },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ email, password: hashed });

  return Response.json({ success: true });
}
