// XSS Prevention and input sanitization

// Safe sanitization for user inputs (removes HTML tags)
export function sanitizeString(input) {
  if (typeof input !== 'string') return input;
  
  // Remove any HTML/script tags
  return input
    .replace(/<[^>]*>/g, '')
    .trim();
}

// Sanitize object recursively
export function sanitizeObject(obj) {
  if (obj === null || typeof obj !== 'object') {
    return sanitizeString(String(obj));
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      sanitized[key] = value;
    } else if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => sanitizeObject(item));
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

// Escape HTML entities
export function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Validate URL to prevent javascript: and data: protocols
export function isSafeUrl(url) {
  if (!url) return true;
  try {
    const parsed = new URL(url, 'http://localhost');
    return !['javascript:', 'data:', 'vbscript:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}
