"use client";

import { useState } from "react";

export function PersonalSection({ data, onChange, errors }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input
            type="text"
            value={data.name || ""}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            className={`w-full px-3 py-2 border rounded ${errors?.name ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="John Doe"
          />
          {errors?.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={data.email || ""}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            className={`w-full px-3 py-2 border rounded ${errors?.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="john@example.com"
          />
          {errors?.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <input
            type="tel"
            value={data.phone || ""}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            className={`w-full px-3 py-2 border rounded ${errors?.phone ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="+1 (555) 123-4567"
          />
          {errors?.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <input
            type="text"
            value={data.location || ""}
            onChange={(e) => onChange({ ...data, location: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="City, State"
          />
        </div>
      </div>
    </div>
  );
}
