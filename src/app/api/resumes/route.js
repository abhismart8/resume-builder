import { connectDB } from "@/lib/db";
import Resume from "@/models/Resume";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { validateResumeBody } from "@/lib/validation";
import { sanitizeObject } from "@/lib/sanitize";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const resumes = await Resume.find({ userId: session.user.id }).sort({
      createdAt: -1,
    });

    return Response.json({ success: true, resumes });
  } catch (error) {
    console.error("GET resumes error:", error);
    return Response.json(
      { success: false, error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Add user ID to body for validation
    body.userId = session.user.id;

    // Validate request body
    const validation = validateResumeBody(body);
    if (!validation.isValid) {
      return Response.json(
        { success: false, error: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitizedBody = sanitizeObject(body);

    await connectDB();

    const resume = await Resume.create({
      ...sanitizedBody,
      userId: session.user.id,
    });

    return Response.json({ success: true, resume }, { status: 201 });
  } catch (error) {
    console.error("POST resume error:", error);
    return Response.json(
      { success: false, error: "Failed to create resume" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const resumeId = body.resumeId || body._id;
    if (!resumeId || typeof resumeId !== 'string') {
      return Response.json(
        { success: false, error: "Resume ID is required" },
        { status: 400 }
      );
    }

    // Remove resumeId from body before updating
    const updateData = { ...body };
    delete updateData.resumeId;
    delete updateData._id;

    // Add user ID for validation
    updateData.userId = session.user.id;

    // Validate request body
    const validation = validateResumeBody(updateData);
    if (!validation.isValid) {
      return Response.json(
        { success: false, error: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitizedData = sanitizeObject(updateData);

    await connectDB();

    // Verify ownership
    const resume = await Resume.findOne({ _id: resumeId, userId: session.user.id });
    if (!resume) {
      return Response.json(
        { success: false, error: "Resume not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update resume
    const updatedResume = await Resume.findByIdAndUpdate(
      resumeId,
      { ...sanitizedData, userId: session.user.id },
      { new: true, runValidators: true }
    );

    return Response.json({ success: true, resume: updatedResume });
  } catch (error) {
    console.error("PUT resume error:", error);
    return Response.json(
      { success: false, error: "Failed to update resume" },
      { status: 500 }
    );
  }
}
