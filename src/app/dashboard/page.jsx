"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareLinks, setShareLinks] = useState({});
  const [copyNotification, setCopyNotification] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    const res = await fetch("/api/resumes", { cache: "no-store" });
    const data = await res.json();
    setResumes(data.resumes || []);
    
    // Fetch share links for each resume
    if (data.resumes) {
      data.resumes.forEach((resume) => {
        fetchShareLink(resume._id);
      });
    }
    setLoading(false);
  };

  const fetchShareLink = async (resumeId) => {
    try {
      const res = await fetch(`/api/resumes/${resumeId}/share`);
      const data = await res.json();
      if (data.success) {
        setShareLinks((prev) => ({
          ...prev,
          [resumeId]: data,
        }));
      }
    } catch (error) {
      console.error("Error fetching share link:", error);
    }
  };

  const generateShareLink = async (resumeId) => {
    try {
      const res = await fetch(`/api/resumes/${resumeId}/share`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setShareLinks((prev) => ({
          ...prev,
          [resumeId]: data,
        }));
        showCopyNotification("Share link generated!");
      }
    } catch (error) {
      alert("Error generating share link: " + error.message);
    }
  };

  const revokeShareLink = async (resumeId) => {
    if (!confirm("Are you sure you want to revoke this share link?")) return;

    try {
      const res = await fetch(`/api/resumes/${resumeId}/share`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setShareLinks((prev) => ({
          ...prev,
          [resumeId]: { shareableLink: null, isPublic: false },
        }));
        showCopyNotification("Share link revoked!");
      }
    } catch (error) {
      alert("Error revoking share link: " + error.message);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showCopyNotification("Link copied to clipboard!");
  };

  const showCopyNotification = (message) => {
    setCopyNotification(message);
    setTimeout(() => setCopyNotification(null), 3000);
  };

  const deleteResume = async (id) => {
    const confirmed = confirm("Delete this resume permanently?");
    if (!confirmed) return;

    const res = await fetch(`/api/resumes/${id}`, {
      method: "DELETE",
    });

    const result = await res.json();

    if (!result.success) {
      alert("Delete failed: " + result.error);
      return;
    }

    setResumes((prev) => prev.filter((r) => r._id !== id));
  };

  if (loading) {
    return <div className="p-6">Loading resumes...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* NOTIFICATION */}
      {copyNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {copyNotification}
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Resumes</h1>

        {/* ✅ ADD RESUME BUTTON */}
        <Link
          href="/templates"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + Add Resume
        </Link>
      </div>

      {/* CONTENT */}
      {resumes.length === 0 ? (
        <div className="bg-white p-8 rounded-lg border text-center text-gray-500">
          No resumes yet. Click <b>Add Resume</b> to create one.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {resumes.map((resume) => {
            const shareInfo = shareLinks[resume._id];
            const hasShareLink = shareInfo?.shareableLink;
            const fullShareUrl = shareInfo?.shareUrl
              ? `${typeof window !== "undefined" ? window.location.origin : ""}${shareInfo.shareUrl}`
              : null;

            return (
              <div key={resume._id} className="card p-6 flex flex-col">
                {/* Resume Info */}
                <div className="mb-4">
                  <h2 className="font-semibold text-lg">
                    {resume.personal?.name || "Untitled Resume"}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Template: {resume.templateId}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    Created: {new Date(resume.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Share Link Section */}
                <div className="border-t pt-4 mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Public Share Link
                  </p>
                  {hasShareLink ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                        <input
                          type="text"
                          value={fullShareUrl}
                          readOnly
                          className="flex-1 bg-transparent text-xs text-gray-700 outline-none"
                        />
                        <button
                          onClick={() => copyToClipboard(fullShareUrl)}
                          className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                          title="Copy link"
                        >
                          📋
                        </button>
                      </div>
                      <button
                        onClick={() => revokeShareLink(resume._id)}
                        className="w-full text-xs text-red-600 hover:text-red-700 font-medium py-1"
                      >
                        Revoke Access
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => generateShareLink(resume._id)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-2 rounded"
                    >
                      Generate Share Link
                    </button>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    href={`/builder/${resume.templateId}?resumeId=${resume._id}`}
                    className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded"
                  >
                    Open
                  </Link>

                  <button
                    onClick={() => deleteResume(resume._id)}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 text-sm py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
