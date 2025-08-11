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
      validFields
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
        if (!Array.isArray(coordinates) || coordinates.length !== 2) {
          return res.status(400).json({
            success: false,
            message: `Field ${field} must be an array with exactly 2 numbers [x, y]`
          });
        }

        if (!coordinates.every(coord => typeof coord === 'number')) {
          return res.status(400).json({
            success: false,
            message: `Field ${field} coordinates must be numbers`
          });
        }

        if (coordinates.some(coord => coord < 0)) {
          return res.status(400).json({
            success: false,
            message: `Field ${field} coordinates must be non-negative`
          });
        }
      }

      certificateConfig.validFields = validFields;
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
