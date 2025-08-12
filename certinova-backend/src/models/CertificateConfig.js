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
    required: false,
    default: undefined,
    validate: {
      validator: function(v) {
        // Either undefined or an array with exactly 4 numbers [x, y, width, height]
        return v === undefined || (Array.isArray(v) && v.length === 4 && 
               v.slice(0, 2).every(n => typeof n === 'number' && !isNaN(n) && n >= 0) &&
               v.slice(2, 4).every(n => typeof n === 'number' && !isNaN(n) && n > 0));
      },
      message: props => `${props.path} must be an array with exactly 4 numbers [x, y, width, height] where x,y >= 0 and width,height > 0`
    }
  },
  organisationName: {
    type: [Number],
    required: false,
    default: undefined,
    validate: {
      validator: function(v) {
        return v === undefined || (Array.isArray(v) && v.length === 4 && 
               v.slice(0, 2).every(n => typeof n === 'number' && !isNaN(n) && n >= 0) &&
               v.slice(2, 4).every(n => typeof n === 'number' && !isNaN(n) && n > 0));
      },
      message: props => `${props.path} must be an array with exactly 4 numbers [x, y, width, height] where x,y >= 0 and width,height > 0`
    }
  },
  certificateLink: {
    type: [Number],
    required: false,
    default: undefined,
    validate: {
      validator: function(v) {
        return v === undefined || (Array.isArray(v) && v.length === 4 && 
               v.slice(0, 2).every(n => typeof n === 'number' && !isNaN(n) && n >= 0) &&
               v.slice(2, 4).every(n => typeof n === 'number' && !isNaN(n) && n > 0));
      },
      message: props => `${props.path} must be an array with exactly 4 numbers [x, y, width, height] where x,y >= 0 and width,height > 0`
    }
  },
  certificateQR: {
    type: [Number],
    required: false,
    default: undefined,
    validate: {
      validator: function(v) {
        return v === undefined || (Array.isArray(v) && v.length === 4 && 
               v.slice(0, 2).every(n => typeof n === 'number' && !isNaN(n) && n >= 0) &&
               v.slice(2, 4).every(n => typeof n === 'number' && !isNaN(n) && n > 0));
      },
      message: props => `${props.path} must be an array with exactly 4 numbers [x, y, width, height] where x,y >= 0 and width,height > 0`
    }
  },
  rank: {
    type: [Number],
    required: false,
    default: undefined,
    validate: {
      validator: function(v) {
        return v === undefined || (Array.isArray(v) && v.length === 4 && 
               v.slice(0, 2).every(n => typeof n === 'number' && !isNaN(n) && n >= 0) &&
               v.slice(2, 4).every(n => typeof n === 'number' && !isNaN(n) && n > 0));
      },
      message: props => `${props.path} must be an array with exactly 4 numbers [x, y, width, height] where x,y >= 0 and width,height > 0`
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
