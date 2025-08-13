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

// Valid font families (matching frontend exactly)
export const VALID_FONT_FAMILIES = [
    'Inter',
    'Roboto', 
    'Open Sans',
    'Montserrat',
    'Arial',
    'Times New Roman',
    'Helvetica',
    'Georgia',
    'Verdana',
    'Trebuchet MS',
    'Comic Sans MS',
    'Impact',
    'Lucida Console',
    'Tahoma',
    'Poppins',
    'Lato',
    'Playfair Display',
    'Raleway',
    'Nunito',
    'Oswald',
    'Source Sans 3',
    'Ubuntu',
    'Merriweather',
    'Noto Sans',
    'Rubik',
    'Fira Sans',
    'Dosis',
    'Archivo',
    'Cabin',
    'Quicksand',
    'Josefin Sans',
    'Work Sans',
    'Manrope',
    'Dancing Script',
    'Pacifico',
    'Great Vibes',
    'Allura',
    'Lobster',
    'Satisfy',
    'Cookie',
    'Tangerine',
    'Parisienne',
    'Sacramento',
    'Alex Brush',
    'Mr Dafoe',
    'Zeyada',
    'Petit Formal Script',
    'Qwigley',
    'Rouge Script',
    'Herr Von Muellerhoff',
];

/**
 * Validate field object format and values
 * @param {Object} field - Field object with coordinates and styling
 * @param {string} fieldName - Name of the field being validated
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateField = (field, fieldName) => {
  // If the field is not provided (undefined or null), it's valid - will be removed
  if (field === undefined || field === null) {
    return { isValid: true, error: null };
  }
  
  if (typeof field !== 'object' || Array.isArray(field)) {
    return {
      isValid: false,
      error: `Field ${fieldName} must be an object`
    };
  }

  // Validate required coordinate properties
  const requiredProps = ['x', 'y', 'width', 'height'];
  for (const prop of requiredProps) {
    if (typeof field[prop] !== 'number') {
      return {
        isValid: false,
        error: `Field ${fieldName}.${prop} must be a number`
      };
    }
    
    if (!Number.isFinite(field[prop])) {
      return {
        isValid: false,
        error: `Field ${fieldName}.${prop} must be a finite number`
      };
    }
  }

  // Validate coordinate values
  if (field.x < 0 || field.y < 0) {
    return {
      isValid: false,
      error: `Field ${fieldName} x and y coordinates must be non-negative`
    };
  }

  if (field.width <= 0 || field.height <= 0) {
    return {
      isValid: false,
      error: `Field ${fieldName} width and height must be positive`
    };
  }

  // Validate optional styling properties
  if (field.fontFamily !== undefined) {
    if (typeof field.fontFamily !== 'string' || !VALID_FONT_FAMILIES.includes(field.fontFamily)) {
      return {
        isValid: false,
        error: `Field ${fieldName}.fontFamily must be one of: ${VALID_FONT_FAMILIES.join(', ')}`
      };
    }
  }

  if (field.fontWeight !== undefined) {
    if (!['normal', 'bold'].includes(field.fontWeight)) {
      return {
        isValid: false,
        error: `Field ${fieldName}.fontWeight must be 'normal' or 'bold'`
      };
    }
  }

  if (field.fontStyle !== undefined) {
    if (!['normal', 'italic'].includes(field.fontStyle)) {
      return {
        isValid: false,
        error: `Field ${fieldName}.fontStyle must be 'normal' or 'italic'`
      };
    }
  }

  if (field.textDecoration !== undefined) {
    if (!['none', 'underline'].includes(field.textDecoration)) {
      return {
        isValid: false,
        error: `Field ${fieldName}.textDecoration must be 'none' or 'underline'`
      };
    }
  }

  if (field.color !== undefined) {
    if (typeof field.color !== 'string') {
      return {
        isValid: false,
        error: `Field ${fieldName}.color must be a string`
      };
    }
    
    // Validate hex color code format
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(field.color)) {
      return {
        isValid: false,
        error: `Field ${fieldName}.color must be a valid hex color code (e.g., #000000 or #000)`
      };
    }
  }

  return { isValid: true, error: null };
};

/**
 * Validate entire validFields object
 * @param {Object} validFields - Object containing field objects
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

  // Validate each field object
  for (const field of providedFields) {
    if (VALID_FIELD_NAMES.includes(field)) {
      const validation = validateField(validFields[field], field);
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
