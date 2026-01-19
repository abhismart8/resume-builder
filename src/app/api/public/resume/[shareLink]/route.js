import { connectDB } from "@/lib/db";
import Resume from "@/models/Resume";

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    // Handle async params properly
    const resolvedParams = await Promise.resolve(params);
    const shareLink = Array.isArray(resolvedParams.shareLink) 
      ? resolvedParams.shareLink[0] 
      : resolvedParams.shareLink;

    if (!shareLink || typeof shareLink !== "string") {
      return Response.json(
        { success: false, error: "Invalid share link" },
        { status: 400 }
      );
    }

    const resume = await Resume.findOne({
      shareableLink: shareLink,
      isPublic: true,
    });

    if (!resume) {
      return Response.json(
        { success: false, error: "Resume not found or not shared publicly" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, resume });
  } catch (error) {
    console.error("GET public resume error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
