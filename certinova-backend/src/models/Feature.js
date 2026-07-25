import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema(
  {
    featureName: {
      type: String,
    },
    enable: {
        type: Boolean
    }
  }
);

const Feature = mongoose.model('Feature', featureSchema);

export default Feature;
