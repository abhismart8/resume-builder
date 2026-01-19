import { connectDB } from "@/lib/db";
import EmailVerification from "@/models/EmailVerification";
import User from "@/models/User";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token || typeof token !== 'string') {
      return Response.json(
        { success: false, error: "Invalid or missing verification token" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find verification token
    const verification = await EmailVerification.findOne({ token });

    if (!verification) {
      return Response.json(
        { success: false, error: "Verification token not found" },
        { status: 404 }
      );
    }

    // Check if token is expired
    if (new Date() > verification.expiresAt) {
      await EmailVerification.deleteOne({ _id: verification._id });
      return Response.json(
        { success: false, error: "Verification token has expired" },
        { status: 400 }
      );
    }

    // Check if already verified
    if (verification.verified) {
      return Response.json(
        { success: false, error: "Email already verified" },
        { status: 400 }
      );
    }

    // Mark email as verified in verification record
    await EmailVerification.updateOne(
      { _id: verification._id },
      { verified: true }
    );

    // Mark email as verified in user record
    await User.updateOne(
      { email: verification.email },
      { emailVerified: true }
    );

    return Response.json({
      success: true,
      message: "Email verified successfully. You can now log in."
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
