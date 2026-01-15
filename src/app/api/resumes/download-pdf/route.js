// Server-side PDF generation using html2pdf.js approach
export async function POST(request) {
  try {
    const { resumeId, templateId, data, templateStyles = {} } = await request.json();

    if (!data) {
      return Response.json(
        { success: false, error: "No resume data provided" },
        { status: 400 }
      );
    }

    // Generate clean HTML for PDF with template styles
    const pdfHTML = generatePDFHTML(data, templateId, templateStyles);

    // Use html2pdf logic client-side or return optimized HTML
    return Response.json({
      success: true,
      html: pdfHTML,
      message: "PDF HTML generated successfully"
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

function generatePDFHTML(data, templateId, templateStyles = {}) {
  const {
    personal = {},
    summary = "",
    skills = [],
    experience = [],
    education = [],
    projects = [],
    certifications = [],
    awards = [],
    languages = [],
    volunteer = [],
    references = [],
    interests = [],
    publications = [],
    memberships = [],
    links = {},
    customSections = [],
  } = data;

  // Apply template styles with fallbacks - use actual properties from templates
  const styles = {
    backgroundColor: templateStyles.backgroundColor || "#ffffff",
    fontFamily: templateStyles.fontFamily || "'Calibri', 'Segoe UI', 'Helvetica Neue', sans-serif",
    color: templateStyles.color || "#333",
    headerColor: templateStyles.headerColor || templateStyles.color || "#1f2937",
    accentColor: templateStyles.accentColor || "#2563eb",
    secondaryColor: templateStyles.secondaryColor || "#f0f0f0",
    borderColor: templateStyles.borderColor || "#ddd",
    fontSize: templateStyles.fontSize || "11pt",
    lineHeight: templateStyles.lineHeight || "1.4",
    spacing: templateStyles.spacing || "1.5rem",
  };

  // Convert colors to hex format for PDF safety
  const safeStyles = {
    backgroundColor: sanitizeColor(styles.backgroundColor),
    fontFamily: styles.fontFamily,
    color: sanitizeColor(styles.color),
    headerColor: sanitizeColor(styles.headerColor),
    accentColor: sanitizeColor(styles.accentColor),
    secondaryColor: sanitizeColor(styles.secondaryColor),
    borderColor: sanitizeColor(styles.borderColor),
  };

  // eslint-disable-next-line
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume - ${personal.name || "Resume"}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: ${safeStyles.fontFamily};
      background: ${safeStyles.backgroundColor};
      color: ${safeStyles.color};
      line-height: 1.4;
      font-size: 11pt;
    }

    .resume-container {
      width: 210mm;
      padding: 20mm;
      margin: 0 auto;
      background: ${safeStyles.backgroundColor};
      line-height: 1.5;
    }

    .header {
      margin-bottom: 16px;
    }

    .header h1 {
      font-size: 24pt;
      font-weight: bold;
      color: ${safeStyles.headerColor};
      margin-bottom: 4px;
      letter-spacing: 0.5px;
    }

    .contact-info {
      font-size: 10pt;
      color: ${safeStyles.color};
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .contact-info span {
      display: inline-block;
    }

    hr {
      border: none;
      border-top: 2px solid ${safeStyles.accentColor};
      margin: 16px 0;
    }

    .section {
      margin-bottom: 14px;
    }

    .section-title {
      font-size: 12pt;
      font-weight: bold;
      color: ${safeStyles.accentColor};
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 1px solid ${safeStyles.borderColor};
      padding-bottom: 4px;
      margin-bottom: 8px;
    }

    .summary-text {
      font-size: 11pt;
      color: ${safeStyles.color};
      line-height: 1.5;
      margin-bottom: 4px;
    }

    .skills-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 4px;
    }

    .skill-tag {
      background: ${safeStyles.secondaryColor};
      color: ${safeStyles.color};
      padding: 2px 8px;
      border-radius: 3px;
      font-size: 10pt;
      border: 1px solid ${safeStyles.borderColor};
    }

    .experience-item,
    .education-item,
    .project-item {
      margin-bottom: 10px;
    }

    .item-title {
      font-weight: bold;
      font-size: 11pt;
      color: ${safeStyles.headerColor};
      display: flex;
      justify-content: space-between;
      margin-bottom: 2px;
    }

    .item-subtitle {
      font-size: 10pt;
      color: ${safeStyles.accentColor};
      font-weight: 600;
      margin-bottom: 2px;
    }

    .item-date {
      font-size: 10pt;
      color: ${safeStyles.color};
      font-style: italic;
      opacity: 0.7;
    }

    .item-description {
      font-size: 10pt;
      color: ${safeStyles.color};
      margin-top: 2px;
      line-height: 1.4;
    }

    .project-link {
      font-size: 9pt;
      color: ${safeStyles.accentColor};
      text-decoration: underline;
      word-break: break-all;
      margin-top: 2px;
    }

    @media print {
      body {
        margin: 0;
        padding: 0;
      }
      .resume-container {
        margin: 0;
        padding: 20mm;
        box-shadow: none;
        page-break-inside: avoid;
      }
      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="resume-container">
    <!-- Header -->
    <div class="header">
      <h1>${escapeHTML(personal.name || "Your Name")}</h1>
      <div class="contact-info">
        ${personal.email ? `<span>${escapeHTML(personal.email)}</span>` : ""}
        ${personal.phone ? `<span>|</span><span>${escapeHTML(personal.phone)}</span>` : ""}
        ${personal.location ? `<span>|</span><span>${escapeHTML(personal.location)}</span>` : ""}
      </div>
    </div>

    <hr />

    <!-- Summary -->
    ${summary ? `
    <div class="section">
      <h2 class="section-title">Summary</h2>
      <p class="summary-text">${escapeHTML(summary)}</p>
    </div>
    ` : ""}

    <!-- Skills -->
    ${skills.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Skills</h2>
      <div class="skills-container">
        ${skills.map(skill => `<span class="skill-tag">${escapeHTML(skill)}</span>`).join("")}
      </div>
    </div>
    ` : ""}

    <!-- Experience -->
    ${experience.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Experience</h2>
      ${experience.map(exp => `
      <div class="experience-item">
        <div class="item-title">
          <span>${escapeHTML(exp.role || "")}</span>
          <span class="item-date">${escapeHTML(exp.startDate || "")} - ${escapeHTML(exp.endDate || "")}</span>
        </div>
        <div class="item-subtitle">${escapeHTML(exp.company || "")}</div>
        ${exp.description ? `<div class="item-description">${escapeHTML(exp.description)}</div>` : ""}
      </div>
      `).join("")}
    </div>
    ` : ""}

    <!-- Education -->
    ${education.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Education</h2>
      ${education.map(edu => `
      <div class="education-item">
        <div class="item-title">
          <span>${escapeHTML(edu.degree || "")}</span>
          <span class="item-date">${escapeHTML(edu.year || "")}</span>
        </div>
        <div class="item-subtitle">${escapeHTML(edu.institution || "")}</div>
        ${edu.gpa ? `<div class="item-description">GPA: ${escapeHTML(edu.gpa)}</div>` : ""}
      </div>
      `).join("")}
    </div>
    ` : ""}

    <!-- Projects -->
    ${projects.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Projects</h2>
      ${projects.map(proj => `
      <div class="project-item">
        <div class="item-title">
          <span>${escapeHTML(proj.name || "")}</span>
          <span class="item-date">${escapeHTML(proj.technologies || "")}</span>
        </div>
        ${proj.description ? `<div class="item-description">${escapeHTML(proj.description)}</div>` : ""}
        ${proj.link ? `<div class="project-link">${escapeHTML(proj.link)}</div>` : ""}
      </div>
      `).join("")}
    </div>
    ` : ""}

    <!-- Certifications -->
    ${certifications.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Certifications</h2>
      ${certifications.map(cert => `
      <div class="certification-item">
        <div class="item-title">
          <span>${escapeHTML(cert.name || "")}</span>
          <span class="item-date">${escapeHTML(cert.date || "")}</span>
        </div>
        <div class="item-subtitle">${escapeHTML(cert.issuer || "")}</div>
        ${cert.credentialId ? `<div class="item-description">Credential ID: ${escapeHTML(cert.credentialId)}</div>` : ""}
      </div>
      `).join("")}
    </div>
    ` : ""}

    <!-- Awards -->
    ${awards.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Awards & Honors</h2>
      ${awards.map(award => `
      <div class="award-item">
        <div class="item-title">
          <span>${escapeHTML(award.name || "")}</span>
          <span class="item-date">${escapeHTML(award.date || "")}</span>
        </div>
        <div class="item-subtitle">${escapeHTML(award.issuer || "")}</div>
        ${award.description ? `<div class="item-description">${escapeHTML(award.description)}</div>` : ""}
      </div>
      `).join("")}
    </div>
    ` : ""}

    <!-- Languages -->
    ${languages.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Languages</h2>
      <div class="skills-container">
        ${languages.map(lang => `<span class="skill-tag">${escapeHTML(lang.name || "")} (${escapeHTML(lang.proficiency || "")})</span>`).join("")}
      </div>
    </div>
    ` : ""}

    <!-- Volunteer Experience -->
    ${volunteer.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Volunteer Experience</h2>
      ${volunteer.map(vol => `
      <div class="volunteer-item">
        <div class="item-title">
          <span>${escapeHTML(vol.role || "")}</span>
          <span class="item-date">${escapeHTML(vol.startDate || "")} - ${escapeHTML(vol.endDate || "")}</span>
        </div>
        <div class="item-subtitle">${escapeHTML(vol.organization || "")}</div>
        ${vol.description ? `<div class="item-description">${escapeHTML(vol.description)}</div>` : ""}
      </div>
      `).join("")}
    </div>
    ` : ""}

    <!-- Publications -->
    ${publications.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Publications</h2>
      ${publications.map(pub => `
      <div class="publication-item">
        <div class="item-title">
          <span>"${escapeHTML(pub.title || "")}"</span>
          <span class="item-date">${escapeHTML(pub.date || "")}</span>
        </div>
        <div class="item-subtitle">${escapeHTML(pub.journal || "")}</div>
        ${pub.link ? `<div class="project-link">${escapeHTML(pub.link)}</div>` : ""}
      </div>
      `).join("")}
    </div>
    ` : ""}

    <!-- Professional Memberships -->
    ${memberships.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Professional Memberships</h2>
      ${memberships.map(mem => `
      <div class="membership-item">
        <div class="item-title">
          <span>${escapeHTML(mem.role || "")}</span>
          <span class="item-date">${escapeHTML(mem.startDate || "")} - ${escapeHTML(mem.endDate || "")}</span>
        </div>
        <div class="item-subtitle">${escapeHTML(mem.organization || "")}</div>
      </div>
      `).join("")}
    </div>
    ` : ""}

    <!-- Interests -->
    ${interests.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Interests</h2>
      <p class="summary-text">${escapeHTML(interests.join(", "))}</p>
    </div>
    ` : ""}

    <!-- Links -->
    ${(links.linkedin || links.github || links.portfolio || links.website) ? `
    <div class="section">
      <h2 class="section-title">Professional Links</h2>
      <div class="links-container">
        ${links.linkedin ? `<div class="link-item">LinkedIn: ${escapeHTML(links.linkedin)}</div>` : ""}
        ${links.github ? `<div class="link-item">GitHub: ${escapeHTML(links.github)}</div>` : ""}
        ${links.portfolio ? `<div class="link-item">Portfolio: ${escapeHTML(links.portfolio)}</div>` : ""}
        ${links.website ? `<div class="link-item">Website: ${escapeHTML(links.website)}</div>` : ""}
      </div>
    </div>
    ` : ""}

    <!-- References -->
    ${references.length > 0 ? `
    <div class="section">
      <h2 class="section-title">References</h2>
      ${references.map(ref => `
      <div class="reference-item">
        <div class="item-title">
          <span>${escapeHTML(ref.name || "")}</span>
        </div>
        <div class="item-subtitle">${escapeHTML(ref.position || "")} at ${escapeHTML(ref.company || "")}</div>
        <div class="contact-info">
          ${ref.email ? `<span>${escapeHTML(ref.email)}</span>` : ""}
          ${ref.phone ? `<span>|</span><span>${escapeHTML(ref.phone)}</span>` : ""}
        </div>
      </div>
      `).join("")}
    </div>
    ` : ""}

    <!-- Custom Sections -->
    ${customSections.length > 0 ? `
    ${customSections.map(section => `
    <div class="section">
      <h2 class="section-title">${escapeHTML(section.title || "")}</h2>
      <p class="summary-text">${escapeHTML(section.content || "")}</p>
    </div>
    `).join("")}
    ` : ""}
  </div>
</body>
</html>
  `;
}

function escapeHTML(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sanitizeColor(color) {
  if (!color) return "#000000";

  // If it's already a hex color, return as is
  if (color.match(/^#[0-9A-Fa-f]{6}$/)) return color;
  if (color.match(/^#[0-9A-Fa-f]{3}$/)) return color;

  // Convert named colors to hex
  const namedColors = {
    'white': '#ffffff',
    'black': '#000000',
    'gray': '#808080',
    'grey': '#808080',
    'red': '#ff0000',
    'blue': '#0000ff',
    'green': '#008000',
    'yellow': '#ffff00',
    'purple': '#800080',
    'orange': '#ffa500',
    'pink': '#ffc0cb',
    'brown': '#a52a2a',
    'navy': '#000080',
    'maroon': '#800000',
    'lime': '#00ff00',
    'aqua': '#00ffff',
    'teal': '#008080',
    'olive': '#808000',
    'silver': '#c0c0c0',
  };

  if (namedColors[color.toLowerCase()]) {
    return namedColors[color.toLowerCase()];
  }

  // Convert rgb/rgba to hex
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  return "#000000";
}