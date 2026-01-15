import { connectDB } from "@/lib/db";
import Template from "@/models/Template";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
      { success: false, error: error.message },
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
        { status: 401 }
      );
    }

    await connectDB();

    const { templateId } = await params;
    const body = await request.json();

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
      { success: false, error: error.message },
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
        { status: 401 }
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
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}