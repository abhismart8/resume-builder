// Set environment variables before any imports
process.env.MONGODB_URI = "mongodb+srv://mongo_db_user:iwtjG1sfpNL0KXGZ@resume-builder.ejvthzt.mongodb.net/?appName=resume-builder";

import { connectDB } from "../src/lib/db.js";
import Template from "../src/models/Template.js";

const sampleTemplates = [
  {
    id: "classic-professional",
    name: "Classic Professional",
    description: "Clean and professional single-column resume perfect for traditional industries",
    category: "Professional",
    thumbnail: "/templates/classic-professional.svg",
    isActive: true,
    cssStyles: {
      backgroundColor: "#ffffff",
      fontFamily: "'Times New Roman', serif",
      color: "#333333",
    },
    previewData: {
      personal: {
        name: "John Doe",
        email: "john.doe@email.com",
        phone: "(555) 123-4567",
        location: "New York, NY",
      },
    },
    sortOrder: 1,
  },
  {
    id: "modern-creative",
    name: "Modern Creative",
    description: "Bold and modern design with creative layouts for tech and design roles",
    category: "Creative",
    thumbnail: "/templates/modern-creative.svg",
    isActive: true,
    cssStyles: {
      backgroundColor: "#f8f9fa",
      fontFamily: "'Helvetica Neue', sans-serif",
      color: "#2d3748",
      accentColor: "#4299e1",
    },
    previewData: {
      personal: {
        name: "Jane Smith",
        email: "jane.smith@email.com",
        phone: "(555) 987-6543",
        location: "San Francisco, CA",
      },
    },
    sortOrder: 2,
  },
  {
    id: "minimalist-clean",
    name: "Minimalist Clean",
    description: "Simple and elegant design focusing on content with minimal distractions",
    category: "Minimalist",
    thumbnail: "/templates/minimalist-clean.svg",
    isActive: true,
    cssStyles: {
      backgroundColor: "#ffffff",
      fontFamily: "'Roboto', sans-serif",
      color: "#1a202c",
      spacing: "1.5rem",
    },
    previewData: {
      personal: {
        name: "Alex Johnson",
        email: "alex.johnson@email.com",
        phone: "(555) 456-7890",
        location: "Austin, TX",
      },
    },
    sortOrder: 3,
  },
  {
    id: "executive-premium",
    name: "Executive Premium",
    description: "Sophisticated design for senior executives and management positions",
    category: "Executive",
    thumbnail: "/templates/executive-premium.svg",
    isActive: true,
    cssStyles: {
      backgroundColor: "#ffffff",
      fontFamily: "'Georgia', serif",
      color: "#1a365d",
      headerColor: "#2d3748",
      accentColor: "#744210",
    },
    previewData: {
      personal: {
        name: "Michael Chen",
        email: "michael.chen@email.com",
        phone: "(555) 234-5678",
        location: "Chicago, IL",
      },
    },
    sortOrder: 4,
  },
  {
    id: "tech-innovative",
    name: "Tech Innovative",
    description: "Cutting-edge design for technology and startup professionals",
    category: "Technology",
    thumbnail: "/templates/tech-innovative.svg",
    isActive: true,
    cssStyles: {
      backgroundColor: "#0f172a",
      fontFamily: "'Inter', sans-serif",
      color: "#f1f5f9",
      accentColor: "#06b6d4",
      secondaryColor: "#64748b",
    },
    previewData: {
      personal: {
        name: "Sarah Kim",
        email: "sarah.kim@email.com",
        phone: "(555) 345-6789",
        location: "Seattle, WA",
      },
    },
    sortOrder: 5,
  },
  {
    id: "academic-scholar",
    name: "Academic Scholar",
    description: "Traditional academic format perfect for educators and researchers",
    category: "Academic",
    thumbnail: "/templates/academic-scholar.svg",
    isActive: true,
    cssStyles: {
      backgroundColor: "#ffffff",
      fontFamily: "'Times New Roman', serif",
      color: "#2d3748",
      fontSize: "11pt",
      lineHeight: "1.4",
    },
    previewData: {
      personal: {
        name: "Dr. Robert Wilson",
        email: "r.wilson@university.edu",
        phone: "(555) 567-8901",
        location: "Boston, MA",
      },
    },
    sortOrder: 6,
  },
];

async function seedTemplates() {
  try {
    await connectDB();

    // Clear existing templates
    await Template.deleteMany({});

    // Insert sample templates
    const templates = await Template.insertMany(sampleTemplates);

    console.log(`✅ Seeded ${templates.length} templates successfully!`);
    console.log("Template IDs:", templates.map(t => t.id));

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding templates:", error);
    process.exit(1);
  }
}

seedTemplates();