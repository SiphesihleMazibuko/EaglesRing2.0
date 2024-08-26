import mongoose, { Schema, models } from 'mongoose';
import { type } from 'os';

const pitchSchema = new Schema(
  {
    entrepreneurId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    projectIdea: {
      type: String,
      required: true,
    },
    projectImage: {
      type: String, 
    },
    pitchVideo: {
      type: String,
    },
    businessPhase: {
      type: String,
    },
  },
  { timestamps: true }
);

const Pitch = models.Pitch || mongoose.model('Pitch', pitchSchema);

export default Pitch;
