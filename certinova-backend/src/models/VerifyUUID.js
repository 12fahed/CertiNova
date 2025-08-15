import mongoose from 'mongoose';

const verifyUUIDSchema = new mongoose.Schema({
  generatedCertificateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GeneratedCertificate',
    required: true
  },
  uuid: {
    type: String,
    required: true,
    unique: true,
    index: true
  }
}, {
  timestamps: true
});

// Create index for faster UUID lookups
verifyUUIDSchema.index({ uuid: 1 });
verifyUUIDSchema.index({ generatedCertificateId: 1 });

const VerifyUUID = mongoose.model('VerifyUUID', verifyUUIDSchema);

export default VerifyUUID;
