import { connectDB } from "@/lib/db";
import Resume from "@/models/Resume";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { success: false, error: "Invalid resume ID" },
        { status: 400 }
      );
    }

    const resume = await Resume.findOne({ _id: id, userId: session.user.id });

    if (!resume) {
      return Response.json(
        { success: false, error: "Resume not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, resume });
  } catch (error) {
    console.error("GET resume error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;

    console.log("DELETE resume id:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { success: false, error: "Invalid resume ID" },
        { status: 400 }
      );
    }

    const deleted = await Resume.findOneAndDelete({ _id: id, userId: session.user.id });

    if (!deleted) {
      return Response.json(
        { success: false, error: "Resume not found" },
        { status: 404 }
      );
    }

    console.log("Deleted resume:", deleted._id);

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE resume error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const { id } = await params;
  const body = await request.json();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ success: false, error: "Invalid resume ID" }, { status: 400 });
  }

  const updated = await Resume.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    body,
    { new: true }
  );

  if (!updated) {
    return Response.json({ success: false, error: "Resume not found" }, { status: 404 });
  }

  return Response.json({ success: true, resume: updated });
}
