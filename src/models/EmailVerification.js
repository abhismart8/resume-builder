import mongoose from 'mongoose';

const EmailVerificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true
    },
    token: {
      type: String,
      required: true,
      unique: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 } // Auto-delete after expiration
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.models.EmailVerification ||
  mongoose.model('EmailVerification', EmailVerificationSchema);
