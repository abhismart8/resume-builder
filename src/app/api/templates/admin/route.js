import { connectDB } from "@/lib/db";
import Template from "@/models/Template";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const templates = await Template.find({})
      .sort({ sortOrder: 1, createdAt: -1 })
      .select("-__v");

    return Response.json({
      success: true,
      templates,
    });
  } catch (error) {
    console.error("GET admin templates error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}