import { connectDB } from "@/lib/db";
import Resume from "@/models/Resume";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { validateResumeBody } from "@/lib/validation";
import { sanitizeObject } from "@/lib/sanitize";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Parse pagination params
    const { searchParams } = new URL(request.url);
    let page = parseInt(searchParams.get("page")) || DEFAULT_PAGE;
    let limit = parseInt(searchParams.get("limit")) || DEFAULT_LIMIT;

    // Validate pagination params
    page = Math.max(1, page);
    limit = Math.min(Math.max(1, limit), MAX_LIMIT);

    const skip = (page - 1) * limit;

    await connectDB();

    // Get total count for pagination
    const total = await Resume.countDocuments({ userId: session.user.id });

    // Get paginated resumes
    const resumes = await Resume.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    return Response.json({
      success: true,
      resumes,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages
      }
    });
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

    // CRITICAL: Never include shareableLink or isPublic in creation payload
    delete sanitizedBody.shareableLink;
    delete sanitizedBody.isPublic;
    delete sanitizedBody._id;

    await connectDB();

    // Create without shareableLink field - let the schema omit it
    const createData = {
      ...sanitizedBody,
      userId: session.user.id,
      isPublic: false,
    };

    const resume = await Resume.create(createData);
    
    // Explicitly remove shareableLink if it somehow got created
    if (resume.shareableLink === null || resume.shareableLink === undefined) {
      await Resume.findByIdAndUpdate(
        resume._id,
        { $unset: { shareableLink: '' } },
        { new: false }
      );
    }

    return Response.json({ success: true, resume }, { status: 201 });
  } catch (error) {
    console.error("POST resume error:", error);
    
    // Handle E11000 duplicate key error specifically
    if (error.code === 11000 && error.keyPattern?.shareableLink) {
      return Response.json(
        { success: false, error: "Database integrity error: please try again" },
        { status: 503 }
      );
    }
    
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
    delete updateData.shareableLink; // Don't allow updates to shareableLink via this endpoint
    delete updateData.isPublic; // Don't allow updates to isPublic via this endpoint

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

    // Update resume (preserving shareableLink and isPublic)
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
