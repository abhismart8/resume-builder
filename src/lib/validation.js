// Request validation utilities
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  // Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 special char
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  return {
    isValid: minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar,
    errors: [
      !minLength && 'Password must be at least 8 characters',
      !hasUppercase && 'Password must contain an uppercase letter',
      !hasLowercase && 'Password must contain a lowercase letter',
      !hasNumber && 'Password must contain a number',
      !hasSpecialChar && 'Password must contain a special character (!@#$%^&*...)'
    ].filter(Boolean)
  };
}

export function validateSignupBody(body) {
  const errors = [];

  if (!body.email || typeof body.email !== 'string') {
    errors.push('Email is required and must be a string');
  } else if (!validateEmail(body.email)) {
    errors.push('Email format is invalid');
  }

  if (!body.password || typeof body.password !== 'string') {
    errors.push('Password is required and must be a string');
  } else {
    const passwordValidation = validatePassword(body.password);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateResumeBody(body) {
  const errors = [];

  if (!body.userId || typeof body.userId !== 'string') {
    errors.push('User ID is required');
  }

  if (body.templateId && typeof body.templateId !== 'string') {
    errors.push('Template ID must be a string');
  }

  // Validate personal info if present
  if (body.personal) {
    if (typeof body.personal !== 'object') {
      errors.push('Personal info must be an object');
    } else {
      if (body.personal.name && typeof body.personal.name !== 'string') {
        errors.push('Personal name must be a string');
      }
      if (body.personal.email && !validateEmail(body.personal.email)) {
        errors.push('Personal email is invalid');
      }
    }
  }

  // Validate arrays
  const arrayFields = ['skills', 'experience', 'education', 'projects', 'certifications', 'awards', 'languages', 'volunteer', 'references', 'interests', 'publications', 'memberships', 'customSections'];
  for (const field of arrayFields) {
    if (body[field] && !Array.isArray(body[field])) {
      errors.push(`${field} must be an array`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
