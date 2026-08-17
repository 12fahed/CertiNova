import { Request, Response } from 'express';
import Draft from '../models/Draft';

// Create or update a draft
export const saveDraft = async (req: Request, res: Response) => {
  try {
    const { templateName, canvasConfig } = req.body;
    
    // Assuming you have auth middleware that attaches req.user
    // If not, you'll need to pass userId in the body
    const userId = (req as any).user?._id || req.body.userId; 

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const draft = await Draft.findOneAndUpdate(
      { userId }, 
      { templateName, canvasConfig, lastModified: new Date() },
      { new: true, upsert: true } // upsert creates a new one if it doesn't exist
    );
    
    res.status(200).json({ success: true, draft });
  } catch (error) {
    console.error('Save Draft Error:', error);
    res.status(500).json({ success: false, message: 'Failed to save draft' });
  }
};

// Retrieve a user's current draft
export const getDraft = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id || req.params.userId;
    
    const draft = await Draft.findOne({ userId });
    
    if (!draft) {
      return res.status(404).json({ success: false, message: 'No draft found' });
    }
    
    res.status(200).json({ success: true, draft });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch draft' });
  }
};

// Delete a draft (called when a user publishes/saves the final template)
export const deleteDraft = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id || req.params.userId;
    await Draft.findOneAndDelete({ userId });
    
    res.status(200).json({ success: true, message: 'Draft cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete draft' });
  }
};
