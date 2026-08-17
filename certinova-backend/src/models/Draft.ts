import mongoose, { Document, Schema } from 'mongoose';

export interface IDraft extends Document {
  userId: mongoose.Types.ObjectId;
  templateName: string;
  canvasConfig: any;
  lastModified: Date;
}

const draftSchema: Schema = new Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  templateName: { 
    type: String, 
    default: 'Untitled Draft' 
  },
  canvasConfig: { 
    type: Object, 
    required: true 
  },
  lastModified: { 
    type: Date, 
    default: Date.now 
  },
}, { timestamps: true });

// Automatically delete drafts older than 30 days (2592000 seconds)
draftSchema.index({ lastModified: 1 }, { expireAfterSeconds: 2592000 });

export default mongoose.model<IDraft>('Draft', draftSchema);
