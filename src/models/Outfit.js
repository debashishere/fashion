import mongoose from 'mongoose';

const outfitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    trim: true,
    maxlength: [100, 'Outfit name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClothingItem',
    required: true
  }],
  aiAnalysis: {
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    colorHarmony: {
      score: { type: Number, min: 0, max: 100 },
      feedback: String
    },
    styleCohesion: {
      score: { type: Number, min: 0, max: 100 },
      feedback: String
    },
    occasionAppropriateness: {
      score: { type: Number, min: 0, max: 100 },
      feedback: String
    },
    strengths: [String],
    improvements: [String],
    generatedAt: Date
  },
  occasion: {
    type: String,
    enum: ['casual', 'formal', 'business', 'date', 'party', 'sport', 'travel', 'other']
  },
  season: [{
    type: String,
    enum: ['spring', 'summer', 'fall', 'winter']
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  tags: [String]
}, {
  timestamps: true
});

// Indexes
outfitSchema.index({ userId: 1, createdAt: -1 });
outfitSchema.index({ userId: 1, isFavorite: 1 });

export default mongoose.model('Outfit', outfitSchema);