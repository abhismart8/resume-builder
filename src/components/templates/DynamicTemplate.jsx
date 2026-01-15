"use client";

import { useState, useEffect } from "react";

// Utility function to convert template styles to PDF-safe styles
function getPDFSafeStyles(templateStyles) {
  const pdfSafeStyles = { ...templateStyles };

  // Convert complex colors to simple hex/rgb
  if (pdfSafeStyles.backgroundColor) {
    pdfSafeStyles.backgroundColor = convertToPDFSafeColor(pdfSafeStyles.backgroundColor);
  }
  if (pdfSafeStyles.color) {
    pdfSafeStyles.color = convertToPDFSafeColor(pdfSafeStyles.color);
  }
  if (pdfSafeStyles.headerColor) {
    pdfSafeStyles.headerColor = convertToPDFSafeColor(pdfSafeStyles.headerColor);
  }
  if (pdfSafeStyles.accentColor) {
    pdfSafeStyles.accentColor = convertToPDFSafeColor(pdfSafeStyles.accentColor);
  }
  if (pdfSafeStyles.secondaryColor) {
    pdfSafeStyles.secondaryColor = convertToPDFSafeColor(pdfSafeStyles.secondaryColor);
  }

  // Remove problematic CSS properties
  delete pdfSafeStyles.boxShadow;
  delete pdfSafeStyles.textShadow;
  delete pdfSafeStyles.transform;
  delete pdfSafeStyles.transition;
  delete pdfSafeStyles.animation;
  delete pdfSafeStyles.filter;
  delete pdfSafeStyles.backdropFilter;
  delete pdfSafeStyles.backgroundImage; // Remove gradients
  delete pdfSafeStyles.background; // Remove complex backgrounds

  // Ensure font family is web-safe for PDF
  if (pdfSafeStyles.fontFamily) {
    pdfSafeStyles.fontFamily = getPDFSafeFontFamily(pdfSafeStyles.fontFamily);
  }

  // Ensure numeric values are properly formatted
  if (pdfSafeStyles.fontSize && typeof pdfSafeStyles.fontSize === 'string') {
    pdfSafeStyles.fontSize = pdfSafeStyles.fontSize.replace('px', '') + 'px';
  }
  if (pdfSafeStyles.lineHeight && typeof pdfSafeStyles.lineHeight === 'number') {
    pdfSafeStyles.lineHeight = pdfSafeStyles.lineHeight.toString();
  }

  return pdfSafeStyles;
}

// Convert colors to PDF-safe format
function convertToPDFSafeColor(color) {
  if (!color) return '#000000';

  // If it's already a hex color, return as is
  if (color.match(/^#[0-9A-Fa-f]{6}$/)) return color;

  // Convert named colors to hex
  const namedColors = {
    'white': '#ffffff',
    'black': '#000000',
    'gray': '#808080',
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
    'silver': '#c0c0c0'
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

  // Convert hsl to hex (simplified)
  const hslMatch = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (hslMatch) {
    // Simple HSL to RGB conversion
    const h = parseInt(hslMatch[1]) / 360;
    const s = parseInt(hslMatch[2]) / 100;
    const l = parseInt(hslMatch[3]) / 100;

    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return `#${Math.round(r * 255).toString(16).padStart(2, '0')}${Math.round(g * 255).toString(16).padStart(2, '0')}${Math.round(b * 255).toString(16).padStart(2, '0')}`;
  }

  // Default fallback
  return '#000000';
}

// Get PDF-safe font family
function getPDFSafeFontFamily(fontFamily) {
  if (!fontFamily) return "'Helvetica', 'Arial', sans-serif";

  // Extract the first font from the stack and check if it's web-safe
  const primaryFont = fontFamily.split(',')[0].replace(/['"]/g, '').trim();

  const webSafeFonts = [
    'Arial', 'Helvetica', 'Times', 'Times New Roman', 'Courier', 'Courier New',
    'Georgia', 'Verdana', 'Geneva', 'Tahoma', 'Trebuchet MS', 'Impact'
  ];

  if (webSafeFonts.includes(primaryFont)) {
    return `'${primaryFont}', sans-serif`;
  }

  // Default to Helvetica for PDFs
  return "'Helvetica', 'Arial', sans-serif";
}

export default function DynamicTemplate({ templateId, data, isPDF = false }) {
  const [templateData, setTemplateData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        // Fetch template data from API
        const res = await fetch(`/api/templates/${templateId}`);
        if (res.ok) {
          const template = await res.json();
          setTemplateData(template);
        } else {
          // Fallback to default template data
          setTemplateData({
            name: templateId,
            cssStyles: {
              backgroundColor: "#ffffff",
              fontFamily: "'Inter', sans-serif",
              color: "#1f2937",
            }
          });
        }
      } catch (error) {
        console.error("Error fetching template:", error);
        // Fallback
        setTemplateData({
          name: templateId,
          cssStyles: {
            backgroundColor: "#ffffff",
            fontFamily: "'Inter', sans-serif",
            color: "#1f2937",
          }
        });
      } finally {
        setLoading(false);
      }
    };

    if (templateId) {
      fetchTemplate();
    } else {
      setLoading(false);
    }
  }, [templateId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading template...</div>
      </div>
    );
  }

  const styles = templateData?.cssStyles || {};
  const pdfSafeStyles = isPDF ? getPDFSafeStyles(styles) : styles;
  const appliedStyles = isPDF ? pdfSafeStyles : styles;
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
  } = data || {};

  return (
    <div
      id="resume"
      className={`w-[210mm] min-h-[297mm] p-10 border border-gray-300 resume-pdf ${isPDF ? 'pdf-safe' : 'pdf-optimized'}`}
      style={{
        backgroundColor: appliedStyles.backgroundColor || "#ffffff",
        fontFamily: appliedStyles.fontFamily || "'Inter', sans-serif",
        color: appliedStyles.color || "#1f2937",
        fontSize: appliedStyles.fontSize || "14px",
        lineHeight: appliedStyles.lineHeight || "1.5",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        fontSynthesis: "none",
      }}
    >
      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-4xl font-bold tracking-tight mb-2"
          style={{ color: appliedStyles.headerColor || appliedStyles.color }}
        >
          {personal.name || "Your Name"}
        </h1>
        <div className="text-sm opacity-75">
          {personal.email}
          {personal.phone && ` | ${personal.phone}`}
          {personal.location && ` | ${personal.location}`}
        </div>
      </div>

      <hr className="mb-6" style={{ borderColor: appliedStyles.accentColor || "#e5e7eb" }} />

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <h2
            className="text-sm uppercase tracking-wider opacity-75 mb-2 font-semibold"
            style={{ color: appliedStyles.accentColor }}
          >
            Summary
          </h2>
          <p className="text-sm leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-sm uppercase tracking-wider opacity-75 mb-2 font-semibold"
            style={{ color: appliedStyles.accentColor }}
          >
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span
                key={i}
                className="text-sm px-2 py-1 rounded"
                style={{
                  backgroundColor: appliedStyles.secondaryColor || "#f3f4f6",
                  color: appliedStyles.color
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-sm uppercase tracking-wider opacity-75 mb-3 font-semibold"
            style={{ color: appliedStyles.accentColor }}
          >
            Experience
          </h2>
          {experience.map((exp, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <strong className="text-base">{exp.role}</strong>
                <span className="text-sm opacity-75">{exp.duration}</span>
              </div>
              <div className="text-sm font-medium mb-1" style={{ color: appliedStyles.accentColor }}>
                {exp.company}
              </div>
              {exp.description && (
                <p className="text-sm opacity-80 mt-1">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-sm uppercase tracking-wider opacity-75 mb-3 font-semibold"
            style={{ color: appliedStyles.accentColor }}
          >
            Education
          </h2>
          {education.map((edu, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-start">
                <strong className="text-base">{edu.degree}</strong>
                <span className="text-sm opacity-75">{edu.year}</span>
              </div>
              <div className="text-sm opacity-80">{edu.school}</div>
              {edu.gpa && <div className="text-sm opacity-75">GPA: {edu.gpa}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-sm uppercase tracking-wider opacity-75 mb-3 font-semibold"
            style={{ color: appliedStyles.accentColor }}
          >
            Projects
          </h2>
          {projects.map((project, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <strong className="text-base">{project.name}</strong>
                <span className="text-sm opacity-75">{project.technologies}</span>
              </div>
              {project.description && (
                <p className="text-sm opacity-80 mt-1">{project.description}</p>
              )}
              {project.link && (
                <a
                  href={project.link}
                  className="text-sm underline"
                  style={{ color: appliedStyles.accentColor }}
                >
                  View Project
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-sm uppercase tracking-wider opacity-75 mb-3 font-semibold"
            style={{ color: appliedStyles.accentColor }}
          >
            Certifications
          </h2>
          {certifications.map((cert, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <strong className="text-base">{cert.name}</strong>
                <span className="text-sm opacity-75">{cert.date}</span>
              </div>
              <p className="text-sm opacity-80">{cert.issuer}</p>
              {cert.credentialId && (
                <p className="text-xs opacity-75 mt-1">ID: {cert.credentialId}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Awards */}
      {awards.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-sm uppercase tracking-wider opacity-75 mb-3 font-semibold"
            style={{ color: appliedStyles.accentColor }}
          >
            Awards & Honors
          </h2>
          {awards.map((award, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <strong className="text-base">{award.name}</strong>
                <span className="text-sm opacity-75">{award.date}</span>
              </div>
              <p className="text-sm opacity-80">{award.issuer}</p>
              {award.description && (
                <p className="text-sm opacity-80 mt-1">{award.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-sm uppercase tracking-wider opacity-75 mb-3 font-semibold"
            style={{ color: appliedStyles.accentColor }}
          >
            Languages
          </h2>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang, i) => (
              <span key={i} className="text-sm bg-gray-100 px-2 py-1 rounded">
                {lang.name} ({lang.proficiency})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Volunteer Experience */}
      {volunteer.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-sm uppercase tracking-wider opacity-75 mb-3 font-semibold"
            style={{ color: appliedStyles.accentColor }}
          >
            Volunteer Experience
          </h2>
          {volunteer.map((vol, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <strong className="text-base">{vol.role}</strong>
                <span className="text-sm opacity-75">{vol.startDate} - {vol.endDate}</span>
              </div>
              <p className="text-sm opacity-80">{vol.organization}</p>
              {vol.description && (
                <p className="text-sm opacity-80 mt-1">{vol.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Publications */}
      {publications.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-sm uppercase tracking-wider opacity-75 mb-3 font-semibold"
            style={{ color: appliedStyles.accentColor }}
          >
            Publications
          </h2>
          {publications.map((pub, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <strong className="text-base">"{pub.title}"</strong>
                <span className="text-sm opacity-75">{pub.date}</span>
              </div>
              <p className="text-sm opacity-80">{pub.journal}</p>
              {pub.link && (
                <a
                  href={pub.link}
                  className="text-sm underline"
                  style={{ color: appliedStyles.accentColor }}
                >
                  View Publication
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Professional Memberships */}
      {memberships.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-sm uppercase tracking-wider opacity-75 mb-3 font-semibold"
            style={{ color: appliedStyles.accentColor }}
          >
            Professional Memberships
          </h2>
          {memberships.map((mem, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <strong className="text-base">{mem.role}</strong>
                <span className="text-sm opacity-75">{mem.startDate} - {mem.endDate}</span>
              </div>
              <p className="text-sm opacity-80">{mem.organization}</p>
            </div>
          ))}
        </div>
      )}

      {/* Interests */}
      {interests.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-sm uppercase tracking-wider opacity-75 mb-3 font-semibold"
            style={{ color: appliedStyles.accentColor }}
          >
            Interests
          </h2>
          <p className="text-sm opacity-80">{interests.join(", ")}</p>
        </div>
      )}

      {/* Links */}
      {(links.linkedin || links.github || links.portfolio || links.website) && (
        <div className="mb-6">
          <h2
            className="text-sm uppercase tracking-wider opacity-75 mb-3 font-semibold"
            style={{ color: appliedStyles.accentColor }}
          >
            Professional Links
          </h2>
          <div className="text-sm opacity-80">
            {links.linkedin && <div>LinkedIn: {links.linkedin}</div>}
            {links.github && <div>GitHub: {links.github}</div>}
            {links.portfolio && <div>Portfolio: {links.portfolio}</div>}
            {links.website && <div>Website: {links.website}</div>}
          </div>
        </div>
      )}

      {/* References */}
      {references.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-sm uppercase tracking-wider opacity-75 mb-3 font-semibold"
            style={{ color: appliedStyles.accentColor }}
          >
            References
          </h2>
          {references.map((ref, i) => (
            <div key={i} className="mb-3">
              <strong className="text-base">{ref.name}</strong>
              <p className="text-sm opacity-80">{ref.position} at {ref.company}</p>
              <p className="text-sm opacity-75">
                {ref.email} | {ref.phone}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Custom Sections */}
      {customSections.length > 0 && (
        customSections.map((section, i) => (
          <div key={i} className="mb-6">
            <h2
              className="text-sm uppercase tracking-wider opacity-75 mb-3 font-semibold"
              style={{ color: appliedStyles.accentColor }}
            >
              {section.title}
            </h2>
            <p className="text-sm opacity-80">{section.content}</p>
          </div>
        ))
      )}
    </div>
  );
}