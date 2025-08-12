import Event from '../models/Event.js';
import User from '../models/User.js';
import CertificateConfig from '../models/CertificateConfig.js';
import mongoose from 'mongoose';

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
          ...event.toObject(),
          certificateConfig: certificateConfig ? {
            id: certificateConfig._id,
            imagePath: certificateConfig.imagePath,
            validFields: certificateConfig.validFields
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
