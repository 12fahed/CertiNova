import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
  organisationName: {
    type: String,
    required: true,
    index: true
  },
  recipientCount: {
    type: Number,
    default: 0,
    min: 0
  },
  eventsCreated: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Create compound index for efficient queries
recordSchema.index({ organisationName: 1 });

const Record = mongoose.model('Record', recordSchema);

export default Record;
