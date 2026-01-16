import { connectDB } from "@/lib/db";
import Resume from "@/models/Resume";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

export async function POST(request, { params }) {
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

    // First verify the resume exists
    const resume = await Resume.findOne({ _id: id, userId: session.user.id });

    if (!resume) {
      return Response.json(
        { success: false, error: "Resume not found" },
        { status: 404 }
      );
    }

    // Generate a unique shareable link
    const shareableLink = crypto.randomBytes(16).toString("hex");
    
    // Use findByIdAndUpdate to ensure the update is persisted
    const updated = await Resume.findByIdAndUpdate(
      id,
      {
        $set: {
          shareableLink: shareableLink,
          isPublic: true,
        }
      },
      { new: true } // Return the updated document
    );
    
    // Verify it was saved by querying it back
    const verified = await Resume.findOne({ shareableLink: shareableLink });
    
    if (!verified) {
      return Response.json(
        { success: false, error: "Failed to save share link" },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      shareableLink,
      shareUrl: `/resume/share/${shareableLink}`,
    });
  } catch (error) {
    console.error("[Share POST] Error:", error);
    return Response.json(
      { success: false, error: error.message },
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

    // Use findByIdAndUpdate to revoke the share link
    const updated = await Resume.findByIdAndUpdate(
      id,
      {
        $set: {
          isPublic: false,
        },
        $unset: {
          shareableLink: ""
        }
      },
      { new: true }
    );

    if (!updated) {
      return Response.json(
        { success: false, error: "Resume not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("[Share DELETE] Error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

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

    return Response.json({
      success: true,
      shareableLink: resume.shareableLink,
      isPublic: resume.isPublic,
      shareUrl: resume.shareableLink ? `/resume/share/${resume.shareableLink}` : null,
    });
  } catch (error) {
    console.error("[Share GET] Error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
