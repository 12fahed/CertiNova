import CertificateConfig from '../models/CertificateConfig.js';
import GeneratedCertificate from '../models/GeneratedCertificate.js';
import Event from '../models/Event.js';
import mongoose from 'mongoose';
import { validateValidFields, isValidObjectId } from '../utils/validation.js';

// @desc    Add certificate configuration
// @route   POST /api/certificates/addCertificateConfig
// @access  Protected (should be protected later with JWT)
export const addCertificateConfig = async (req, res) => {
  try {
    const { eventId, imagePath, validFields } = req.body;
    console.log('=== ADD CERTIFICATE CONFIG REQUEST ===');
    console.log('eventId:', eventId);
    console.log('imagePath:', imagePath);
    console.log('validFields:', JSON.stringify(validFields, null, 2));
    
    // Validation
    if (!eventId || !imagePath || !validFields) {
      console.log('Missing required fields - eventId:', !!eventId, 'imagePath:', !!imagePath, 'validFields:', !!validFields);
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
    console.log('Starting validFields validation...');
    const validation = validateValidFields(validFields);
    console.log('Validation result:', validation);
    
    if (!validation.isValid) {
      console.log('Validation failed with errors:', validation.errors);
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
        // Filter out any invalid field objects
        Object.entries(validFields).filter(([_, fieldObj]) => 
          fieldObj && 
          typeof fieldObj === 'object' && 
          !Array.isArray(fieldObj) &&
          typeof fieldObj.x === 'number' && 
          typeof fieldObj.y === 'number' && 
          typeof fieldObj.width === 'number' && 
          typeof fieldObj.height === 'number' &&
          fieldObj.x >= 0 && 
          fieldObj.y >= 0 && 
          fieldObj.width > 0 && 
          fieldObj.height > 0
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
      // Validate validFields structure using the updated validation
      const validation = validateValidFields(validFields);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: validation.errors
        });
      }

      // Filter out any invalid field objects before saving
      certificateConfig.validFields = Object.fromEntries(
        Object.entries(validFields).filter(([_, fieldObj]) => 
          fieldObj && 
          typeof fieldObj === 'object' && 
          !Array.isArray(fieldObj) &&
          typeof fieldObj.x === 'number' && 
          typeof fieldObj.y === 'number' && 
          typeof fieldObj.width === 'number' && 
          typeof fieldObj.height === 'number' &&
          fieldObj.x >= 0 && 
          fieldObj.y >= 0 && 
          fieldObj.width > 0 && 
          fieldObj.height > 0
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

// @desc    Store generated certificate data
// @route   POST /api/certificates/storeGenerated
// @access  Protected (should be protected later with JWT)
export const storeGeneratedCertificate = async (req, res) => {
  try {
    const { certificateId, recipients, generatedBy } = req.body;
    console.log('=== STORE GENERATED CERTIFICATE REQUEST ===');
    console.log('certificateId:', certificateId);
    console.log('recipients count:', recipients?.length);
    console.log('generatedBy:', generatedBy);
    
    // Validation
    if (!certificateId || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide certificateId and recipients array'
      });
    }

    if (!generatedBy) {
      return res.status(400).json({
        success: false,
        message: 'Please provide generatedBy (user ID)'
      });
    }

    // Validate certificateId format
    if (!isValidObjectId(certificateId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid certificate ID format'
      });
    }

    // Validate generatedBy format
    if (!isValidObjectId(generatedBy)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Check if certificate config exists
    const certificateConfig = await CertificateConfig.findById(certificateId);
    if (!certificateConfig) {
      return res.status(404).json({
        success: false,
        message: 'Certificate configuration not found'
      });
    }

    // Check if rank coordinates exist in certificate config
    const hasRankCoordinates = !!(certificateConfig.validFields && certificateConfig.validFields.rank);

    // Validate and process recipients
    const processedRecipients = [];
    let hasRankData = false;

    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];
      
      if (!recipient.name || typeof recipient.name !== 'string' || recipient.name.trim() === '') {
        return res.status(400).json({
          success: false,
          message: `Recipient at index ${i} must have a valid name`
        });
      }

      // Validate email if provided
      if (recipient.email && typeof recipient.email === 'string') {
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(recipient.email.trim())) {
          return res.status(400).json({
            success: false,
            message: `Invalid email format for recipient at index ${i}`
          });
        }
      }

      const processedRecipient = {
        name: recipient.name.trim(),
        email: recipient.email ? recipient.email.trim().toLowerCase() : undefined
      };

      // Only include rank if coordinates exist and data is provided
      if (hasRankCoordinates && recipient.rank && typeof recipient.rank === 'string' && recipient.rank.trim() !== '') {
        processedRecipient.rank = recipient.rank.trim();
        hasRankData = true;
      }

      processedRecipients.push(processedRecipient);
    }

    // Create the generated certificate record
    const generatedCertificate = new GeneratedCertificate({
      certificateId,
      noOfRecipient: processedRecipients.length,
      rank: hasRankData,
      recipients: processedRecipients,
      generatedBy
    });

    await generatedCertificate.save();

    console.log('Generated certificate stored successfully:', generatedCertificate._id);

    res.status(201).json({
      success: true,
      message: 'Generated certificate data stored successfully',
      data: {
        id: generatedCertificate._id,
        certificateId: generatedCertificate.certificateId,
        noOfRecipient: generatedCertificate.noOfRecipient,
        rank: generatedCertificate.rank,
        date: generatedCertificate.date,
        recipients: generatedCertificate.recipients
      }
    });

  } catch (error) {
    console.error('Store generated certificate error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to store generated certificate data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
