"use client";

import { useState } from "react";

export function SkillsSection({ skills, onChange, errors }) {
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim()) {
      onChange([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-2xl font-bold mb-4">Skills</h2>
      
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addSkill()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded"
            placeholder="e.g., React, JavaScript, Design"
          />
          <button
            onClick={addSkill}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
          >
            <span>{skill}</span>
            <button
              onClick={() => removeSkill(index)}
              className="text-blue-600 hover:text-blue-800 font-bold"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
