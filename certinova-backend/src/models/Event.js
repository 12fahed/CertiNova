import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  organisation: {
    type: String,
    required: [true, 'Organisation name is required'],
    trim: true,
    minlength: [2, 'Organisation name must be at least 2 characters long'],
    maxlength: [100, 'Organisation name cannot exceed 100 characters']
  },
  organisationID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Organisation ID is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  eventName: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true,
    minlength: [2, 'Event name must be at least 2 characters long'],
    maxlength: [200, 'Event name cannot exceed 200 characters']
  },
  issuerName: {
    type: String,
    required: [true, 'Issuer name is required'],
    trim: true,
    minlength: [2, 'Issuer name must be at least 2 characters long'],
    maxlength: [100, 'Issuer name cannot exceed 100 characters']
  }
}, {
  timestamps: true
});

// Index for better query performance
eventSchema.index({ organisationID: 1 });
eventSchema.index({ eventName: 1 });

const Event = mongoose.model('Event', eventSchema);

export default Event;
