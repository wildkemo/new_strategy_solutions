/**
 * Form Sanitization and Validation Utility
 * Provides comprehensive input sanitization and validation for all forms
 */

// HTML entities to escape
const htmlEntities = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;",
};

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} str - The string to sanitize
 * @returns {string} - Sanitized string
 */
export function sanitizeHtml(str) {
  if (typeof str !== "string") return str;
  return str.replace(/[&<>"'`=\/]/g, (char) => htmlEntities[char]);
}

/**
 * Sanitize and trim text input
 * @param {string} input - The input to sanitize
 * @returns {string} - Sanitized and trimmed string
 */
export function sanitizeText(input) {
  if (typeof input !== "string") return "";
  return sanitizeHtml(input.trim());
}

/**
 * Validate and sanitize email address
 * @param {string} email - Email to validate
 * @returns {object} - { isValid: boolean, sanitized: string, error: string }
 */
export function validateEmail(email) {
  const sanitized = sanitizeText(email);

  if (!sanitized) {
    return { isValid: false, sanitized: "", error: "Email is required" };
  }

  // RFC 5322 compliant email regex
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(sanitized)) {
    return { isValid: false, sanitized: "", error: "Invalid email format" };
  }

  // Check for suspicious patterns
  if (sanitized.length > 254) {
    return { isValid: false, sanitized: "", error: "Email too long" };
  }

  return { isValid: true, sanitized, error: "" };
}

/**
 * Validate and sanitize password
 * @param {string} password - Password to validate
 * @param {number} minLength - Minimum length (default: 8)
 * @returns {object} - { isValid: boolean, sanitized: string, error: string }
 */
export function validatePassword(password, minLength = 8) {
  const sanitized = sanitizeText(password);

  if (!sanitized) {
    return { isValid: false, sanitized: "", error: "Password is required" };
  }

  if (sanitized.length < minLength) {
    return {
      isValid: false,
      sanitized: "",
      error: `Password must be at least ${minLength} characters`,
    };
  }

  // Check for common weak passwords
  const weakPasswords = ["password", "123456", "qwerty", "admin", "letmein"];
  if (weakPasswords.includes(sanitized.toLowerCase())) {
    return { isValid: false, sanitized: "", error: "Password is too common" };
  }

  return { isValid: true, sanitized, error: "" };
}

/**
 * Validate and sanitize phone number
 * @param {string} phone - Phone number to validate
 * @returns {object} - { isValid: boolean, sanitized: string, error: string }
 */
export function validatePhone(phone) {
  const sanitized = sanitizeText(phone);

  if (!sanitized) {
    return { isValid: false, sanitized: "", error: "Phone number is required" };
  }

  // Remove all non-digit characters for validation
  const digitsOnly = sanitized.replace(/\D/g, "");

  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return {
      isValid: false,
      sanitized: "",
      error: "Invalid phone number format",
    };
  }

  return { isValid: true, sanitized, error: "" };
}

/**
 * Validate and sanitize name
 * @param {string} name - Name to validate
 * @returns {object} - { isValid: boolean, sanitized: string, error: string }
 */
export function validateName(name) {
  const sanitized = sanitizeText(name);

  if (!sanitized) {
    return { isValid: false, sanitized: "", error: "Name is required" };
  }

  if (sanitized.length < 2) {
    return {
      isValid: false,
      sanitized: "",
      error: "Name must be at least 2 characters",
    };
  }

  if (sanitized.length > 100) {
    return { isValid: false, sanitized: "", error: "Name too long" };
  }

  // Check for valid name characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
  if (!nameRegex.test(sanitized)) {
    return {
      isValid: false,
      sanitized: "",
      error: "Name contains invalid characters",
    };
  }

  return { isValid: true, sanitized, error: "" };
}

/**
 * Validate and sanitize company name
 * @param {string} companyName - Company name to validate
 * @returns {object} - { isValid: boolean, sanitized: string, error: string }
 */
export function validateCompanyName(companyName) {
  const sanitized = sanitizeText(companyName);

  if (!sanitized) {
    return { isValid: false, sanitized: "", error: "Company name is required" };
  }

  if (sanitized.length < 2) {
    return {
      isValid: false,
      sanitized: "",
      error: "Company name must be at least 2 characters",
    };
  }

  if (sanitized.length > 200) {
    return { isValid: false, sanitized: "", error: "Company name too long" };
  }

  return { isValid: true, sanitized, error: "" };
}

/**
 * Validate and sanitize OTP
 * @param {string} otp - OTP to validate
 * @returns {object} - { isValid: boolean, sanitized: string, error: string }
 */
export function validateOTP(otp) {
  const sanitized = sanitizeText(otp);

  if (!sanitized) {
    return { isValid: false, sanitized: "", error: "OTP is required" };
  }

  // OTP should be 6 digits
  const otpRegex = /^\d{6}$/;
  if (!otpRegex.test(sanitized)) {
    return { isValid: false, sanitized: "", error: "OTP must be 6 digits" };
  }

  return { isValid: true, sanitized, error: "" };
}

/**
 * Validate and sanitize service description
 * @param {string} description - Service description to validate
 * @returns {object} - { isValid: boolean, sanitized: string, error: string }
 */
export function validateServiceDescription(description) {
  const sanitized = sanitizeText(description);

  if (!sanitized) {
    return {
      isValid: false,
      sanitized: "",
      error: "Service description is required",
    };
  }

  if (sanitized.length < 10) {
    return {
      isValid: false,
      sanitized: "",
      error: "Service description must be at least 10 characters",
    };
  }

  if (sanitized.length > 2000) {
    return {
      isValid: false,
      sanitized: "",
      error: "Service description too long",
    };
  }

  return { isValid: true, sanitized, error: "" };
}

/**
 * Validate and sanitize service type
 * @param {string} serviceType - Service type to validate
 * @returns {object} - { isValid: boolean, sanitized: string, error: string }
 */
export function validateServiceType(serviceType) {
  const sanitized = sanitizeText(serviceType);

  if (!sanitized) {
    return { isValid: false, sanitized: "", error: "Service type is required" };
  }

  if (sanitized.length < 2) {
    return {
      isValid: false,
      sanitized: "",
      error: "Service type must be at least 2 characters",
    };
  }

  if (sanitized.length > 100) {
    return { isValid: false, sanitized: "", error: "Service type too long" };
  }

  return { isValid: true, sanitized, error: "" };
}

/**
 * Sanitize form data object
 * @param {object} formData - Form data to sanitize
 * @returns {object} - Sanitized form data
 */
export function sanitizeFormData(formData) {
  const sanitized = {};

  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeText(value);
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeFormData(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Validate registration form data
 * @param {object} formData - Registration form data
 * @returns {object} - { isValid: boolean, sanitized: object, errors: object }
 */
export function validateRegistrationForm(formData) {
  const errors = {};
  const sanitized = {};

  // Validate name
  const nameValidation = validateName(formData.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error;
  } else {
    sanitized.name = nameValidation.sanitized;
  }

  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  } else {
    sanitized.email = emailValidation.sanitized;
  }

  // Validate company name
  const companyValidation = validateCompanyName(formData.companyName);
  if (!companyValidation.isValid) {
    errors.companyName = companyValidation.error;
  } else {
    sanitized.companyName = companyValidation.sanitized;
  }

  // Validate phone
  const phoneValidation = validatePhone(formData.phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.error;
  } else {
    sanitized.phone = phoneValidation.sanitized;
  }

  // Validate password
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  } else {
    sanitized.password = passwordValidation.sanitized;
  }

  // Validate confirm password
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    sanitized,
    errors,
  };
}

/**
 * Validate login form data
 * @param {object} formData - Login form data
 * @returns {object} - { isValid: boolean, sanitized: object, errors: object }
 */
export function validateLoginForm(formData) {
  const errors = {};
  const sanitized = {};

  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  } else {
    sanitized.email = emailValidation.sanitized;
  }

  // Validate password
  if (!formData.password) {
    errors.password = "Password is required";
  } else {
    sanitized.password = formData.password; // Don't sanitize password for login
  }

  return {
    isValid: Object.keys(errors).length === 0,
    sanitized,
    errors,
  };
}

/**
 * Validate service request form data
 * @param {object} formData - Service request form data
 * @returns {object} - { isValid: boolean, sanitized: object, errors: object }
 */
export function validateServiceRequestForm(formData) {
  const errors = {};
  const sanitized = {};

  // Validate name
  const nameValidation = validateName(formData.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error;
  } else {
    sanitized.name = nameValidation.sanitized;
  }

  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  } else {
    sanitized.email = emailValidation.sanitized;
  }

  // Validate phone
  const phoneValidation = validatePhone(formData.phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.error;
  } else {
    sanitized.phone = phoneValidation.sanitized;
  }

  // Validate service type
  const serviceTypeValidation = validateServiceType(formData.serviceType);
  if (!serviceTypeValidation.isValid) {
    errors.serviceType = serviceTypeValidation.error;
  } else {
    sanitized.serviceType = serviceTypeValidation.sanitized;
  }

  // Validate description
  const descriptionValidation = validateServiceDescription(
    formData.description
  );
  if (!descriptionValidation.isValid) {
    errors.description = descriptionValidation.error;
  } else {
    sanitized.description = descriptionValidation.sanitized;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    sanitized,
    errors,
  };
}

/**
 * Validate password reset form data
 * @param {object} formData - Password reset form data
 * @returns {object} - { isValid: boolean, sanitized: object, errors: object }
 */
export function validatePasswordResetForm(formData) {
  const errors = {};
  const sanitized = {};

  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  } else {
    sanitized.email = emailValidation.sanitized;
  }

  // Validate OTP
  const otpValidation = validateOTP(formData.otp);
  if (!otpValidation.isValid) {
    errors.otp = otpValidation.error;
  } else {
    sanitized.otp = otpValidation.sanitized;
  }

  // Validate new password
  const passwordValidation = validatePassword(formData.newPassword, 6);
  if (!passwordValidation.isValid) {
    errors.newPassword = passwordValidation.error;
  } else {
    sanitized.newPassword = passwordValidation.sanitized;
  }

  // Validate confirm password
  if (formData.newPassword !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    sanitized,
    errors,
  };
}

/**
 * Validate profile update form data
 * @param {object} formData - Profile update form data
 * @returns {object} - { isValid: boolean, sanitized: object, errors: object }
 */
export function validateProfileUpdateForm(formData) {
  const errors = {};
  const sanitized = {};

  // Validate name
  const nameValidation = validateName(formData.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error;
  } else {
    sanitized.name = nameValidation.sanitized;
  }

  // Validate company name (if provided)
  if (formData.company_name) {
    const companyValidation = validateCompanyName(formData.company_name);
    if (!companyValidation.isValid) {
      errors.company_name = companyValidation.error;
    } else {
      sanitized.company_name = companyValidation.sanitized;
    }
  }

  // Validate phone (if provided)
  if (formData.phone) {
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.error;
    } else {
      sanitized.phone = phoneValidation.sanitized;
    }
  }

  // Validate new password (if provided)
  if (formData.password) {
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.error;
    } else {
      sanitized.password = passwordValidation.sanitized;
    }

    // Check if new password matches current password
    if (formData.password === formData.currentPassword) {
      errors.password = "New password must be different from current password";
    }
  }

  // Validate current password
  if (!formData.currentPassword) {
    errors.currentPassword = "Current password is required";
  } else {
    sanitized.currentPassword = formData.currentPassword; // Don't sanitize password
  }

  return {
    isValid: Object.keys(errors).length === 0,
    sanitized,
    errors,
  };
}

/**
 * Validate admin creation form data
 * @param {object} formData - Admin creation form data
 * @returns {object} - { isValid: boolean, sanitized: object, errors: object }
 */
export function validateAdminForm(formData) {
  const errors = {};
  const sanitized = {};

  // Validate name
  const nameValidation = validateName(formData.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error;
  } else {
    sanitized.name = nameValidation.sanitized;
  }

  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  } else {
    sanitized.email = emailValidation.sanitized;
  }

  // Validate password
  const passwordValidation = validatePassword(formData.password, 6);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  } else {
    sanitized.password = passwordValidation.sanitized;
  }

  // Validate confirm password
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    sanitized,
    errors,
  };
}
