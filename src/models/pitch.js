import mongoose, { Schema, models } from 'mongoose';


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
      validate: {
        validator: function (v) {
          return /\.(jpg|jpeg|png|gif)$/.test(v);  
        },
        message: 'Project image must be a valid image format.',
      },
    },
    pitchVideo: {
      type: String,
      validate: {
        validator: function (v) {
          return /\.(mp4|mov|avi)$/.test(v);  
        },
        message: 'Pitch video must be a valid video format.',
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
