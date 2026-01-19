"use client";

import { useState } from "react";

export function ExperienceSection({ experience, onChange, errors }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const addExperience = () => {
    if (formData.role && formData.company) {
      onChange([...experience, formData]);
      setFormData({
        role: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      });
      setShowForm(false);
    }
  };

  const removeExperience = (index) => {
    onChange(experience.filter((_, i) => i !== index));
  };

  const updateExperience = (index, field, value) => {
    const updated = [...experience];
    updated[index][field] = value;
    onChange(updated);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-2xl font-bold mb-4">Work Experience</h2>

      {experience.map((exp, index) => (
        <div key={index} className="border border-gray-200 p-4 rounded mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Job Title</label>
              <input
                type="text"
                value={exp.role || ""}
                onChange={(e) => updateExperience(index, "role", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="e.g., Senior Developer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Company</label>
              <input
                type="text"
                value={exp.company || ""}
                onChange={(e) => updateExperience(index, "company", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="e.g., Tech Corp"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={exp.location || ""}
                onChange={(e) => updateExperience(index, "location", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="City, State"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="month"
                value={exp.startDate || ""}
                onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="month"
                value={exp.endDate || ""}
                onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={exp.description || ""}
              onChange={(e) => updateExperience(index, "description", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded h-24"
              placeholder="Describe your responsibilities and achievements..."
            />
          </div>

          <button
            onClick={() => removeExperience(index)}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Remove
          </button>
        </div>
      ))}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Add Experience
        </button>
      )}

      {showForm && (
        <div className="border border-gray-200 p-4 rounded mb-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Job Title</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="e.g., Senior Developer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Company</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="e.g., Tech Corp"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={addExperience}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
