import { connectDB } from "@/lib/db";
import Template from "@/models/Template";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sanitizeString } from "@/lib/sanitize";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { templateId } = await params;

    const template = await Template.findOne({ id: templateId, isActive: true });

    if (!template) {
      return Response.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    return Response.json(template);
  } catch (error) {
    console.error("GET template error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
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

    // Sanitize string fields
    if (body.name) {
      body.name = sanitizeString(body.name);
    }
    if (body.description) {
      body.description = sanitizeString(body.description);
    }
    if (body.category) {
      body.category = sanitizeString(body.category);
    }

    await connectDB();

    const { templateId } = await params;

    const template = await Template.findByIdAndUpdate(
      templateId,
      body,
      { new: true, runValidators: true }
    );

    if (!template) {
      return Response.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error("PUT template error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    await connectDB();

    const { templateId } = await params;

    const template = await Template.findByIdAndDelete(templateId);

    if (!template) {
      return Response.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch (error) {
    console.error("DELETE template error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}