import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to create directories and files
const createFile = (filePath, content) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content);
  console.log(`✅ Created: ${filePath}`);
};

console.log('🚀 Generating Bespoke AI Backend...\n');

// Create package.json
createFile('package.json', `{
  "name": "bespoke-ai-backend",
  "version": "1.0.0",
  "description": "AI Fashion Stylist Backend",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "node test-api.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.10.0",
    "express-validator": "^7.0.1",
    "multer": "^1.4.5",
    "cloudinary": "^1.40.0",
    "dotenv": "^16.3.1",
    "express-mongo-sanitize": "^2.2.0",
    "hpp": "^0.2.3",
    "xss-clean": "^0.1.4"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "axios": "^1.5.0"
  }
}`);

// Create .env file
createFile('.env', `NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bespoke-ai
JWT_SECRET=your-super-secret-jwt-key-here-make-it-very-long-and-secure
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLIENT_URL=http://localhost:3000`);

// Create main server file
createFile('server.js', `import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import xss from 'xss-clean';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

// Import routes
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/users.routes.js';
import itemRoutes from './src/routes/items.routes.js';
import outfitRoutes from './src/routes/outfits.routes.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    success: false,
    message: 'Too many requests from this IP'
  }
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Static files
app.use('/uploads', express.static('uploads'));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Bespoke AI API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/outfits', outfitRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(\`🎯 Server running on port \${PORT}\`);
  console.log(\`🌐 Environment: \${process.env.NODE_ENV}\`);
});

export default app;`);

// Create models
createFile('src/models/User.js', `import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\\w+([.-]?\\w+)*@\\w+([.-]?\\w+)*(\\.\\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  profile: {
    fullName: {
      type: String,
      trim: true,
      maxlength: [50, 'Full name cannot exceed 50 characters']
    },
    avatar: String,
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    stylePersonality: {
      type: String,
      enum: ['casual', 'formal', 'bohemian', 'minimalist', 'streetwear', 'vintage', 'athletic'],
      default: 'casual'
    }
  },
  preferences: {
    preferredColors: [String],
    avoidedColors: [String],
    fitPreference: {
      type: String,
      enum: ['slim', 'regular', 'loose'],
      default: 'regular'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model('User', userSchema);`);

createFile('src/models/ClothingItem.js', `import mongoose from 'mongoose';

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

export default mongoose.model('ClothingItem', clothingItemSchema);`);

createFile('src/models/Outfit.js', `import mongoose from 'mongoose';

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

export default mongoose.model('Outfit', outfitSchema);`);

// Create middleware
createFile('src/middleware/auth.js', `import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated.'
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Authentication failed.'
    });
  }
};

export default auth;`);

createFile('src/middleware/upload.js', `import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'item-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
  }
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next();
};

export { upload, handleUploadError };`);

// Create services
createFile('src/services/cloudinary.service.js', `import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath, folder = 'bespoke-ai') => {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder,
      resource_type: 'image',
      quality: 'auto',
      fetch_format: 'auto'
    });
    return result;
  } catch (error) {
    throw new Error(\`Cloudinary upload failed: \${error.message}\`);
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.v2.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(\`Cloudinary delete failed: \${error.message}\`);
  }
};

export {
  uploadToCloudinary,
  deleteFromCloudinary
};`);

// Create controllers
createFile('src/controllers/auth.controller.js', `import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Register user
const register = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      profile: { fullName }
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user including password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: await User.findById(user._id),
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// Get current user
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user data'
    });
  }
};

export {
  register,
  login,
  getMe
};`);

createFile('src/controllers/item.controller.js', `import ClothingItem from '../models/ClothingItem.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinary.service.js';
import fs from 'fs/promises';

// Create clothing item
const createItem = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.path);

    // Clean up local file
    await fs.unlink(req.file.path);

    // Create item
    const item = await ClothingItem.create({
      userId: req.user.id,
      name: req.body.name,
      category: req.body.category,
      imageUrl: uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id,
      color: req.body.color,
      brand: req.body.brand,
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      season: req.body.season ? JSON.parse(req.body.season) : [],
      occasion: req.body.occasion ? JSON.parse(req.body.occasion) : [],
      size: req.body.size,
      material: req.body.material,
      price: req.body.price
    });

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: { item }
    });

  } catch (error) {
    // Clean up file on error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error cleaning up file:', unlinkError);
      }
    }

    console.error('Create item error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error creating item'
    });
  }
};

// Get user's items
const getItems = async (req, res) => {
  try {
    const { 
      category, 
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = { userId: req.user.id, status: 'active' };
    if (category) filter.category = category;

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const items = await ClothingItem.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ClothingItem.countDocuments(filter);

    res.json({
      success: true,
      data: { items },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching items'
    });
  }
};

// Update item
const updateItem = async (req, res) => {
  try {
    let item = await ClothingItem.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    item = await ClothingItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Item updated successfully',
      data: { item }
    });

  } catch (error) {
    console.error('Update item error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error updating item'
    });
  }
};

// Delete item
const deleteItem = async (req, res) => {
  try {
    const item = await ClothingItem.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(item.cloudinaryId);

    // Delete from database
    await ClothingItem.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });

  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting item'
    });
  }
};

export {
  createItem,
  getItems,
  updateItem,
  deleteItem
};`);

createFile('src/controllers/outfit.controller.js', `import Outfit from '../models/Outfit.js';
import ClothingItem from '../models/ClothingItem.js';

// Create outfit
const createOutfit = async (req, res) => {
  try {
    const { name, items, description, occasion, season, tags } = req.body;

    // Validate items belong to user
    const userItems = await ClothingItem.find({
      _id: { $in: items },
      userId: req.user.id,
      status: 'active'
    });

    if (userItems.length !== items.length) {
      return res.status(400).json({
        success: false,
        message: 'Some items not found or unavailable'
      });
    }

    // Generate AI analysis
    const aiAnalysis = await analyzeOutfit(items);

    const outfit = await Outfit.create({
      userId: req.user.id,
      name,
      description,
      items,
      aiAnalysis,
      occasion,
      season: season || [],
      tags: tags || []
    });

    // Populate items for response
    await outfit.populate('items');

    res.status(201).json({
      success: true,
      message: 'Outfit created successfully',
      data: { outfit }
    });

  } catch (error) {
    console.error('Create outfit error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating outfit'
    });
  }
};

// Get user's outfits
const getOutfits = async (req, res) => {
  try {
    const { 
      occasion, 
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = { userId: req.user.id };
    if (occasion) filter.occasion = occasion;

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const outfits = await Outfit.find(filter)
      .populate('items')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Outfit.countDocuments(filter);

    res.json({
      success: true,
      data: { outfits },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get outfits error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching outfits'
    });
  }
};

// AI analysis helper
const analyzeOutfit = async (itemIds) => {
  try {
    const items = await ClothingItem.find({ _id: { $in: itemIds } });
    
    // Simple analysis simulation
    const colorHarmony = analyzeColorHarmony(items);
    const styleCohesion = analyzeStyleCohesion(items);
    const occasionAppropriateness = analyzeOccasion(items);

    const overallScore = Math.round(
      (colorHarmony.score + styleCohesion.score + occasionAppropriateness.score) / 3
    );

    return {
      overallScore,
      colorHarmony,
      styleCohesion,
      occasionAppropriateness,
      strengths: generateStrengths(overallScore),
      improvements: generateImprovements(overallScore),
      generatedAt: new Date()
    };

  } catch (error) {
    console.error('Outfit analysis error:', error);
    return {
      overallScore: 0,
      colorHarmony: { score: 0, feedback: 'Analysis failed' },
      styleCohesion: { score: 0, feedback: 'Analysis failed' },
      occasionAppropriateness: { score: 0, feedback: 'Analysis failed' },
      strengths: [],
      improvements: ['Unable to analyze outfit'],
      generatedAt: new Date()
    };
  }
};

// Analysis helper functions
const analyzeColorHarmony = (items) => {
  const colors = items.map(item => item.color);
  const uniqueColors = [...new Set(colors)];
  
  let score = 70; // Base score
  
  if (uniqueColors.length <= 3) score += 15;
  if (uniqueColors.length >= 5) score -= 10;
  
  const hasNeutrals = colors.some(color => 
    ['black', 'white', 'gray', 'navy', 'beige', 'brown'].includes(color.toLowerCase())
  );
  if (hasNeutrals) score += 10;

  return {
    score: Math.min(Math.max(score, 0), 100),
    feedback: score >= 80 ? 'Great color combination!' : 
              score >= 60 ? 'Good color harmony' : 
              'Consider adjusting colors'
  };
};

const analyzeStyleCohesion = (items) => {
  const categories = items.map(item => item.category);
  const required = ['top', 'bottom', 'shoes'];
  const missing = required.filter(cat => !categories.includes(cat));
  
  const score = Math.max(0, 100 - (missing.length * 25));
  
  return {
    score,
    feedback: missing.length === 0 ? 'Complete outfit!' : \`Missing: \${missing.join(', ')}\`
  };
};

const analyzeOccasion = (items) => {
  return {
    score: 75,
    feedback: 'Best suited for casual occasions'
  };
};

const generateStrengths = (score) => {
  if (score >= 80) return ['Excellent coordination', 'Well-balanced outfit'];
  if (score >= 60) return ['Good item combination', 'Appropriate style'];
  return ['All items from your wardrobe'];
};

const generateImprovements = (score) => {
  if (score >= 80) return ['Consider adding accessories'];
  if (score >= 60) return ['Try different color combinations'];
  return ['Add more items to complete outfit'];
};

export {
  createOutfit,
  getOutfits
};`);

// Create routes
createFile('src/routes/auth.routes.js', `import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe } from '../controllers/auth.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('username').isLength({ min: 3, max: 30 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
];

const loginValidation = [
  body('email').isEmail(),
  body('password').exists()
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', auth, getMe);

export default router;`);

createFile('src/routes/users.routes.js', `import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/profile', (req, res) => {
  res.json({
    success: true,
    data: { user: req.user }
  });
});

export default router;`);

createFile('src/routes/items.routes.js', `import express from 'express';
import { body } from 'express-validator';
import { 
  createItem, 
  getItems, 
  updateItem, 
  deleteItem 
} from '../controllers/item.controller.js';
import auth from '../middleware/auth.js';
import { upload, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

router.use(auth);

// Validation rules
const itemValidation = [
  body('name').notEmpty(),
  body('category').isIn(['top', 'bottom', 'shoes', 'accessories', 'outerwear', 'dress']),
  body('color').notEmpty()
];

router.route('/')
  .get(getItems)
  .post(upload.single('image'), handleUploadError, itemValidation, createItem);

router.route('/:id')
  .put(itemValidation, updateItem)
  .delete(deleteItem);

export default router;`);

createFile('src/routes/outfits.routes.js', `import express from 'express';
import { createOutfit, getOutfits } from '../controllers/outfit.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.route('/')
  .get(getOutfits)
  .post(createOutfit);

export default router;`);

// Create test script
createFile('test-api.js', `import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const test = async (name, fn) => {
  try {
    await fn();
    console.log(\`✅ \${name}\`);
  } catch (error) {
    console.log(\`❌ \${name}: \${error.message}\`);
  }
};

const runTests = async () => {
  console.log('🚀 Starting API Tests...\\n');

  // Test 1: Health Check
  await test('Health Check', async () => {
    const response = await axios.get(\`\${API_BASE}/health\`);
    if (!response.data.success) throw new Error('Health check failed');
  });

  // Test 2: User Registration
  await test('User Registration', async () => {
    const userData = {
      username: \`testuser_\${Date.now()}\`,
      email: \`test_\${Date.now()}@example.com\`,
      password: 'password123',
      fullName: 'Test User'
    };

    const response = await axios.post(\`\${API_BASE}/auth/register\`, userData);
    if (!response.data.success) throw new Error('Registration failed');
    console.log(\`   👤 User ID: \${response.data.data.user._id}\`);
  });

  console.log('\\n🎉 Basic tests completed!');
};

runTests().catch(console.error);`);

// Create README
createFile('README.md', `# 🎯 Bespoke AI Backend

A modern Node.js backend for AI-powered fashion styling application.
`);
