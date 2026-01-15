import mongoose from "mongoose";

const TemplateSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "General",
    },
    thumbnail: {
      type: String, // URL to thumbnail image
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    cssStyles: {
      type: Object, // Store custom CSS styles for the template
      default: {},
    },
    previewData: {
      type: Object, // Sample data for preview
      default: {},
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Template ||
  mongoose.model("Template", TemplateSchema);