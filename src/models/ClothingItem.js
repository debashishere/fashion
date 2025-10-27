import mongoose from 'mongoose';

const clothingItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['top', 'bottom', 'shoes', 'accessories', 'outerwear', 'dress']
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  cloudinaryId: {
    type: String,
    required: [true, 'Cloudinary ID is required']
  },
  color: {
    type: String,
    required: [true, 'Color is required'],
    trim: true
  },
  brand: {
    type: String,
    trim: true,
    maxlength: [50, 'Brand name cannot exceed 50 characters']
  },
  tags: [{
    type: String,
    trim: true
  }],
  season: [{
    type: String,
    enum: ['spring', 'summer', 'fall', 'winter', 'all-season']
  }],
  occasion: [{
    type: String,
    enum: ['casual', 'formal', 'business', 'sport', 'evening', 'beach']
  }],
  size: String,
  material: String,
  price: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'donated'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes
clothingItemSchema.index({ userId: 1, category: 1 });
clothingItemSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('ClothingItem', clothingItemSchema);