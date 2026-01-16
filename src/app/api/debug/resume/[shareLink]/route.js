import { connectDB } from "@/lib/db";
import Resume from "@/models/Resume";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { shareLink } = await params;

    console.log("[Debug API] Looking for shareLink:", shareLink);

    // Search for all resumes with any shareableLink
    const allWithLinks = await Resume.find({ 
      shareableLink: { $exists: true, $ne: null } 
    }).select("_id personal.name shareableLink isPublic createdAt");

    console.log("[Debug API] All resumes with shareableLinks:", allWithLinks);

    // Specific search
    const specific = await Resume.findOne({ shareableLink: shareLink });
    console.log("[Debug API] Specific search result:", specific);

    if (specific) {
      console.log("[Debug API] Fields: shareableLink=", specific.shareableLink, "isPublic=", specific.isPublic);
    }

    return Response.json({
      success: true,
      searchingFor: shareLink,
      allWithLinks,
      specificMatch: specific,
    });
  } catch (error) {
    console.error("[Debug API] Error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
