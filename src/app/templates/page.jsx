"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import AdminTemplateManager from "@/components/AdminTemplateManager";

export default function TemplatesPage() {
  const { data: session, status } = useSession();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/templates");
      const data = await res.json();

      if (data.success) {
        setTemplates(data.templates);
      } else {
        setError(data.error || "Failed to load templates");
      }
    } catch (err) {
      setError("Failed to load templates");
      console.error("Error fetching templates:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter templates based on category and search
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get unique categories
  const categories = ["All", ...new Set(templates.map(t => t.category))];

  // Get category colors
  const getCategoryColor = (category) => {
    const colors = {
      'Professional': 'bg-blue-100 text-blue-800 border-blue-200',
      'Creative': 'bg-purple-100 text-purple-800 border-purple-200',
      'Minimalist': 'bg-gray-100 text-gray-800 border-gray-200',
      'Executive': 'bg-amber-100 text-amber-800 border-amber-200',
      'Technology': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'Academic': 'bg-green-100 text-green-800 border-green-200',
      'General': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️ {error}</div>
          <button
            onClick={fetchTemplates}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Template
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select from our professionally designed templates to create a resume that stands out
          </p>

          {status === 'authenticated' && session?.user?.role === "admin" && (
            <div className="mt-6">
              <button
                onClick={() => setShowAdminModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200"
              >
                ⚙️ Manage Templates (Admin)
              </button>
            </div>
          )}
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search templates by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredTemplates.length} of {templates.length} templates
            {selectedCategory !== "All" && (
              <span> in <span className="font-medium">{selectedCategory}</span></span>
            )}
            {searchTerm && (
              <span> matching "<span className="font-medium">{searchTerm}</span>"</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Template Preview/Thumbnail */}
              <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">
                {template.thumbnail ? (
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${
                      template.category === 'Professional' ? 'bg-blue-100' :
                      template.category === 'Creative' ? 'bg-purple-100' :
                      template.category === 'Minimalist' ? 'bg-gray-100' :
                      template.category === 'Executive' ? 'bg-amber-100' :
                      template.category === 'Technology' ? 'bg-cyan-100' :
                      template.category === 'Academic' ? 'bg-green-100' :
                      'bg-blue-100'
                    }`}>
                      <svg className={`w-8 h-8 ${
                        template.category === 'Professional' ? 'text-blue-600' :
                        template.category === 'Creative' ? 'text-purple-600' :
                        template.category === 'Minimalist' ? 'text-gray-600' :
                        template.category === 'Executive' ? 'text-amber-600' :
                        template.category === 'Technology' ? 'text-cyan-600' :
                        template.category === 'Academic' ? 'text-green-600' :
                        'text-blue-600'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">{template.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{template.category}</p>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </span>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {template.name}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {template.description}
                  </p>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      ✓ Professional
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      ✓ Customizable
                    </span>
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      ✓ PDF Export
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  href={`/builder/${template.id}`}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform group-hover:scale-105 text-center block"
                >
                  Use This Template
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && templates.length > 0 ? (
          <div className="text-center py-16 col-span-full">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Templates Found</h3>
            <p className="text-gray-500 mb-4">
              No templates match your current search and filter criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : filteredTemplates.length === 0 && templates.length === 0 && (
          <div className="text-center py-16 col-span-full">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Templates Available</h3>
            <p className="text-gray-500">Check back later for new templates!</p>
          </div>
        )}
      </div>

      {/* Admin Template Manager Modal */}
      <AdminTemplateManager
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
      />
    </div>
  );
}
