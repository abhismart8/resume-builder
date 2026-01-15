"use client";

import { useState, useEffect, useRef } from "react";

export default function ResumeForm({ formData, setFormData, onAutoSave }) {
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const autoSaveTimeoutRef = useRef(null);

  // Ensure formData has all required properties with defaults
  const safeFormData = formData || {
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
  };

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      if (onAutoSave && Object.keys(safeFormData).length > 0) {
        handleAutoSave();
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [safeFormData]);

  const handleAutoSave = async () => {
    setSaving(true);
    try {
      await onAutoSave(safeFormData);
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setSaving(false);
    }
  };

  // Form validation
  const validateField = (field, value, section = null, index = null) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Full name is required';
        } else if (value.trim().length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else {
          delete newErrors.name;
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
      case 'phone':
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (value && !phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
          newErrors.phone = 'Please enter a valid phone number';
        } else {
          delete newErrors.phone;
        }
        break;
      case 'skill':
        if (section === 'skills' && index !== null) {
          const skillErrors = newErrors.skills || [];
          if (!value.trim()) {
            skillErrors[index] = 'Skill cannot be empty';
          } else if (value.trim().length < 2) {
            skillErrors[index] = 'Skill must be at least 2 characters';
          } else {
            skillErrors[index] = undefined;
          }
          // Remove undefined entries
          newErrors.skills = skillErrors.filter(error => error !== undefined);
          if (newErrors.skills.length === 0) {
            delete newErrors.skills;
          }
        }
        break;
      case 'role':
        if (section === 'experience' && index !== null) {
          const expErrors = newErrors.experience || [];
          if (!value.trim()) {
            expErrors[index] = expErrors[index] || {};
            expErrors[index].role = 'Job title is required';
          } else {
            if (expErrors[index]) {
              delete expErrors[index].role;
              if (Object.keys(expErrors[index]).length === 0) {
                expErrors[index] = undefined;
              }
            }
          }
          newErrors.experience = expErrors.filter(error => error !== undefined);
          if (newErrors.experience.length === 0) {
            delete newErrors.experience;
          }
        }
        break;
      case 'company':
        if (section === 'experience' && index !== null) {
          const expErrors = newErrors.experience || [];
          if (!value.trim()) {
            expErrors[index] = expErrors[index] || {};
            expErrors[index].company = 'Company name is required';
          } else {
            if (expErrors[index]) {
              delete expErrors[index].company;
              if (Object.keys(expErrors[index]).length === 0) {
                expErrors[index] = undefined;
              }
            }
          }
          newErrors.experience = expErrors.filter(error => error !== undefined);
          if (newErrors.experience.length === 0) {
            delete newErrors.experience;
          }
        }
        break;
      case 'degree':
        if (section === 'education' && index !== null) {
          const eduErrors = newErrors.education || [];
          if (!value.trim()) {
            eduErrors[index] = eduErrors[index] || {};
            eduErrors[index].degree = 'Degree is required';
          } else {
            if (eduErrors[index]) {
              delete eduErrors[index].degree;
              if (Object.keys(eduErrors[index]).length === 0) {
                eduErrors[index] = undefined;
              }
            }
          }
          newErrors.education = eduErrors.filter(error => error !== undefined);
          if (newErrors.education.length === 0) {
            delete newErrors.education;
          }
        }
        break;
      case 'institution':
        if (section === 'education' && index !== null) {
          const eduErrors = newErrors.education || [];
          if (!value.trim()) {
            eduErrors[index] = eduErrors[index] || {};
            eduErrors[index].school = 'School name is required';
          } else {
            if (eduErrors[index]) {
              delete eduErrors[index].school;
              if (Object.keys(eduErrors[index]).length === 0) {
                eduErrors[index] = undefined;
              }
            }
          }
          newErrors.education = eduErrors.filter(error => error !== undefined);
          if (newErrors.education.length === 0) {
            delete newErrors.education;
          }
        }
        break;
      case 'projectName':
        if (section === 'projects' && index !== null) {
          const projErrors = newErrors.projects || [];
          if (!value.trim()) {
            projErrors[index] = projErrors[index] || {};
            projErrors[index].name = 'Project name is required';
          } else {
            if (projErrors[index]) {
              delete projErrors[index].name;
              if (Object.keys(projErrors[index]).length === 0) {
                projErrors[index] = undefined;
              }
            }
          }
          newErrors.projects = projErrors.filter(error => error !== undefined);
          if (newErrors.projects.length === 0) {
            delete newErrors.projects;
          }
        }
        break;
      case 'certificationName':
        if (section === 'certifications' && index !== null) {
          const certErrors = newErrors.certifications || [];
          if (!value.trim()) {
            certErrors[index] = certErrors[index] || {};
            certErrors[index].name = 'Certification name is required';
          } else {
            if (certErrors[index]) {
              delete certErrors[index].name;
              if (Object.keys(certErrors[index]).length === 0) {
                certErrors[index] = undefined;
              }
            }
          }
          newErrors.certifications = certErrors.filter(error => error !== undefined);
          if (newErrors.certifications.length === 0) {
            delete newErrors.certifications;
          }
        }
        break;
      case 'awardName':
        if (section === 'awards' && index !== null) {
          const awardErrors = newErrors.awards || [];
          if (!value.trim()) {
            awardErrors[index] = awardErrors[index] || {};
            awardErrors[index].name = 'Award name is required';
          } else {
            if (awardErrors[index]) {
              delete awardErrors[index].name;
              if (Object.keys(awardErrors[index]).length === 0) {
                awardErrors[index] = undefined;
              }
            }
          }
          newErrors.awards = awardErrors.filter(error => error !== undefined);
          if (newErrors.awards.length === 0) {
            delete newErrors.awards;
          }
        }
        break;
      case 'languageName':
        if (section === 'languages' && index !== null) {
          const langErrors = newErrors.languages || [];
          if (!value.trim()) {
            langErrors[index] = 'Language name is required';
          } else {
            langErrors[index] = undefined;
          }
          newErrors.languages = langErrors.filter(error => error !== undefined);
          if (newErrors.languages.length === 0) {
            delete newErrors.languages;
          }
        }
        break;
      case 'organization':
        if (section === 'volunteer' && index !== null) {
          const volErrors = newErrors.volunteer || [];
          if (!value.trim()) {
            volErrors[index] = volErrors[index] || {};
            volErrors[index].organization = 'Organization name is required';
          } else {
            if (volErrors[index]) {
              delete volErrors[index].organization;
              if (Object.keys(volErrors[index]).length === 0) {
                volErrors[index] = undefined;
              }
            }
          }
          newErrors.volunteer = volErrors.filter(error => error !== undefined);
          if (newErrors.volunteer.length === 0) {
            delete newErrors.volunteer;
          }
        }
        break;
      case 'referenceName':
        if (section === 'references' && index !== null) {
          const refErrors = newErrors.references || [];
          if (!value.trim()) {
            refErrors[index] = refErrors[index] || {};
            refErrors[index].name = 'Reference name is required';
          } else {
            if (refErrors[index]) {
              delete refErrors[index].name;
              if (Object.keys(refErrors[index]).length === 0) {
                refErrors[index] = undefined;
              }
            }
          }
          newErrors.references = refErrors.filter(error => error !== undefined);
          if (newErrors.references.length === 0) {
            delete newErrors.references;
          }
        }
        break;
      case 'publicationTitle':
        if (section === 'publications' && index !== null) {
          const pubErrors = newErrors.publications || [];
          if (!value.trim()) {
            pubErrors[index] = pubErrors[index] || {};
            pubErrors[index].title = 'Publication title is required';
          } else {
            if (pubErrors[index]) {
              delete pubErrors[index].title;
              if (Object.keys(pubErrors[index]).length === 0) {
                pubErrors[index] = undefined;
              }
            }
          }
          newErrors.publications = pubErrors.filter(error => error !== undefined);
          if (newErrors.publications.length === 0) {
            delete newErrors.publications;
          }
        }
        break;
      case 'membershipOrg':
        if (section === 'memberships' && index !== null) {
          const memErrors = newErrors.memberships || [];
          if (!value.trim()) {
            memErrors[index] = memErrors[index] || {};
            memErrors[index].organization = 'Organization name is required';
          } else {
            if (memErrors[index]) {
              delete memErrors[index].organization;
              if (Object.keys(memErrors[index]).length === 0) {
                memErrors[index] = undefined;
              }
            }
          }
          newErrors.memberships = memErrors.filter(error => error !== undefined);
          if (newErrors.memberships.length === 0) {
            delete newErrors.memberships;
          }
        }
        break;
      case 'interest':
        if (section === 'interests' && index !== null) {
          const interestErrors = newErrors.interests || [];
          if (!value.trim()) {
            interestErrors[index] = 'Interest cannot be empty';
          } else {
            interestErrors[index] = undefined;
          }
          newErrors.interests = interestErrors.filter(error => error !== undefined);
          if (newErrors.interests.length === 0) {
            delete newErrors.interests;
          }
        }
        break;
      case 'sectionTitle':
        if (section === 'customSections' && index !== null) {
          const sectionErrors = newErrors.customSections || [];
          if (!value.trim()) {
            sectionErrors[index] = sectionErrors[index] || {};
            sectionErrors[index].title = 'Section title is required';
          } else {
            if (sectionErrors[index]) {
              delete sectionErrors[index].title;
              if (Object.keys(sectionErrors[index]).length === 0) {
                sectionErrors[index] = undefined;
              }
            }
          }
          newErrors.customSections = sectionErrors.filter(error => error !== undefined);
          if (newErrors.customSections.length === 0) {
            delete newErrors.customSections;
          }
        }
        break;
      case 'summary':
        if (!value.trim()) {
          newErrors.summary = 'Professional summary is required';
        } else if (value.trim().length < 50) {
          newErrors.summary = 'Summary should be at least 50 characters';
        } else if (value.trim().length > 500) {
          newErrors.summary = 'Summary should not exceed 500 characters';
        } else {
          delete newErrors.summary;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };
  /* ---------- PERSONAL ---------- */
  const updatePersonal = (field, value) => {
    validateField(field, value);
    setFormData({
      ...safeFormData,
      personal: {
        ...safeFormData.personal,
        [field]: value,
      },
    });
  };

  /* ---------- SKILLS ---------- */
  const addSkill = () => {
    setFormData({ ...safeFormData, skills: [...(safeFormData.skills || []), ""] });
  };

  const updateSkill = (index, value) => {
    validateField('skill', value, 'skills', index);
    const updated = [...(safeFormData.skills || [])];
    updated[index] = value;
    setFormData({ ...safeFormData, skills: updated });
  };

  const removeSkill = (index) => {
    setFormData({
      ...safeFormData,
      skills: (safeFormData.skills || []).filter((_, i) => i !== index),
    });
  };

  /* ---------- EXPERIENCE ---------- */
  const addExperience = () => {
    setFormData({
      ...safeFormData,
      experience: [
        ...(safeFormData.experience || []),
        { company: "", role: "", description: "", startDate: "", endDate: "" },
      ],
    });
  };

  const updateExperience = (index, field, value) => {
    // Validate specific fields
    if (field === 'role' || field === 'company') {
      validateField(field, value, 'experience', index);
    }
    const updated = [...(safeFormData.experience || [])];
    updated[index][field] = value;
    setFormData({ ...safeFormData, experience: updated });
  };

  const removeExperience = (index) => {
    setFormData({
      ...safeFormData,
      experience: (safeFormData.experience || []).filter((_, i) => i !== index),
    });
  };

  /* ---------- EDUCATION ---------- */
  const addEducation = () => {
    setFormData({
      ...safeFormData,
      education: [
        ...(safeFormData.education || []),
        { institution: "", degree: "", year: "" },
      ],
    });
  };

  const updateEducation = (index, field, value) => {
    // Validate specific fields
    if (field === 'degree' || field === 'institution') {
      validateField(field, value, 'education', index);
    }
    const updated = [...(safeFormData.education || [])];
    updated[index][field] = value;
    setFormData({ ...safeFormData, education: updated });
  };

  const removeEducation = (index) => {
    setFormData({
      ...safeFormData,
      education: (safeFormData.education || []).filter((_, i) => i !== index),
    });
  };

  /* ---------- PROJECTS ---------- */
  const addProject = () => {
    setFormData({
      ...safeFormData,
      projects: [
        ...(safeFormData.projects || []),
        { name: "", description: "", technologies: "", link: "" },
      ],
    });
  };

  const updateProject = (index, field, value) => {
    // Validate specific fields
    if (field === 'name') {
      validateField('projectName', value, 'projects', index);
    }
    const updated = [...(safeFormData.projects || [])];
    updated[index][field] = value;
    setFormData({ ...safeFormData, projects: updated });
  };

  const removeProject = (index) => {
    setFormData({
      ...safeFormData,
      projects: (safeFormData.projects || []).filter((_, i) => i !== index),
    });
  };

  /* ---------- CERTIFICATIONS ---------- */
  const addCertification = () => {
    setFormData({
      ...safeFormData,
      certifications: [
        ...(safeFormData.certifications || []),
        { name: "", issuer: "", date: "", credentialId: "" },
      ],
    });
  };

  const updateCertification = (index, field, value) => {
    // Validate specific fields
    if (field === 'name') {
      validateField('certificationName', value, 'certifications', index);
    }
    const updated = [...(safeFormData.certifications || [])];
    updated[index][field] = value;
    setFormData({ ...safeFormData, certifications: updated });
  };

  const removeCertification = (index) => {
    setFormData({
      ...safeFormData,
      certifications: (safeFormData.certifications || []).filter((_, i) => i !== index),
    });
  };

  /* ---------- AWARDS ---------- */
  const addAward = () => {
    setFormData({
      ...safeFormData,
      awards: [
        ...(safeFormData.awards || []),
        { name: "", issuer: "", date: "", description: "" },
      ],
    });
  };

  const updateAward = (index, field, value) => {
    // Validate specific fields
    if (field === 'name') {
      validateField('awardName', value, 'awards', index);
    }
    const updated = [...(safeFormData.awards || [])];
    updated[index][field] = value;
    setFormData({ ...safeFormData, awards: updated });
  };

  const removeAward = (index) => {
    setFormData({
      ...safeFormData,
      awards: (safeFormData.awards || []).filter((_, i) => i !== index),
    });
  };

  /* ---------- LANGUAGES ---------- */
  const addLanguage = () => {
    setFormData({
      ...safeFormData,
      languages: [
        ...(safeFormData.languages || []),
        { name: "", proficiency: "" },
      ],
    });
  };

  const updateLanguage = (index, field, value) => {
    // Validate specific fields
    if (field === 'name') {
      validateField('languageName', value, 'languages', index);
    }
    const updated = [...(safeFormData.languages || [])];
    updated[index][field] = value;
    setFormData({ ...safeFormData, languages: updated });
  };

  const removeLanguage = (index) => {
    setFormData({
      ...safeFormData,
      languages: (safeFormData.languages || []).filter((_, i) => i !== index),
    });
  };

  /* ---------- VOLUNTEER ---------- */
  const addVolunteer = () => {
    setFormData({
      ...safeFormData,
      volunteer: [
        ...(safeFormData.volunteer || []),
        { organization: "", role: "", description: "", startDate: "", endDate: "" },
      ],
    });
  };

  const updateVolunteer = (index, field, value) => {
    // Validate specific fields
    if (field === 'organization') {
      validateField('organization', value, 'volunteer', index);
    }
    const updated = [...(safeFormData.volunteer || [])];
    updated[index][field] = value;
    setFormData({ ...safeFormData, volunteer: updated });
  };

  const removeVolunteer = (index) => {
    setFormData({
      ...safeFormData,
      volunteer: (safeFormData.volunteer || []).filter((_, i) => i !== index),
    });
  };

  /* ---------- REFERENCES ---------- */
  const addReference = () => {
    setFormData({
      ...safeFormData,
      references: [
        ...(safeFormData.references || []),
        { name: "", position: "", company: "", email: "", phone: "" },
      ],
    });
  };

  const updateReference = (index, field, value) => {
    // Validate specific fields
    if (field === 'name') {
      validateField('referenceName', value, 'references', index);
    }
    const updated = [...(safeFormData.references || [])];
    updated[index][field] = value;
    setFormData({ ...safeFormData, references: updated });
  };

  const removeReference = (index) => {
    setFormData({
      ...safeFormData,
      references: (safeFormData.references || []).filter((_, i) => i !== index),
    });
  };

  /* ---------- PUBLICATIONS ---------- */
  const addPublication = () => {
    setFormData({
      ...safeFormData,
      publications: [
        ...(safeFormData.publications || []),
        { title: "", journal: "", date: "", link: "" },
      ],
    });
  };

  const updatePublication = (index, field, value) => {
    // Validate specific fields
    if (field === 'title') {
      validateField('publicationTitle', value, 'publications', index);
    }
    const updated = [...(safeFormData.publications || [])];
    updated[index][field] = value;
    setFormData({ ...safeFormData, publications: updated });
  };

  const removePublication = (index) => {
    setFormData({
      ...safeFormData,
      publications: (safeFormData.publications || []).filter((_, i) => i !== index),
    });
  };

  /* ---------- MEMBERSHIPS ---------- */
  const addMembership = () => {
    setFormData({
      ...safeFormData,
      memberships: [
        ...(safeFormData.memberships || []),
        { organization: "", role: "", startDate: "", endDate: "" },
      ],
    });
  };

  const updateMembership = (index, field, value) => {
    // Validate specific fields
    if (field === 'organization') {
      validateField('membershipOrg', value, 'memberships', index);
    }
    const updated = [...(safeFormData.memberships || [])];
    updated[index][field] = value;
    setFormData({ ...safeFormData, memberships: updated });
  };

  const removeMembership = (index) => {
    setFormData({
      ...safeFormData,
      memberships: (safeFormData.memberships || []).filter((_, i) => i !== index),
    });
  };

  /* ---------- INTERESTS ---------- */
  const addInterest = () => {
    setFormData({ ...safeFormData, interests: [...(safeFormData.interests || []), ""] });
  };

  const updateInterest = (index, value) => {
    validateField('interest', value, 'interests', index);
    const updated = [...(safeFormData.interests || [])];
    updated[index] = value;
    setFormData({ ...safeFormData, interests: updated });
  };

  const removeInterest = (index) => {
    setFormData({
      ...safeFormData,
      interests: (safeFormData.interests || []).filter((_, i) => i !== index),
    });
  };

  /* ---------- LINKS ---------- */
  const updateLinks = (field, value) => {
    setFormData({
      ...safeFormData,
      links: {
        ...(safeFormData.links || {}),
        [field]: value,
      },
    });
  };

  /* ---------- CUSTOM SECTIONS ---------- */
  const addCustomSection = () => {
    setFormData({
      ...safeFormData,
      customSections: [
        ...(safeFormData.customSections || []),
        { title: "", content: "" },
      ],
    });
  };

  const updateCustomSection = (index, field, value) => {
    // Validate specific fields
    if (field === 'title') {
      validateField('sectionTitle', value, 'customSections', index);
    }
    const updated = [...(safeFormData.customSections || [])];
    updated[index][field] = value;
    setFormData({ ...safeFormData, customSections: updated });
  };

  const removeCustomSection = (index) => {
    setFormData({
      ...safeFormData,
      customSections: (safeFormData.customSections || []).filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-10">

      {/* PERSONAL DETAILS */}
      <section className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Personal Details</h2>
          {saving && (
            <div className="flex items-center text-sm text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Auto-saving...
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              className={`input ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Full Name *"
              value={safeFormData.personal.name || ''}
              onChange={(e) => updatePersonal("name", e.target.value)}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <input
              type="email"
              className={`input ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Email *"
              value={safeFormData.personal.email || ''}
              onChange={(e) => updatePersonal("email", e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <input
              type="tel"
              className={`input ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Phone"
              value={safeFormData.personal.phone || ''}
              onChange={(e) => updatePersonal("phone", e.target.value)}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
          <input
            className="input"
            placeholder="Location"
            value={safeFormData.personal.location || ''}
            onChange={(e) => updatePersonal("location", e.target.value)}
          />
        </div>

        <div className="mt-4">
          <textarea
            className={`input ${errors.summary ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Professional Summary (2-3 sentences about your experience and goals)"
            rows={4}
            value={safeFormData.summary || ''}
            onChange={(e) => {
              validateField('summary', e.target.value);
              setFormData({ ...safeFormData, summary: e.target.value });
            }}
          />
          {errors.summary && <p className="text-red-500 text-sm mt-1">{errors.summary}</p>}
          <p className="text-sm text-gray-500 mt-1">
            {safeFormData.summary?.length || 0}/500 characters
          </p>
        </div>
      </section>

      {/* SKILLS */}
      <section className="card p-6">
        <h2 className="section-title">Skills</h2>

        {(formData.skills || []).map((skill, i) => (
          <div key={i} className="mb-3">
            <div className="flex items-center gap-2">
              <input
                className={`input flex-1 ${errors.skills && errors.skills[i] ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="e.g. React, Node.js"
                value={skill}
                onChange={(e) => updateSkill(i, e.target.value)}
              />
              <button
                onClick={() => removeSkill(i)}
                className="text-gray-400 hover:text-red-500"
                title="Remove skill"
              >
                ✕
              </button>
            </div>
            {errors.skills && errors.skills[i] && (
              <p className="text-red-500 text-sm mt-1">{errors.skills[i]}</p>
            )}
          </div>
        ))}

        <button
          onClick={addSkill}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          + Add skill
        </button>
      </section>

      {/* EXPERIENCE */}
      <section className="card p-6">
        <h2 className="section-title">Experience</h2>

        {(formData.experience || []).map((exp, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="mb-3">
              <input
                className={`input ${errors.experience && errors.experience[i] && errors.experience[i].company ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Company"
                value={exp.company}
                onChange={(e) =>
                  updateExperience(i, "company", e.target.value)
                }
              />
              {errors.experience && errors.experience[i] && errors.experience[i].company && (
                <p className="text-red-500 text-sm mt-1">{errors.experience[i].company}</p>
              )}
            </div>
            <div className="mb-3">
              <input
                className={`input ${errors.experience && errors.experience[i] && errors.experience[i].role ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Role"
                value={exp.role}
                onChange={(e) =>
                  updateExperience(i, "role", e.target.value)
                }
              />
              {errors.experience && errors.experience[i] && errors.experience[i].role && (
                <p className="text-red-500 text-sm mt-1">{errors.experience[i].role}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <input
                type="date"
                className="input"
                value={exp.startDate}
                onChange={(e) =>
                  updateExperience(i, "startDate", e.target.value)
                }
              />
              <input
                type="date"
                className="input"
                value={exp.endDate}
                onChange={(e) =>
                  updateExperience(i, "endDate", e.target.value)
                }
              />
            </div>
            <textarea
              className="input"
              placeholder="Describe your responsibilities and impact"
              value={exp.description}
              onChange={(e) =>
                updateExperience(i, "description", e.target.value)
              }
            />
            <button
              onClick={() => removeExperience(i)}
              className="mt-2 text-sm text-red-500 hover:text-red-600"
            >
              Remove experience
            </button>
          </div>
        ))}

        <button
          onClick={addExperience}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          + Add experience
        </button>
      </section>

      {/* EDUCATION */}
      <section className="card p-6">
        <h2 className="section-title">Education</h2>

        {(formData.education || []).map((edu, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="mb-3">
              <input
                className={`input ${errors.education && errors.education[i] && errors.education[i].school ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Institution"
                value={edu.institution}
                onChange={(e) =>
                  updateEducation(i, "institution", e.target.value)
                }
              />
              {errors.education && errors.education[i] && errors.education[i].school && (
                <p className="text-red-500 text-sm mt-1">{errors.education[i].school}</p>
              )}
            </div>
            <div className="mb-3">
              <input
                className={`input ${errors.education && errors.education[i] && errors.education[i].degree ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) =>
                  updateEducation(i, "degree", e.target.value)
                }
              />
              {errors.education && errors.education[i] && errors.education[i].degree && (
                <p className="text-red-500 text-sm mt-1">{errors.education[i].degree}</p>
              )}
            </div>
            <input
              className="input"
              placeholder="Year"
              value={edu.year}
              onChange={(e) =>
                updateEducation(i, "year", e.target.value)
              }
            />
            <button
              onClick={() => removeEducation(i)}
              className="mt-2 text-sm text-red-500 hover:text-red-600"
            >
              Remove education
            </button>
          </div>
        ))}

        <button
          onClick={addEducation}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          + Add education
        </button>
      </section>

      {/* PROJECTS */}
      <section className="card p-6">
        <h2 className="section-title">Projects</h2>

        {(safeFormData.projects || []).map((project, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="mb-3">
              <input
                className={`input ${errors.projects && errors.projects[i] && errors.projects[i].name ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Project Name"
                value={project.name}
                onChange={(e) =>
                  updateProject(i, "name", e.target.value)
                }
              />
              {errors.projects && errors.projects[i] && errors.projects[i].name && (
                <p className="text-red-500 text-sm mt-1">{errors.projects[i].name}</p>
              )}
            </div>
            <textarea
              className="input mb-3"
              placeholder="Project Description"
              value={project.description}
              onChange={(e) =>
                updateProject(i, "description", e.target.value)
              }
            />
            <input
              className="input mb-3"
              placeholder="Technologies Used"
              value={project.technologies}
              onChange={(e) =>
                updateProject(i, "technologies", e.target.value)
              }
            />
            <input
              className="input"
              placeholder="Project Link (optional)"
              value={project.link}
              onChange={(e) =>
                updateProject(i, "link", e.target.value)
              }
            />
            <button
              onClick={() => removeProject(i)}
              className="mt-2 text-sm text-red-500 hover:text-red-600"
            >
              Remove project
            </button>
          </div>
        ))}

        <button
          onClick={addProject}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          + Add project
        </button>
      </section>

      {/* CERTIFICATIONS */}
      <section className="card p-6">
        <h2 className="section-title">Certifications</h2>

        {(safeFormData.certifications || []).map((cert, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="mb-3">
              <input
                className={`input ${errors.certifications && errors.certifications[i] && errors.certifications[i].name ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Certification Name"
                value={cert.name}
                onChange={(e) =>
                  updateCertification(i, "name", e.target.value)
                }
              />
              {errors.certifications && errors.certifications[i] && errors.certifications[i].name && (
                <p className="text-red-500 text-sm mt-1">{errors.certifications[i].name}</p>
              )}
            </div>
            <input
              className="input mb-3"
              placeholder="Issuing Organization"
              value={cert.issuer}
              onChange={(e) =>
                updateCertification(i, "issuer", e.target.value)
              }
            />
            <input
              type="date"
              className="input mb-3"
              value={cert.date}
              onChange={(e) =>
                updateCertification(i, "date", e.target.value)
              }
            />
            <input
              className="input"
              placeholder="Credential ID (optional)"
              value={cert.credentialId}
              onChange={(e) =>
                updateCertification(i, "credentialId", e.target.value)
              }
            />
            <button
              onClick={() => removeCertification(i)}
              className="mt-2 text-sm text-red-500 hover:text-red-600"
            >
              Remove certification
            </button>
          </div>
        ))}

        <button
          onClick={addCertification}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          + Add certification
        </button>
      </section>

      {/* AWARDS */}
      <section className="card p-6">
        <h2 className="section-title">Awards & Honors</h2>

        {(safeFormData.awards || []).map((award, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="mb-3">
              <input
                className={`input ${errors.awards && errors.awards[i] && errors.awards[i].name ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Award Name"
                value={award.name}
                onChange={(e) =>
                  updateAward(i, "name", e.target.value)
                }
              />
              {errors.awards && errors.awards[i] && errors.awards[i].name && (
                <p className="text-red-500 text-sm mt-1">{errors.awards[i].name}</p>
              )}
            </div>
            <input
              className="input mb-3"
              placeholder="Issuing Organization"
              value={award.issuer}
              onChange={(e) =>
                updateAward(i, "issuer", e.target.value)
              }
            />
            <input
              type="date"
              className="input mb-3"
              value={award.date}
              onChange={(e) =>
                updateAward(i, "date", e.target.value)
              }
            />
            <textarea
              className="input"
              placeholder="Description (optional)"
              value={award.description}
              onChange={(e) =>
                updateAward(i, "description", e.target.value)
              }
            />
            <button
              onClick={() => removeAward(i)}
              className="mt-2 text-sm text-red-500 hover:text-red-600"
            >
              Remove award
            </button>
          </div>
        ))}

        <button
          onClick={addAward}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          + Add award
        </button>
      </section>

      {/* LANGUAGES */}
      <section className="card p-6">
        <h2 className="section-title">Languages</h2>

        {(safeFormData.languages || []).map((lang, i) => (
          <div key={i} className="flex items-center gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <input
                className={`input ${errors.languages && errors.languages[i] ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Language (e.g. English, Spanish)"
                value={lang.name}
                onChange={(e) => updateLanguage(i, "name", e.target.value)}
              />
              {errors.languages && errors.languages[i] && (
                <p className="text-red-500 text-sm mt-1">{errors.languages[i]}</p>
              )}
            </div>
            <select
              className="input w-48 flex-shrink-0"
              value={lang.proficiency}
              onChange={(e) => updateLanguage(i, "proficiency", e.target.value)}
            >
              <option value="">Select Proficiency</option>
              <option value="Native">Native</option>
              <option value="Fluent">Fluent</option>
              <option value="Advanced">Advanced</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Basic">Basic</option>
            </select>
            <button
              onClick={() => removeLanguage(i)}
              className="text-gray-400 hover:text-red-500 flex-shrink-0 px-2"
              title="Remove language"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          onClick={addLanguage}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          + Add language
        </button>
      </section>

      {/* VOLUNTEER EXPERIENCE */}
      <section className="card p-6">
        <h2 className="section-title">Volunteer Experience</h2>

        {(formData.volunteer || []).map((vol, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 mb-4">
            <input
              className="input mb-3"
              placeholder="Organization"
              value={vol.organization}
              onChange={(e) =>
                updateVolunteer(i, "organization", e.target.value)
              }
            />
            <input
              className="input mb-3"
              placeholder="Role/Position"
              value={vol.role}
              onChange={(e) =>
                updateVolunteer(i, "role", e.target.value)
              }
            />
            <div className="grid grid-cols-2 gap-4 mb-3">
              <input
                type="date"
                className="input"
                value={vol.startDate}
                onChange={(e) =>
                  updateVolunteer(i, "startDate", e.target.value)
                }
              />
              <input
                type="date"
                className="input"
                value={vol.endDate}
                onChange={(e) =>
                  updateVolunteer(i, "endDate", e.target.value)
                }
              />
            </div>
            <textarea
              className="input"
              placeholder="Description of your volunteer work"
              value={vol.description}
              onChange={(e) =>
                updateVolunteer(i, "description", e.target.value)
              }
            />
            <button
              onClick={() => removeVolunteer(i)}
              className="mt-2 text-sm text-red-500 hover:text-red-600"
            >
              Remove volunteer experience
            </button>
          </div>
        ))}

        <button
          onClick={addVolunteer}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          + Add volunteer experience
        </button>
      </section>

      {/* REFERENCES */}
      <section className="card p-6">
        <h2 className="section-title">References</h2>

        {(formData.references || []).map((ref, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 mb-4">
            <input
              className="input mb-3"
              placeholder="Reference Name"
              value={ref.name}
              onChange={(e) =>
                updateReference(i, "name", e.target.value)
              }
            />
            <input
              className="input mb-3"
              placeholder="Position"
              value={ref.position}
              onChange={(e) =>
                updateReference(i, "position", e.target.value)
              }
            />
            <input
              className="input mb-3"
              placeholder="Company"
              value={ref.company}
              onChange={(e) =>
                updateReference(i, "company", e.target.value)
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                className="input"
                placeholder="Email"
                value={ref.email}
                onChange={(e) =>
                  updateReference(i, "email", e.target.value)
                }
              />
              <input
                className="input"
                placeholder="Phone"
                value={ref.phone}
                onChange={(e) =>
                  updateReference(i, "phone", e.target.value)
                }
              />
            </div>
            <button
              onClick={() => removeReference(i)}
              className="mt-2 text-sm text-red-500 hover:text-red-600"
            >
              Remove reference
            </button>
          </div>
        ))}

        <button
          onClick={addReference}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          + Add reference
        </button>
      </section>

      {/* PUBLICATIONS */}
      <section className="card p-6">
        <h2 className="section-title">Publications</h2>

        {(formData.publications || []).map((pub, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 mb-4">
            <input
              className="input mb-3"
              placeholder="Publication Title"
              value={pub.title}
              onChange={(e) =>
                updatePublication(i, "title", e.target.value)
              }
            />
            <input
              className="input mb-3"
              placeholder="Journal/Conference"
              value={pub.journal}
              onChange={(e) =>
                updatePublication(i, "journal", e.target.value)
              }
            />
            <input
              type="date"
              className="input mb-3"
              value={pub.date}
              onChange={(e) =>
                updatePublication(i, "date", e.target.value)
              }
            />
            <input
              className="input"
              placeholder="Link (optional)"
              value={pub.link}
              onChange={(e) =>
                updatePublication(i, "link", e.target.value)
              }
            />
            <button
              onClick={() => removePublication(i)}
              className="mt-2 text-sm text-red-500 hover:text-red-600"
            >
              Remove publication
            </button>
          </div>
        ))}

        <button
          onClick={addPublication}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          + Add publication
        </button>
      </section>

      {/* PROFESSIONAL MEMBERSHIPS */}
      <section className="card p-6">
        <h2 className="section-title">Professional Memberships</h2>

        {(formData.memberships || []).map((mem, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 mb-4">
            <input
              className="input mb-3"
              placeholder="Organization"
              value={mem.organization}
              onChange={(e) =>
                updateMembership(i, "organization", e.target.value)
              }
            />
            <input
              className="input mb-3"
              placeholder="Role/Position"
              value={mem.role}
              onChange={(e) =>
                updateMembership(i, "role", e.target.value)
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                className="input"
                value={mem.startDate}
                onChange={(e) =>
                  updateMembership(i, "startDate", e.target.value)
                }
              />
              <input
                type="date"
                className="input"
                value={mem.endDate}
                onChange={(e) =>
                  updateMembership(i, "endDate", e.target.value)
                }
              />
            </div>
            <button
              onClick={() => removeMembership(i)}
              className="mt-2 text-sm text-red-500 hover:text-red-600"
            >
              Remove membership
            </button>
          </div>
        ))}

        <button
          onClick={addMembership}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          + Add membership
        </button>
      </section>

      {/* INTERESTS */}
      <section className="card p-6">
        <h2 className="section-title">Interests & Hobbies</h2>

        {(formData.interests || []).map((interest, i) => (
          <div key={i} className="flex items-center gap-2 mb-3">
            <input
              className="input flex-1"
              placeholder="e.g. Reading, Photography, Sports"
              value={interest}
              onChange={(e) => updateInterest(i, e.target.value)}
            />
            <button
              onClick={() => removeInterest(i)}
              className="text-gray-400 hover:text-red-500"
              title="Remove interest"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          onClick={addInterest}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          + Add interest
        </button>
      </section>

      {/* LINKS */}
      <section className="card p-6">
        <h2 className="section-title">Professional Links</h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="LinkedIn Profile"
            value={safeFormData.links?.linkedin || ""}
            onChange={(e) => updateLinks("linkedin", e.target.value)}
          />
          <input
            className="input"
            placeholder="GitHub Profile"
            value={safeFormData.links?.github || ""}
            onChange={(e) => updateLinks("github", e.target.value)}
          />
          <input
            className="input"
            placeholder="Portfolio Website"
            value={safeFormData.links?.portfolio || ""}
            onChange={(e) => updateLinks("portfolio", e.target.value)}
          />
          <input
            className="input"
            placeholder="Personal Website"
            value={safeFormData.links?.website || ""}
            onChange={(e) => updateLinks("website", e.target.value)}
          />
        </div>
      </section>

      {/* CUSTOM SECTIONS */}
      <section className="card p-6">
        <h2 className="section-title">Custom Sections</h2>

        {(formData.customSections || []).map((section, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 mb-4">
            <input
              className="input mb-3"
              placeholder="Section Title"
              value={section.title}
              onChange={(e) =>
                updateCustomSection(i, "title", e.target.value)
              }
            />
            <textarea
              className="input"
              placeholder="Section Content"
              value={section.content}
              onChange={(e) =>
                updateCustomSection(i, "content", e.target.value)
              }
            />
            <button
              onClick={() => removeCustomSection(i)}
              className="mt-2 text-sm text-red-500 hover:text-red-600"
            >
              Remove section
            </button>
          </div>
        ))}

        <button
          onClick={addCustomSection}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          + Add custom section
        </button>
      </section>

    </div>
  );
}
