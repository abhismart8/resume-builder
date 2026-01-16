"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import DynamicTemplate from "@/components/templates/DynamicTemplate";

export default function PublicResumePage() {
  const params = useParams();
  const router = useRouter();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        
        // Extract shareLink from params
        const shareLink = Array.isArray(params?.shareLink) 
          ? params.shareLink[0] 
          : params?.shareLink;

        if (!shareLink) {
          // Redirect to home if no share link
          setTimeout(() => router.push("/"), 2000);
          return;
        }

        const url = `/api/public/resume/${encodeURIComponent(shareLink)}`;
        const response = await fetch(url);
        
        const data = await response.json();

        if (!response.ok || !data.success) {
          // Redirect to home after showing message
          setTimeout(() => router.push("/"), 3000);
          return;
        }

        setResume(data.resume);
      } catch (err) {
        console.error("Error fetching resume:", err);
        // Redirect to home on error
        setTimeout(() => router.push("/"), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [params, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="mb-4">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="mb-4">
            <div className="text-5xl mb-4">📋</div>
            <h1 className="text-xl font-semibold text-gray-800 mb-2">Resume Not Found</h1>
            <p className="text-gray-600 text-sm mb-4">
              This resume link may have expired or is no longer available.
            </p>
            <p className="text-gray-500 text-xs mb-4">
              Redirecting you to home in a moment...
            </p>
          </div>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold text-gray-800">
            {resume.personal?.name || "Resume"}
          </h1>
          <a
            href="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back Home
          </a>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-8">
          <DynamicTemplate
            data={resume}
            templateId={resume.templateId}
            isPreview={true}
          />
        </div>
      </div>
    </div>
  );
}
