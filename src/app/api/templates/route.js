import { connectDB } from "@/lib/db";
import Template from "@/models/Template";
import { sanitizeString } from "@/lib/sanitize";

export async function GET() {
  try {
    await connectDB();

    const templates = await Template.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .select("-__v");

    return Response.json({
      success: true,
      templates,
    });
  } catch (error) {
    console.error("GET templates error:", error);
    return Response.json(
      { success: false, error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

// POST endpoint for creating templates (admin use)
export async function POST(request) {
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

    // Basic validation
    if (!body.name || typeof body.name !== 'string') {
      return Response.json(
        { success: false, error: "Template name is required" },
        { status: 400 }
      );
    }

    if (!body.id || typeof body.id !== 'string') {
      return Response.json(
        { success: false, error: "Template ID is required" },
        { status: 400 }
      );
    }

    // Sanitize string fields
    body.name = sanitizeString(body.name);
    if (body.description) {
      body.description = sanitizeString(body.description);
    }
    if (body.category) {
      body.category = sanitizeString(body.category);
    }

    await connectDB();

    const template = await Template.create(body);

    return Response.json({
      success: true,
      template,
    }, { status: 201 });
  } catch (error) {
    console.error("POST template error:", error);
    return Response.json(
      { success: false, error: "Failed to create template" },
      { status: 500 }
    );
  }
}