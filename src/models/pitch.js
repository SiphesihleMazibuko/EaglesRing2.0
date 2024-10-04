import mongoose, { Schema, models } from 'mongoose';
import { type } from 'os';

const pitchSchema = new Schema(
  {
    entrepreneurId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
   entrepreneurEmail: {
      type: String,  // This should be a String
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    investmentAmount: {
      type: String, 
      required: true,
    },
    projectIdea: {
      type: String,
      required: true,
    },
    projectImage: {
      type: String, 
      validate: {
        validator: function (v) {
          return /\.(jpg|jpeg|png|gif)$/.test(v) && /^https?:\/\/.+/.test(v);
        },
        message: 'Project image must be a valid URL and in jpg, jpeg, png, or gif format.',
      },
    },
    pitchVideo: {
      type: String,
      validate: {
        validator: function (v) {
          return /\.(mp4|mov|avi)$/.test(v) && /^https?:\/\/.+/.test(v);
        },
        message: 'Pitch video must be a valid URL and in mp4, mov, or avi format.',
      },
    },
    businessPhase: {
      type: String,
    },
  },
  { timestamps: true }
);

const Pitch = models.Pitch || mongoose.model('Pitch', pitchSchema);

export default Pitch;
