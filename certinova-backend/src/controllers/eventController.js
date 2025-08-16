import Event from '../models/Event.js';
import User from '../models/User.js';
import CertificateConfig from '../models/CertificateConfig.js';
import GeneratedCertificate from '../models/GeneratedCertificate.js';
import VerifyUUID from '../models/VerifyUUID.js';
import Record from '../models/Record.js';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// @desc    Add a new event
// @route   POST /api/events/addEvent
// @access  Protected (should be protected later with JWT)
export const addEvent = async (req, res) => {
  try {
    const { organisation, organisationID, date, eventName, issuerName } = req.body;

    // Validation
    if (!organisation || !organisationID || !eventName || !issuerName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide organisation, organisationID, eventName, and issuerName'
      });
    }

    // Validate organisationID format
    if (!mongoose.Types.ObjectId.isValid(organisationID)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid organisation ID format'
      });
    }

    // Check if organisation exists
    const organisationExists = await User.findById(organisationID);
    if (!organisationExists) {
      return res.status(404).json({
        success: false,
        message: 'Organisation not found'
      });
    }

    // Parse date if provided, otherwise use current date
    let eventDate = date ? new Date(date) : new Date();
    
    // Validate date
    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }

    // Create new event
    const event = new Event({
      organisation,
      organisationID,
      date: eventDate,
      eventName,
      issuerName
    });

    await event.save();

    // Update or create record for organization statistics
    console.log('Updating organization record for eventsCreated...');
    try {
      await Record.findOneAndUpdate(
        { organisationName: organisation },
        { 
          $inc: { eventsCreated: 1 },
          $setOnInsert: { 
            organisationName: organisation,
            recipientCount: 0 
          }
        },
        { 
          upsert: true, 
          new: true,
          setDefaultsOnInsert: true 
        }
      );
      console.log(`✓ Events created counter incremented for organization: ${organisation}`);
    } catch (recordError) {
      console.error('Failed to update organization record:', recordError);
      // Don't fail the event creation if record update fails
    }

    // Populate the organisation details for response
    await event.populate('organisationID', 'organisation email');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: {
        event: {
          id: event._id,
          organisation: event.organisation,
          organisationID: event.organisationID,
          date: event.date,
          eventName: event.eventName,
          issuerName: event.issuerName,
          createdAt: event.createdAt,
          updatedAt: event.updatedAt
        }
      }
    });

  } catch (error) {
    console.error('Add event error:', error);
    
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

// @desc    Get all events for an organisation
// @route   GET /api/events/:organisationID
// @access  Protected (should be protected later with JWT)
export const getEventsByOrganisation = async (req, res) => {
  try {
    const { organisationID } = req.params;

    // Validate organisationID format
    if (!mongoose.Types.ObjectId.isValid(organisationID)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid organisation ID format'
      });
    }

    const events = await Event.find({ organisationID })
      .populate('organisationID', 'organisation email')
      .sort({ createdAt: -1 });

    // Get certificate configs for all events
    const eventsWithCertificates = await Promise.all(
      events.map(async (event) => {
        const certificateConfig = await CertificateConfig.findOne({ eventId: event._id });
        return {
          id: event._id, // Map _id to id
          organisation: event.organisation,
          organisationID: event.organisationID,
          date: event.date,
          eventName: event.eventName,
          issuerName: event.issuerName,
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
          certificateConfig: certificateConfig ? {
            id: certificateConfig._id,
            imagePath: certificateConfig.imagePath,
            validFields: certificateConfig.validFields,
            createdAt: certificateConfig.createdAt,
            updatedAt: certificateConfig.updatedAt
          } : null
        };
      })
    );

    res.status(200).json({
      success: true,
      message: 'Events retrieved successfully',
      data: {
        events: eventsWithCertificates,
        count: eventsWithCertificates.length
      }
    });

  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Delete an event and all related data
// @route   DELETE /api/events/:eventId
// @access  Protected (should be protected later with JWT)
export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    console.log('=== DELETE EVENT REQUEST ===');
    console.log('Event ID:', eventId);

    // Validate eventId format
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    console.log('Found event:', event.eventName);

    // Track what we've deleted for the response
    let deletedCertificateConfig = false;
    let deletedGeneratedCertificatesCount = 0;
    let deletedVerifyUUIDsCount = 0;
    let deletedTemplateFile = false;
    let totalRecipients = 0; // Track total recipients for record updating

    try {
      // 1. Find and delete certificate configuration
      const certificateConfig = await CertificateConfig.findOne({ eventId });
      
      if (certificateConfig) {
        console.log('Found certificate config:', certificateConfig._id);
        
        // Delete certificate template file if it exists
        if (certificateConfig.imagePath) {
          try {
            const filePath = path.join(process.cwd(), 'public', certificateConfig.imagePath);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              deletedTemplateFile = true;
              console.log('Deleted template file:', certificateConfig.imagePath);
            }
          } catch (fileError) {
            console.warn('Failed to delete template file:', fileError.message);
            // Continue with deletion even if file deletion fails
          }
        }

        // 2. Delete all generated certificates for this certificate config
        // First, get all generated certificate IDs to delete associated VerifyUUID documents
        const generatedCertificates = await GeneratedCertificate.find({ 
          certificateId: certificateConfig._id 
        }).select('_id noOfRecipient');
        
        console.log(`Found ${generatedCertificates.length} generated certificates to delete`);

        // Calculate total recipients for record tracking
        totalRecipients = generatedCertificates.reduce((sum, cert) => sum + cert.noOfRecipient, 0);
        console.log(`Total recipients to be decremented: ${totalRecipients}`);

        // Delete all VerifyUUID documents for these generated certificates
        if (generatedCertificates.length > 0) {
          const generatedCertificateIds = generatedCertificates.map(cert => cert._id);
          
          const deleteUUIDResult = await VerifyUUID.deleteMany({ 
            generatedCertificateId: { $in: generatedCertificateIds } 
          });
          deletedVerifyUUIDsCount = deleteUUIDResult.deletedCount;
          console.log(`Deleted ${deletedVerifyUUIDsCount} VerifyUUID records`);
        }

        // Now delete the generated certificates
        const deleteResult = await GeneratedCertificate.deleteMany({ 
          certificateId: certificateConfig._id 
        });
        deletedGeneratedCertificatesCount = deleteResult.deletedCount;
        console.log(`Deleted ${deletedGeneratedCertificatesCount} generated certificate records`);

        // 3. Delete certificate config from database
        await CertificateConfig.deleteOne({ _id: certificateConfig._id });
        deletedCertificateConfig = true;
        console.log('Deleted certificate config');
      } else {
        console.log('No certificate config found for this event');
      }

      // 4. Delete the event itself
      await Event.deleteOne({ _id: eventId });
      console.log('Deleted event');

      // 5. Update organization record to decrement counters
      console.log('Updating organization record for deletion...');
      try {
        if (event.organisation) {
          const updateFields = {
            $inc: { eventsCreated: -1 }
          };

          // Only decrement recipient count if we have certificates with recipients
          if (certificateConfig && typeof totalRecipients !== 'undefined' && totalRecipients > 0) {
            updateFields.$inc.recipientCount = -totalRecipients;
          }

          await Record.findOneAndUpdate(
            { organisationName: event.organisation },
            updateFields,
            { new: true }
          );
          
          console.log(`✓ Decremented counters for organization: ${event.organisation}`);
          console.log(`  - Events: -1`);
          if (totalRecipients > 0) {
            console.log(`  - Recipients: -${totalRecipients}`);
          }
        }
      } catch (recordError) {
        console.error('Failed to update organization record during deletion:', recordError);
        // Don't fail the deletion if record update fails
      }

      res.status(200).json({
        success: true,
        message: `Event "${event.eventName}" and all related data have been successfully deleted`,
        data: {
          deletedEvent: {
            id: event._id,
            eventName: event.eventName,
            issuerName: event.issuerName
          },
          deletedCertificateConfig,
          deletedGeneratedCertificatesCount,
          deletedVerifyUUIDsCount,
          deletedTemplateFile
        }
      });

    } catch (deletionError) {
      console.error('Error during deletion process:', deletionError);
      throw new Error(`Deletion process failed: ${deletionError.message}`);
    }

  } catch (error) {
    console.error('Delete event error:', error);

    // Handle specific error cases
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
