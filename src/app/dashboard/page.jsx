"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    const res = await fetch("/api/resumes", { cache: "no-store" });
    const data = await res.json();
    setResumes(data.resumes || []);
    setLoading(false);
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
        <div className="grid grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <div key={resume._id} className="card p-5 flex flex-col justify-between">
              <div>
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

              <div className="mt-4 flex gap-4">
                <Link
                  href={`/builder/${resume.templateId}?resumeId=${resume._id}`}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Open
                </Link>

                <button
                  onClick={() => deleteResume(resume._id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
