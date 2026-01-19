import { connectDB } from "@/lib/db";
import Resume from "@/models/Resume";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { validateResumeBody } from "@/lib/validation";
import { sanitizeObject } from "@/lib/sanitize";

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
      { success: false, error: "Internal server error" },
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

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE resume error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ success: false, error: "Invalid resume ID" }, { status: 400 });
    }

    // Add user ID for validation
    body.userId = session.user.id;

    // Remove shareableLink and isPublic from updates (they should only be set via dedicated endpoints)
    delete body.shareableLink;
    delete body.isPublic;

    // Validate request body
    const validation = validateResumeBody(body);
    if (!validation.isValid) {
      return Response.json(
        { success: false, error: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitizedData = sanitizeObject(body);

    await connectDB();

    const updated = await Resume.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { ...sanitizedData, userId: session.user.id },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return Response.json({ success: false, error: "Resume not found" }, { status: 404 });
    }

    return Response.json({ success: true, resume: updated });
  } catch (error) {
    console.error("PUT resume error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
