import mongoose from 'mongoose';

const generatedCertificateSchema = new mongoose.Schema({
  certificateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CertificateConfig',
    required: true
  },
  noOfRecipient: {
    type: Number,
    required: true,
    min: 1
  },
  rank: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  // Store encrypted recipient data
  encryptedRecipients: {
    encryptedData: {
      type: String,
      required: true
    },
    salt: {
      type: String,
      required: true
    },
    iv: {
      type: String,
      required: true
    }
  },
  // Legacy recipients field - keep for backward compatibility but mark as optional
  recipients: [{
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(v) {
          // Email is optional, but if provided, must be valid
          if (!v) return true;
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: 'Please enter a valid email'
      }
    },
    rank: {
      type: String,
      trim: true
    }
  }],
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
generatedCertificateSchema.index({ certificateId: 1, date: -1 });
generatedCertificateSchema.index({ generatedBy: 1, date: -1 });

const GeneratedCertificate = mongoose.model('GeneratedCertificate', generatedCertificateSchema);

export default GeneratedCertificate;
