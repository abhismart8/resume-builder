"use client";

export function SummarySection({ summary, onChange }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-2xl font-bold mb-4">Professional Summary</h2>
      
      <textarea
        value={summary || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded h-32"
        placeholder="Write a brief professional summary about yourself..."
      />
    </div>
  );
}
