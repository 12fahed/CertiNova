/**
 * Validation utilities for certificate configuration
 */

// Valid field names allowed in certificate configuration
export const VALID_FIELD_NAMES = [
  'recipientName',
  'organisationName', 
  'certificateLink',
  'certificateQR',
  'rank'
];

/**
 * Validate coordinate pair format and values
 * @param {Array} coordinates - Array of [x, y] coordinates
 * @param {string} fieldName - Name of the field being validated
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateCoordinates = (coordinates, fieldName) => {
  // If the field is not provided (undefined or null), it's valid - will be removed
  if (coordinates === undefined || coordinates === null) {
    return { isValid: true, error: null };
  }
  
  if (!Array.isArray(coordinates)) {
    return {
      isValid: false,
      error: `Field ${fieldName} must be an array`
    };
  }

  if (coordinates.length !== 2) {
    return {
      isValid: false,
      error: `Field ${fieldName} must have exactly 2 coordinates [x, y]`
    };
  }

  if (!coordinates.every(coord => typeof coord === 'number')) {
    return {
      isValid: false,
      error: `Field ${fieldName} coordinates must be numbers`
    };
  }

  if (coordinates.some(coord => coord < 0)) {
    return {
      isValid: false,
      error: `Field ${fieldName} coordinates must be non-negative`
    };
  }

  if (coordinates.some(coord => !Number.isFinite(coord))) {
    return {
      isValid: false,
      error: `Field ${fieldName} coordinates must be finite numbers`
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate entire validFields object
 * @param {Object} validFields - Object containing field coordinates
 * @returns {Object} - { isValid: boolean, errors: Array }
 */
export const validateValidFields = (validFields) => {
  const errors = [];
  
  if (!validFields || typeof validFields !== 'object') {
    return {
      isValid: false,
      errors: ['validFields must be an object']
    };
  }

  const providedFields = Object.keys(validFields);
  
  if (providedFields.length === 0) {
    return {
      isValid: false,
      errors: ['At least one valid field must be provided']
    };
  }

  // Check for invalid field names
  const invalidFields = providedFields.filter(field => !VALID_FIELD_NAMES.includes(field));
  if (invalidFields.length > 0) {
    errors.push(`Invalid field names: ${invalidFields.join(', ')}. Allowed fields: ${VALID_FIELD_NAMES.join(', ')}`);
  }

  // Validate each field's coordinates
  for (const field of providedFields) {
    if (VALID_FIELD_NAMES.includes(field)) {
      const validation = validateCoordinates(validFields[field], field);
      if (!validation.isValid) {
        errors.push(validation.error);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate ObjectId format
 * @param {string} id - ObjectId string to validate
 * @returns {boolean} - True if valid ObjectId format
 */
export const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};
