"use client";

import { use, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import ResumeForm from "@/components/forms/ResumeForm";
import ResumePreview from "@/components/ResumePreview";

export default function BuilderPage({ params }) {
  const { templateId } = use(params);
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("resumeId");
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session === undefined) return;

    if (!session) {
      router.push("/login");
      return;
    }
  }, [session, router]);

  const [formData, setFormData] = useState({
    personal: {
      name: "",
      email: "",
      phone: "",
      location: "",
    },
    summary: "",
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    awards: [],
    languages: [],
    volunteer: [],
    references: [],
    interests: [],
    publications: [],
    memberships: [],
    links: {},
    customSections: [],
  });

  const [lastSaved, setLastSaved] = useState(null);
  const [saving, setSaving] = useState(false);

  // Auto-save function
  const handleAutoSave = async (data) => {
    if (!session?.user?.id) return;

    setSaving(true);
    try {
      const payload = {
        userId: session.user.id,
        templateId,
        ...data,
      };

      const url = resumeId ? `/api/resumes/${resumeId}` : "/api/resumes";
      const method = resumeId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setLastSaved(new Date());
        if (!resumeId && result.resume?._id) {
          // Update URL with resume ID for future saves
          window.history.replaceState(
            {},
            "",
            `/builder/${templateId}?resumeId=${result.resume._id}`
          );
        }
      }
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      setSaving(false);
    }
  };

  // Authentication check - redirect if not logged in
  useEffect(() => {
    if (session === undefined) return;

    if (!session) {
      router.push("/login");
      return;
    }
  }, [session, router]);

  // 🔥 LOAD RESUME FOR EDIT
  useEffect(() => {
    if (!resumeId) return;

    const fetchResume = async () => {
      const res = await fetch(`/api/resumes/${resumeId}`);
      const data = await res.json();

      if (data.success && data.resume) {
        setFormData({
          personal: data.resume.personal || {},
          summary: data.resume.summary || "",
          skills: data.resume.skills || [],
          experience: data.resume.experience || [],
          education: data.resume.education || [],
          projects: data.resume.projects || [],
          certifications: data.resume.certifications || [],
          awards: data.resume.awards || [],
          languages: data.resume.languages || [],
          volunteer: data.resume.volunteer || [],
          references: data.resume.references || [],
          interests: data.resume.interests || [],
          publications: data.resume.publications || [],
          memberships: data.resume.memberships || [],
          links: data.resume.links || {},
          customSections: data.resume.customSections || [],
        });
      }
    };

    fetchResume();
  }, [resumeId]);

  if (session === undefined) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return <div className="min-h-screen flex items-center justify-center">Redirecting to login...</div>;
  }

  // SAVE (CREATE NEW OR UPDATE LATER)
  const saveResume = async () => {
    const payload = {
      templateId,
      ...formData,
    };

    const url = resumeId
      ? `/api/resumes/${resumeId}`
      : `/api/resumes`;

    const method = resumeId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (result.success) {
      alert(resumeId ? "Resume updated ✅" : "Resume created ✅");
    } else {
      alert("Save failed ❌");
    }
  };

  const downloadPDF = async () => {
    try {
      if (typeof window === "undefined") return;

      // Show loading indicator
      const originalText = "Download PDF";
      const button = document.querySelector('button[onclick*="downloadPDF"]');
      if (button) {
        button.textContent = "Generating PDF...";
        button.disabled = true;
      }

      // Fetch template styles
      let templateStyles = {};
      try {
        const templateRes = await fetch(`/api/templates/${templateId}`);
        if (templateRes.ok) {
          const template = await templateRes.json();
          templateStyles = template.cssStyles || {};
        }
      } catch (error) {
        console.warn("Could not fetch template styles:", error);
      }

      // Get clean PDF HTML from API with template styles
      const response = await fetch('/api/resumes/download-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          data: formData,
          templateStyles: templateStyles
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF HTML');
      }

      const { html } = await response.json();

      // Load html2pdf library
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => {
        // Create a temporary container with the HTML
        const element = document.createElement('div');
        element.innerHTML = html;
        document.body.appendChild(element);

        // Configure html2pdf options
        const options = {
          margin: 0,
          filename: `resume-${new Date().toISOString().split('T')[0]}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
          },
          jsPDF: {
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true
          }
        };

        // Generate and download PDF
        window.html2pdf().set(options).from(element).save().then(() => {
          // Clean up
          document.body.removeChild(element);

          // Reset button
          if (button) {
            button.textContent = originalText;
            button.disabled = false;
          }

          alert("PDF downloaded successfully!");
        }).catch((error) => {
          console.error("PDF generation error:", error);
          document.body.removeChild(element);

          // Reset button on error
          if (button) {
            button.textContent = originalText;
            button.disabled = false;
          }

          alert("Failed to generate PDF. Please try again.");
        });
      };

      script.onerror = () => {
        console.error("Failed to load html2pdf library");
        if (button) {
          button.textContent = originalText;
          button.disabled = false;
        }
        alert("Failed to load PDF generation library. Please try again.");
      };

      document.head.appendChild(script);
    } catch (error) {
      console.error("PDF download error:", error);
      alert("Failed to generate PDF. Please try again.");

      // Reset button on error
      const button = document.querySelector('button[onclick*="downloadPDF"]');
      if (button) {
        button.textContent = "Download PDF";
        button.disabled = false;
      }
    }
  };

  return (
    <div className="h-screen flex bg-gray-100">

      {/* LEFT */}
      <div className="w-[45%] overflow-y-auto p-6 border-r">
        <ResumeForm
          formData={formData}
          setFormData={setFormData}
          onAutoSave={handleAutoSave}
        />
      </div>

      {/* RIGHT */}
      <div className="w-[55%] flex flex-col">
        <div className="flex justify-between items-center p-4 bg-white border-b">
          <div className="text-sm text-gray-600">
            {saving && (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Saving...
              </div>
            )}
            {lastSaved && !saving && (
              <div className="text-green-600">
                ✓ Saved {lastSaved.toLocaleTimeString()}
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={saveResume}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Save Resume
            </button>
            <button
              onClick={downloadPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Download PDF
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-200 flex justify-center py-10">
          <ResumePreview templateId={templateId} data={formData} />
        </div>
      </div>
    </div>
  );
}
