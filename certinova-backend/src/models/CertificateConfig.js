import mongoose from 'mongoose';

// Schema for field styling properties
const fieldStyleSchema = new mongoose.Schema({
  fontSize: {
    type: Number,
    default: 24,
    min: 8,
    max: 200
  },
  fontFamily: {
    type: String,
    default: 'Arial',
    enum: ['Arial', 'Times New Roman', 'Helvetica', 'Georgia', 'Verdana', 'Trebuchet MS', 'Comic Sans MS', 'Impact', 'Lucida Console', 'Tahoma']
  },
  fontWeight: {
    type: String,
    default: 'normal',
    enum: ['normal', 'bold']
  },
  fontStyle: {
    type: String,
    default: 'normal',
    enum: ['normal', 'italic']
  },
  textDecoration: {
    type: String,
    default: 'none',
    enum: ['none', 'underline']
  }
}, { _id: false });

// Schema for individual field with coordinates and styling
const fieldSchema = new mongoose.Schema({
  x: {
    type: Number,
    required: true,
    min: 0
  },
  y: {
    type: Number,
    required: true,
    min: 0
  },
  width: {
    type: Number,
    required: true,
    min: 1
  },
  height: {
    type: Number,
    required: true,
    min: 1
  },
  fontSize: {
    type: Number,
    default: 24,
    min: 8,
    max: 200
  },
  fontFamily: {
    type: String,
    default: 'Arial',
    enum: ['Arial', 'Times New Roman', 'Helvetica', 'Georgia', 'Verdana', 'Trebuchet MS', 'Comic Sans MS', 'Impact', 'Lucida Console', 'Tahoma']
  },
  fontWeight: {
    type: String,
    default: 'normal',
    enum: ['normal', 'bold']
  },
  fontStyle: {
    type: String,
    default: 'normal',
    enum: ['normal', 'italic']
  },
  textDecoration: {
    type: String,
    default: 'none',
    enum: ['none', 'underline']
  }
}, { _id: false });

// Schema for valid fields with optional fields
const validFieldsSchema = new mongoose.Schema({
  recipientName: {
    type: fieldSchema,
    required: false,
    default: undefined
  },
  organisationName: {
    type: fieldSchema,
    required: false,
    default: undefined
  },
  certificateLink: {
    type: fieldSchema,
    required: false,
    default: undefined
  },
  certificateQR: {
    type: fieldSchema,
    required: false,
    default: undefined
  },
  rank: {
    type: fieldSchema,
    required: false,
    default: undefined
  }
}, { _id: false });

const certificateConfigSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required']
  },
  imagePath: {
    type: String,
    required: [true, 'Image path is required'],
    trim: true
  },
  validFields: {
    type: validFieldsSchema,
    required: [true, 'Valid fields configuration is required'],
    validate: {
      validator: function(fields) {
        // At least one field must be present
        return Object.keys(fields.toObject()).length > 0;
      },
      message: 'At least one valid field must be specified'
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
certificateConfigSchema.index({ eventId: 1 });

const CertificateConfig = mongoose.model('CertificateConfig', certificateConfigSchema);

export default CertificateConfig;
