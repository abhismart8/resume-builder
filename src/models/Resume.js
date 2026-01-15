import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    templateId: String,
    personal: Object,
    summary: String,
    skills: [String],
    experience: [Object],
    education: [Object],
    projects: [Object],
    certifications: [Object],
    awards: [Object],
    languages: [Object],
    volunteer: [Object],
    references: [Object],
    interests: [String],
    publications: [Object],
    memberships: [Object],
    links: Object,
    customSections: [Object],
  },
  { timestamps: true }
);

export default mongoose.models.Resume ||
  mongoose.model("Resume", ResumeSchema);
