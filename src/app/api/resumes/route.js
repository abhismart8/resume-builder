import { connectDB } from "@/lib/db";
import Resume from "@/models/Resume";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ success: false }, { status: 401 });
  }

  await connectDB();
  const resumes = await Resume.find({ userId: session.user.id }).sort({
    createdAt: -1,
  });

  return Response.json({ success: true, resumes });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ success: false }, { status: 401 });
  }

  await connectDB();
  const body = await request.json();

  const resume = await Resume.create({
    ...body,
    userId: session.user.id,
  });

  return Response.json({ success: true, resume });
}
