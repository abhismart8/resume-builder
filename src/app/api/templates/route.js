import { connectDB } from "@/lib/db";
import Template from "@/models/Template";

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
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST endpoint for creating templates (admin use)
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const template = await Template.create(body);

    return Response.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error("POST template error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}