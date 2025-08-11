import mongoose from 'mongoose';

// Schema for valid field coordinates
const coordinateSchema = new mongoose.Schema({
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  }
}, { _id: false });

// Schema for valid fields with optional fields
const validFieldsSchema = new mongoose.Schema({
  recipientName: {
    type: [Number],
    validate: {
      validator: function(arr) {
        return arr.length === 2;
      },
      message: 'recipientName coordinates must contain exactly 2 numbers [x, y]'
    }
  },
  organisationName: {
    type: [Number],
    validate: {
      validator: function(arr) {
        return arr.length === 2;
      },
      message: 'organisationName coordinates must contain exactly 2 numbers [x, y]'
    }
  },
  certificateLink: {
    type: [Number],
    validate: {
      validator: function(arr) {
        return arr.length === 2;
      },
      message: 'certificateLink coordinates must contain exactly 2 numbers [x, y]'
    }
  },
  certificateQR: {
    type: [Number],
    validate: {
      validator: function(arr) {
        return arr.length === 2;
      },
      message: 'certificateQR coordinates must contain exactly 2 numbers [x, y]'
    }
  },
  rank: {
    type: [Number],
    validate: {
      validator: function(arr) {
        return arr.length === 2;
      },
      message: 'rank coordinates must contain exactly 2 numbers [x, y]'
    }
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
