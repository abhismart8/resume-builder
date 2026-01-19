import { connectDB } from "@/lib/db";
import User from "@/models/User";
import EmailVerification from "@/models/EmailVerification";
import bcrypt from "bcrypt";
import { validateSignupBody } from "@/lib/validation";
import { sanitizeString } from "@/lib/sanitize";
import crypto from "crypto";

// Placeholder - in production, use a service like SendGrid or AWS SES
async function sendVerificationEmail(email, token) {
  // TODO: Implement actual email sending
  console.log(`Verification link for ${email}: ${process.env.NEXTAUTH_URL}/api/verify-email?token=${token}`);
  return true;
}

export async function POST(request) {
  try {
    // Validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Validate input
    const validation = validateSignupBody(body);
    if (!validation.isValid) {
      return Response.json(
        { success: false, error: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }

    const email = sanitizeString(body.email).toLowerCase();
    const password = body.password; // Don't sanitize password

    await connectDB();

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return Response.json(
        { success: false, error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user with unverified email
    const user = await User.create({
      email,
      password: hashed,
      emailVerified: false
    });

    // Create verification token (expires in 24 hours)
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await EmailVerification.create({
      email,
      token: verificationToken,
      expiresAt,
      verified: false
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Delete user if email sending fails
      await User.deleteOne({ _id: user._id });
      return Response.json(
        { success: false, error: "Failed to send verification email" },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: "User created successfully. Please check your email to verify your account."
    }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
