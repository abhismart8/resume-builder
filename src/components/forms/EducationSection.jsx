"use client";

import { useState } from "react";

export function EducationSection({ education, onChange }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    degree: "",
    school: "",
    field: "",
    graduationDate: "",
  });

  const addEducation = () => {
    if (formData.degree && formData.school) {
      onChange([...education, formData]);
      setFormData({
        degree: "",
        school: "",
        field: "",
        graduationDate: "",
      });
      setShowForm(false);
    }
  };

  const removeEducation = (index) => {
    onChange(education.filter((_, i) => i !== index));
  };

  const updateEducation = (index, field, value) => {
    const updated = [...education];
    updated[index][field] = value;
    onChange(updated);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-2xl font-bold mb-4">Education</h2>

      {education.map((edu, index) => (
        <div key={index} className="border border-gray-200 p-4 rounded mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Degree</label>
              <input
                type="text"
                value={edu.degree || ""}
                onChange={(e) => updateEducation(index, "degree", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="e.g., Bachelor of Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">School</label>
              <input
                type="text"
                value={edu.school || ""}
                onChange={(e) => updateEducation(index, "school", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="e.g., University Name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Field of Study</label>
              <input
                type="text"
                value={edu.field || ""}
                onChange={(e) => updateEducation(index, "field", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="e.g., Computer Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Graduation Date</label>
              <input
                type="month"
                value={edu.graduationDate || ""}
                onChange={(e) => updateEducation(index, "graduationDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <button
            onClick={() => removeEducation(index)}
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
          + Add Education
        </button>
      )}

      {showForm && (
        <div className="border border-gray-200 p-4 rounded mb-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Degree</label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="e.g., Bachelor of Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">School</label>
              <input
                type="text"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="e.g., University Name"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={addEducation}
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
