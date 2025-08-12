import CertificateConfig from '../models/CertificateConfig.js';
import Event from '../models/Event.js';
import mongoose from 'mongoose';
import { validateValidFields, isValidObjectId } from '../utils/validation.js';

// @desc    Add certificate configuration
// @route   POST /api/certificates/addCertificateConfig
// @access  Protected (should be protected later with JWT)
export const addCertificateConfig = async (req, res) => {
  try {
    const { eventId, imagePath, validFields } = req.body;
    console.log(eventId,  " " , imagePath, " ", validFields)
    // Validation
    if (!eventId || !imagePath || !validFields) {
      return res.status(400).json({
        success: false,
        message: 'Please provide eventId, imagePath, and validFields'
      });
    }

    // Validate eventId format
    if (!isValidObjectId(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    // Check if event exists
    const eventExists = await Event.findById(eventId);
    if (!eventExists) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Validate validFields structure
    const validation = validateValidFields(validFields);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validation.errors
      });
    }

    // Check if certificate config already exists for this event
    const existingConfig = await CertificateConfig.findOne({ eventId });
    if (existingConfig) {
      return res.status(400).json({
        success: false,
        message: 'Certificate configuration already exists for this event'
      });
    }

    // Create new certificate configuration
    const certificateConfig = new CertificateConfig({
      eventId,
      imagePath,
      validFields: Object.fromEntries(
        // Filter out any empty arrays or invalid coordinates
        Object.entries(validFields).filter(([_, coords]) => 
          Array.isArray(coords) && 
          coords.length === 4 && 
          coords.slice(0, 2).every(c => typeof c === 'number' && !isNaN(c) && c >= 0) &&
          coords.slice(2, 4).every(c => typeof c === 'number' && !isNaN(c) && c > 0)
        )
      )
    });

    await certificateConfig.save();

    // Populate event details for response
    await certificateConfig.populate('eventId', 'eventName organisation issuerName');

    res.status(201).json({
      success: true,
      message: 'Certificate configuration created successfully',
      data: {
        certificateConfig: {
          id: certificateConfig._id,
          eventId: certificateConfig.eventId,
          imagePath: certificateConfig.imagePath,
          validFields: certificateConfig.validFields,
          createdAt: certificateConfig.createdAt,
          updatedAt: certificateConfig.updatedAt
        }
      }
    });

  } catch (error) {
    console.error('Add certificate config error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get certificate configuration by event ID
// @route   GET /api/certificates/config/:eventId
// @access  Protected (should be protected later with JWT)
export const getCertificateConfig = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Validate eventId format
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    const certificateConfig = await CertificateConfig.findOne({ eventId })
      .populate('eventId', 'eventName organisation issuerName organisationID');

    if (!certificateConfig) {
      return res.status(404).json({
        success: false,
        message: 'Certificate configuration not found for this event'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Certificate configuration retrieved successfully',
      data: {
        certificateConfig
      }
    });

  } catch (error) {
    console.error('Get certificate config error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Update certificate configuration
// @route   PUT /api/certificates/config/:configId
// @access  Protected (should be protected later with JWT)
export const updateCertificateConfig = async (req, res) => {
  try {
    const { configId } = req.params;
    const { imagePath, validFields } = req.body;

    // Validate configId format
    if (!mongoose.Types.ObjectId.isValid(configId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid configuration ID format'
      });
    }

    const certificateConfig = await CertificateConfig.findById(configId);
    if (!certificateConfig) {
      return res.status(404).json({
        success: false,
        message: 'Certificate configuration not found'
      });
    }

    // Update fields if provided
    if (imagePath) {
      certificateConfig.imagePath = imagePath;
    }

    if (validFields) {
      // Validate validFields structure (same validation as in addCertificateConfig)
      const allowedFields = ['recipientName', 'organisationName', 'certificateLink', 'certificateQR', 'rank'];
      const providedFields = Object.keys(validFields);
      
      for (const field of providedFields) {
        if (!allowedFields.includes(field)) {
          return res.status(400).json({
            success: false,
            message: `Invalid field: ${field}. Allowed fields are: ${allowedFields.join(', ')}`
          });
        }

        const coordinates = validFields[field];
        if (coordinates === null || coordinates === undefined) {
          // This is fine - field will be removed
          continue;
        }

        if (!Array.isArray(coordinates) || coordinates.length !== 4) {
          return res.status(400).json({
            success: false,
            message: `Field ${field} must be an array with exactly 4 numbers [x, y, width, height]`
          });
        }

        if (!coordinates.every(coord => typeof coord === 'number')) {
          return res.status(400).json({
            success: false,
            message: `Field ${field} coordinates must be numbers`
          });
        }

        if (coordinates.slice(0, 2).some(coord => coord < 0)) {
          return res.status(400).json({
            success: false,
            message: `Field ${field} x and y coordinates must be non-negative`
          });
        }

        if (coordinates.slice(2, 4).some(coord => coord <= 0)) {
          return res.status(400).json({
            success: false,
            message: `Field ${field} width and height must be positive`
          });
        }
      }

      // Filter out any invalid coordinates before saving
      certificateConfig.validFields = Object.fromEntries(
        Object.entries(validFields).filter(([_, coords]) => 
          Array.isArray(coords) && 
          coords.length === 4 && 
          coords.slice(0, 2).every(c => typeof c === 'number' && !isNaN(c) && c >= 0) &&
          coords.slice(2, 4).every(c => typeof c === 'number' && !isNaN(c) && c > 0)
        )
      );
    }

    await certificateConfig.save();
    await certificateConfig.populate('eventId', 'eventName organisation issuerName');

    res.status(200).json({
      success: true,
      message: 'Certificate configuration updated successfully',
      data: {
        certificateConfig
      }
    });

  } catch (error) {
    console.error('Update certificate config error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Upload certificate template image
// @route   POST /api/certificates/upload-template
// @access  Protected (should be protected later with JWT)
export const uploadCertificateTemplate = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please select a certificate template image.'
      });
    }

    // Generate the file URL
    const fileUrl = `/uploads/${req.file.filename}`;
    const fullPath = `${req.protocol}://${req.get('host')}${fileUrl}`;

    res.status(200).json({
      success: true,
      message: 'Certificate template uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: fileUrl,
        fullUrl: fullPath,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });

  } catch (error) {
    console.error('Upload certificate template error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to upload certificate template',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
