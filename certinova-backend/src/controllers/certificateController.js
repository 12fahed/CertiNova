import CertificateConfig from '../models/CertificateConfig.js';
import GeneratedCertificate from '../models/GeneratedCertificate.js';
import VerifyUUID from '../models/VerifyUUID.js';
import Event from '../models/Event.js';
import Record from '../models/Record.js';
import mongoose from 'mongoose';
import { validateValidFields, isValidObjectId } from '../utils/validation.js';
import { encryptData, decryptData, hashPassword } from '../utils/crypto.js';

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

    // With Cloudinary, req.file contains cloudinary info
    const cloudinaryUrl = req.file.path; // Cloudinary URL
    const publicId = req.file.public_id; // Cloudinary public ID

    res.status(200).json({
      success: true,
      message: 'Certificate template uploaded successfully to Cloudinary',
      data: {
        filename: req.file.filename || req.file.public_id,
        originalName: req.file.originalname,
        path: cloudinaryUrl,
        fullUrl: cloudinaryUrl,
        size: req.file.bytes,
        mimetype: req.file.mimetype,
        publicId: publicId,
        cloudinaryUrl: cloudinaryUrl
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

// @desc    Store generated certificate data with encryption
// @route   POST /api/certificates/storeGenerated
// @access  Protected (should be protected later with JWT)
export const storeGeneratedCertificate = async (req, res) => {
  try {
    const { certificateId, recipients, generatedBy, password } = req.body;
    console.log('=== STORE GENERATED CERTIFICATE REQUEST ===');
    console.log('certificateId:', certificateId);
    console.log('recipients count:', recipients?.length);
    console.log('generatedBy:', generatedBy);
    console.log('password provided:', !!password);
    
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

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password is required and must be at least 6 characters long'
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

      // Include UUID if provided
      if (recipient.uuid && typeof recipient.uuid === 'string' && recipient.uuid.trim() !== '') {
        console.log(recipient.uuid)
        processedRecipient.uuid = recipient.uuid.trim();
      }

      // Only include rank if coordinates exist and data is provided
      if (hasRankCoordinates && recipient.rank && typeof recipient.rank === 'string' && recipient.rank.trim() !== '') {
        processedRecipient.rank = recipient.rank.trim();
        hasRankData = true;
      }

      processedRecipients.push(processedRecipient);
    }

    // Encrypt the recipients data
    console.log('Encrypting recipients data...');
    const encryptedRecipients = encryptData(processedRecipients, password);
    console.log('Recipients data encrypted successfully');

    // Create the generated certificate record with encrypted data
    const generatedCertificate = new GeneratedCertificate({
      certificateId,
      noOfRecipient: processedRecipients.length,
      rank: hasRankData,
      encryptedRecipients,
      generatedBy
    });

    await generatedCertificate.save();

    console.log('Generated certificate stored successfully with encryption:', generatedCertificate._id);

    // Create UUID verification documents for each recipient with a UUID
    console.log('Creating UUID verification documents...');
    const uuidVerifications = [];
    
    for (const recipient of processedRecipients) {
      if (recipient.uuid) {
        try {
          const verifyUUID = new VerifyUUID({
            generatedCertificateId: generatedCertificate._id,
            uuid: recipient.uuid
          });
          
          const savedVerification = await verifyUUID.save();
          uuidVerifications.push(savedVerification);
          console.log(`UUID verification created for UUID: ${recipient.uuid}`);
        } catch (uuidError) {
          console.error(`Failed to create UUID verification for ${recipient.uuid}:`, uuidError);
          // Continue with other UUIDs even if one fails
        }
      }
    }
    
    console.log(`Created ${uuidVerifications.length} UUID verification documents`);

    // Update organization record with recipient count
    console.log('Updating organization record for recipient count...');
    try {
      // Get the event details to find organization name
      const event = await Event.findById(certificateConfig.eventId);
      if (event && event.organisation) {
        await Record.findOneAndUpdate(
          { organisationName: event.organisation },
          { 
            $inc: { recipientCount: processedRecipients.length },
            $setOnInsert: { 
              organisationName: event.organisation,
              eventsCreated: 0 
            }
          },
          { 
            upsert: true, 
            new: true,
            setDefaultsOnInsert: true 
          }
        );
        console.log(`✓ Recipient count increased by ${processedRecipients.length} for organization: ${event.organisation}`);
      } else {
        console.warn('Could not find organization name for recipient count tracking');
      }
    } catch (recordError) {
      console.error('Failed to update organization record for recipients:', recordError);
      // Don't fail the certificate creation if record update fails
    }

    res.status(201).json({
      success: true,
      message: 'Generated certificate data stored securely with encryption',
      data: {
        id: generatedCertificate._id,
        certificateId: generatedCertificate.certificateId,
        noOfRecipient: generatedCertificate.noOfRecipient,
        rank: generatedCertificate.rank,
        date: generatedCertificate.date,
        // Don't return encrypted data in response for security
        encrypted: true
      }
    });

  } catch (error) {
    console.error('Store generated certificate error:', error);

    if (error.message.includes('encrypt')) {
      return res.status(500).json({
        success: false,
        message: 'Failed to encrypt certificate data'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to store generated certificate data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get all generated certificates with pagination and filtering (returns encrypted data)
// @route   GET /api/certificates/generated
// @access  Protected (should be protected later with JWT)
export const getGeneratedCertificates = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      filter = 'all',
      sortBy = 'date',
      sortOrder = 'desc',
      generatedBy
    } = req.query;

    console.log('=== GET GENERATED CERTIFICATES REQUEST ===');
    console.log('Query parameters:', { page, limit, search, filter, sortBy, sortOrder, generatedBy });

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build filter query
    let filterQuery = {};
    const currentDate = new Date();
    
    // Add generatedBy filter if provided
    if (generatedBy) {
      if (!isValidObjectId(generatedBy)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid generatedBy user ID format'
        });
      }
      filterQuery.generatedBy = generatedBy;
    }
    
    switch (filter) {
      case 'recent':
        const sevenDaysAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        filterQuery.date = { $gte: sevenDaysAgo };
        break;
      case 'high-recipients':
        filterQuery.noOfRecipient = { $gt: 2 };
        break;
      case 'with-rank':
        filterQuery.rank = true;
        break;
      case 'without-rank':
        filterQuery.rank = false;
        break;
      default:
        // 'all' - no additional filter
        break;
    }

    // Build sort object
    let sortObject = {};
    switch (sortBy) {
      case 'date':
        sortObject.date = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'recipients':
        sortObject.noOfRecipient = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'certificateId':
        sortObject.certificateId = sortOrder === 'asc' ? 1 : -1;
        break;
      default:
        sortObject.date = -1; // Default sort by date descending
        break;
    }

    // Execute queries
    const [generatedCertificates, totalCount] = await Promise.all([
      GeneratedCertificate.find(filterQuery)
        .populate('certificateId', 'eventId imagePath')
        .populate({
          path: 'certificateId',
          populate: {
            path: 'eventId',
            select: 'eventName organisation issuerName'
          }
        })
        .populate('generatedBy', 'name email organisation')
        .sort(sortObject)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      GeneratedCertificate.countDocuments(filterQuery)
    ]);

    // For search, we need to handle it after getting all documents since we can't search encrypted data
    let filteredData = generatedCertificates;
    if (search && search.trim() !== '') {
      // Return empty results for search when data is encrypted
      // Frontend will need to use the decrypt endpoint with password to search
      console.log('Search requested but data is encrypted. Returning message.');
      return res.status(200).json({
        success: true,
        message: 'Search requires password to decrypt data. Please use the decrypt endpoint.',
        data: {
          certificates: [],
          pagination: {
            currentPage: pageNum,
            totalPages: 0,
            totalCount: 0,
            hasNextPage: false,
            hasPrevPage: false,
            limit: limitNum
          },
          requiresDecryption: true
        }
      });
    }

    // Transform data for frontend (without decrypted recipient data)
    const transformedData = filteredData.map((cert, index) => ({
      id: cert._id,
      serialNumber: skip + index + 1,
      date: cert.date,
      certificateId: cert.certificateId?.eventId?.eventName || 'Unknown Event',
      eventDetails: cert.certificateId?.eventId || null,
      recipients: [], // Don't return encrypted recipients
      noOfRecipient: cert.noOfRecipient || 0,
      rank: cert.rank || false,
      generatedId: cert._id.toString().slice(-8).toUpperCase(),
      generatedBy: cert.generatedBy || null,
      createdAt: cert.createdAt,
      updatedAt: cert.updatedAt,
      encrypted: true // Indicate that this data is encrypted
    }));

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    console.log(`Found ${totalCount} total certificates, returning ${transformedData.length} for page ${pageNum}`);

    res.status(200).json({
      success: true,
      message: 'Generated certificates retrieved successfully (encrypted)',
      data: {
        certificates: transformedData,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      }
    });

  } catch (error) {
    console.error('Get generated certificates error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve generated certificates',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Decrypt and get generated certificates with password
// @route   POST /api/certificates/generated/decrypt
// @access  Protected (should be protected later with JWT)
export const getDecryptedGeneratedCertificates = async (req, res) => {
  try {
    const { 
      password,
      page = 1, 
      limit = 10, 
      search = '', 
      filter = 'all',
      sortBy = 'date',
      sortOrder = 'desc',
      generatedBy
    } = req.body;

    console.log('=== DECRYPT GENERATED CERTIFICATES REQUEST ===');
    console.log('Query parameters:', { page, limit, search, filter, sortBy, sortOrder, generatedBy });

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Valid password is required for decryption'
      });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build filter query
    let filterQuery = {};
    const currentDate = new Date();
    
    // Add generatedBy filter if provided
    if (generatedBy) {
      if (!isValidObjectId(generatedBy)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid generatedBy user ID format'
        });
      }
      filterQuery.generatedBy = generatedBy;
    }
    
    switch (filter) {
      case 'recent':
        const sevenDaysAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        filterQuery.date = { $gte: sevenDaysAgo };
        break;
      case 'high-recipients':
        filterQuery.noOfRecipient = { $gt: 2 };
        break;
      case 'with-rank':
        filterQuery.rank = true;
        break;
      case 'without-rank':
        filterQuery.rank = false;
        break;
      default:
        break;
    }

    // Build sort object
    let sortObject = {};
    switch (sortBy) {
      case 'date':
        sortObject.date = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'recipients':
        sortObject.noOfRecipient = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'certificateId':
        sortObject.certificateId = sortOrder === 'asc' ? 1 : -1;
        break;
      default:
        sortObject.date = -1;
        break;
    }

    // Get all matching documents first (for search functionality)
    const allCertificates = await GeneratedCertificate.find(filterQuery)
      .populate('certificateId', 'eventId imagePath')
      .populate({
        path: 'certificateId',
        populate: {
          path: 'eventId',
          select: 'eventName organisation issuerName'
        }
      })
      .populate('generatedBy', 'name email organisation')
      .sort(sortObject)
      .lean();

    // Decrypt and filter data
    let decryptedCertificates = [];
    const failedDecryptions = [];

    for (const cert of allCertificates) {
      try {
        let recipients = [];
        
        if (cert.encryptedRecipients) {
          // Decrypt the recipients data
          recipients = decryptData(cert.encryptedRecipients, password);
        } else if (cert.recipients) {
          // Fallback to legacy unencrypted data
          recipients = cert.recipients;
        }

        // Apply search filter after decryption
        let includeInResults = true;
        if (search && search.trim() !== '') {
          const searchRegex = new RegExp(search.trim(), 'i');
          const hasMatch = recipients.some(recipient => 
            searchRegex.test(recipient.name) || 
            (recipient.email && searchRegex.test(recipient.email)) ||
            (recipient.rank && searchRegex.test(recipient.rank))
          ) || searchRegex.test(cert.certificateId?.eventId?.eventName || '');
          
          includeInResults = hasMatch;
        }

        if (includeInResults) {
          decryptedCertificates.push({
            ...cert,
            recipients
          });
        }
      } catch (decryptError) {
        console.error(`Failed to decrypt certificate ${cert._id}:`, decryptError.message);
        failedDecryptions.push(cert._id);
      }
    }

    // Apply pagination to filtered results
    const totalCount = decryptedCertificates.length;
    const paginatedCertificates = decryptedCertificates.slice(skip, skip + limitNum);

    // Transform data for frontend
    const transformedData = paginatedCertificates.map((cert, index) => ({
      id: cert._id,
      serialNumber: skip + index + 1,
      date: cert.date,
      certificateId: cert.certificateId?.eventId?.eventName || 'Unknown Event',
      eventDetails: cert.certificateId?.eventId || null,
      recipients: cert.recipients || [],
      noOfRecipient: cert.noOfRecipient || 0,
      rank: cert.rank || false,
      generatedId: cert._id.toString().slice(-8).toUpperCase(),
      generatedBy: cert.generatedBy || null,
      createdAt: cert.createdAt,
      updatedAt: cert.updatedAt,
      encrypted: false // Indicate that this data has been decrypted
    }));

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    console.log(`Decrypted ${allCertificates.length} certificates, found ${totalCount} matching search, returning ${transformedData.length} for page ${pageNum}`);
    if (failedDecryptions.length > 0) {
      console.warn(`Failed to decrypt ${failedDecryptions.length} certificates:`, failedDecryptions);
    }

    res.status(200).json({
      success: true,
      message: 'Generated certificates decrypted and retrieved successfully',
      data: {
        certificates: transformedData,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        },
        decryption: {
          successful: allCertificates.length - failedDecryptions.length,
          failed: failedDecryptions.length
        }
      }
    });

  } catch (error) {
    console.error('Decrypt generated certificates error:', error);

    if (error.message.includes('decrypt') || error.message.includes('password')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password or failed to decrypt data'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to decrypt and retrieve certificates',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Verify UUID and get detailed certificate information
// @route   GET /api/certificates/verify/:uuid
// @access  Public
export const verifyUUID = async (req, res) => {
  try {
    const { uuid } = req.params;

    if (!uuid) {
      return res.status(400).json({
        success: false,
        message: 'UUID is required',
        verified: false,
        step: 'validation',
        error: 'UUID parameter missing'
      });
    }

    console.log('=== UUID VERIFICATION PROCESS START ===');
    console.log('Verifying UUID:', uuid);

    // Step 1: Find the UUID verification document
    console.log('Step 1: Searching VerifyUUID collection...');
    const verifyRecord = await VerifyUUID.findOne({ uuid });
    console.log("VerifyRecord: ", verifyRecord)
    if (!verifyRecord) {
      console.log('UUID not found in VerifyUUID collection');
      return res.status(404).json({
        success: false,
        message: 'Certificate UUID not found or invalid. Please try contacting the issuer',
        verified: false,
        step: 'uuid_lookup',
        error: 'UUID does not exist in verification records'
      });
    }

    console.log('✓ Step 1 Complete: UUID verification record found:', verifyRecord._id);

    // Step 2: Get the associated generated certificate
    console.log('Step 2: Fetching GeneratedCertificate...');
    const generatedCertificate = await GeneratedCertificate.findById(verifyRecord.generatedCertificateId);

    if (!generatedCertificate) {
      console.log('GeneratedCertificate not found for ID:', verifyRecord.generatedCertificateId);
      return res.status(404).json({
        success: false,
        message: 'Associated certificate record not found. Please try contacting the issue',
        verified: false,
        step: 'certificate_lookup',
        error: 'Certificate data has been removed or corrupted'
      });
    }

    console.log('✓ Step 2 Complete: GeneratedCertificate found:', generatedCertificate._id);
    console.log('Certificate created at:', generatedCertificate.createdAt);

    // Step 3: Get certificate configuration
    console.log('Step 3: Fetching CertificateConfig...');
    const certificateConfig = await CertificateConfig.findById(generatedCertificate.certificateId);

    if (!certificateConfig) {
      console.log('CertificateConfig not found for ID:', generatedCertificate.certificateId);
      return res.status(404).json({
        success: false,
        message: 'Certificate configuration not found. Please try contacting the issue',
        verified: false,
        step: 'config_lookup',
        error: 'Certificate configuration has been removed'
      });
    }

    console.log('✓ Step 3 Complete: CertificateConfig found:', certificateConfig._id);

    // Step 4: Get event details
    console.log('Step 4: Fetching Event details...');
    const event = await Event.findById(certificateConfig.eventId);

    if (!event) {
      console.log('Event not found for ID:', certificateConfig.eventId);
      return res.status(404).json({
        success: false,
        message: 'Event information not found. Please try contacting the issue',
        verified: false,
        step: 'event_lookup',
        error: 'Event has been removed or does not exist'
      });
    }

    console.log('✓ Step 4 Complete: Event found:', event._id);
    console.log('Event name:', event.eventName);
    console.log('Issuer name:', event.issuerName);
    console.log('Organisation:', event.organisation);

    // All verification steps complete - return success
    console.log('=== UUID VERIFICATION PROCESS COMPLETE ===');

    res.status(200).json({
      success: true,
      message: 'Certificate verified successfully',
      verified: true,
      step: 'complete',
      data: {
        uuid: verifyRecord.uuid,
        organisation: event.organisation,
        issuerName: event.issuerName,
        eventName: event.eventName,
        eventDate: event.date,
        certificateGeneratedDate: generatedCertificate.createdAt,
        certificateId: generatedCertificate.certificateId,
        verificationId: verifyRecord._id,
        isValid: true,
        verifiedAt: new Date()
      }
    });

  } catch (error) {
    console.error('UUID verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify certificate',
      verified: false,
      step: 'server_error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get all UUID verifications for a specific generated certificate
// @route   GET /api/certificates/generated/:id/uuids
// @access  Protected
export const getCertificateUUIDs = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid certificate ID format'
      });
    }

    console.log('Getting UUIDs for certificate:', id);

    // Find all UUID verifications for this certificate
    const uuidVerifications = await VerifyUUID.find({ generatedCertificateId: id })
      .select('uuid createdAt')
      .sort({ createdAt: -1 });

    console.log(`Found ${uuidVerifications.length} UUID verifications`);

    res.status(200).json({
      success: true,
      message: 'UUID verifications retrieved successfully',
      data: {
        certificateId: id,
        totalUUIDs: uuidVerifications.length,
        uuids: uuidVerifications.map(verification => ({
          uuid: verification.uuid,
          verificationId: verification._id,
          createdAt: verification.createdAt
        }))
      }
    });

  } catch (error) {
    console.error('Get certificate UUIDs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve certificate UUIDs',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get organization statistics
// @route   GET /api/certificates/organization-stats/:organizationName
// @access  Protected
export const getOrganizationStats = async (req, res) => {
  try {
    const { organizationName } = req.params;

    if (!organizationName) {
      return res.status(400).json({
        success: false,
        message: 'Organization name is required'
      });
    }

    console.log('Getting organization statistics for:', organizationName);

    const record = await Record.findOne({ organisationName: organizationName });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'No statistics found for this organization',
        data: {
          organisationName: organizationName,
          recipientCount: 0,
          eventsCreated: 0
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Organization statistics retrieved successfully',
      data: {
        organisationName: record.organisationName,
        recipientCount: record.recipientCount,
        eventsCreated: record.eventsCreated,
        lastUpdated: record.updatedAt,
        createdAt: record.createdAt
      }
    });

  } catch (error) {
    console.error('Get organization stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve organization statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get all organization statistics
// @route   GET /api/certificates/all-organization-stats
// @access  Protected
export const getAllOrganizationStats = async (req, res) => {
  try {
    console.log('Getting all organization statistics...');

    const records = await Record.find({})
      .sort({ recipientCount: -1, eventsCreated: -1 })
      .select('organisationName recipientCount eventsCreated createdAt updatedAt');

    res.status(200).json({
      success: true,
      message: 'All organization statistics retrieved successfully',
      data: {
        organizations: records,
        totalOrganizations: records.length,
        totalRecipients: records.reduce((sum, record) => sum + record.recipientCount, 0),
        totalEvents: records.reduce((sum, record) => sum + record.eventsCreated, 0)
      }
    });

  } catch (error) {
    console.error('Get all organization stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve organization statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Update recipient count for organization (for immediate tracking)
// @route   POST /api/certificates/update-recipient-count
// @access  Protected
export const updateRecipientCount = async (req, res) => {
  try {
    const { orgName, recipientCount } = req.body;
    
    // Validation
    if (!orgName || !recipientCount || typeof recipientCount !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Please provide certificateId and recipientCount (number)'
      });
    }

    console.log('=== UPDATE RECIPIENT COUNT REQUEST ===');
    console.log('organisationName:', orgName);
    console.log('recipientCount:', recipientCount);


    // Update organization record
    const updatedRecord = await Record.findOneAndUpdate(
      { organisationName: orgName },
      { 
        $inc: { recipientCount: recipientCount },
        $setOnInsert: { 
          organisationName: orgName,
          eventsCreated: 0 
        }
      },
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true 
      }
    );

    console.log(`✓ Recipient count increased by ${recipientCount} for organization: ${orgName}`);
    console.log('Updated record:', updatedRecord);

    res.status(200).json({
      success: true,
      message: 'Recipient count updated successfully',
      data: {
        organisationName: orgName,
        recipientCountAdded: recipientCount,
        newTotalRecipients: updatedRecord.recipientCount,
        totalEvents: updatedRecord.eventsCreated
      }
    });

  } catch (error) {
    console.error('Update recipient count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update recipient count',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
