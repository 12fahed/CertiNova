import mongoose from 'mongoose';

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
  fontFamily: {
    type: String,
    default: 'Inter',
    enum: [
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
    ]
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
  },
  color: {
    type: String,
    default: '#000000',
    validate: {
      validator: function(value) {
        // Validate hex color code format
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
      },
      message: 'Color must be a valid hex color code (e.g., #000000 or #000)'
    }
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
