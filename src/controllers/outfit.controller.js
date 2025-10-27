import Outfit from '../models/Outfit.js';
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
    feedback: missing.length === 0 ? 'Complete outfit!' : `Missing: ${missing.join(', ')}`
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
};

// Get single outfit
const getOutfit = async (req, res) => {
  try {
    const outfit = await Outfit.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    }).populate('items');
    
    if (!outfit) {
      return res.status(404).json({
        success: false,
        message: 'Outfit not found'
      });
    }
    
    res.json({
      success: true,
      data: { outfit }
    });
  } catch (error) {
    console.error('Get outfit error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching outfit'
    });
  }
};

// Update outfit
const updateOutfit = async (req, res) => {
  try {
    let outfit = await Outfit.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!outfit) {
      return res.status(404).json({
        success: false,
        message: 'Outfit not found'
      });
    }
    
    outfit = await Outfit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('items');
    
    res.json({
      success: true,
      message: 'Outfit updated successfully',
      data: { outfit }
    });
  } catch (error) {
    console.error('Update outfit error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating outfit'
    });
  }
};

// Delete outfit
const deleteOutfit = async (req, res) => {
  try {
    const outfit = await Outfit.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!outfit) {
      return res.status(404).json({
        success: false,
        message: 'Outfit not found'
      });
    }
    
    await Outfit.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Outfit deleted successfully'
    });
  } catch (error) {
    console.error('Delete outfit error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting outfit'
    });
  }
};

// Like/unlike outfit
const likeOutfit = async (req, res) => {
  try {
    const outfit = await Outfit.findById(req.params.id);
    
    if (!outfit) {
      return res.status(404).json({
        success: false,
        message: 'Outfit not found'
      });
    }
    
    const hasLiked = outfit.likes.includes(req.user.id);
    
    if (hasLiked) {
      // Unlike
      outfit.likes = outfit.likes.filter(
        userId => userId.toString() !== req.user.id.toString()
      );
    } else {
      // Like
      outfit.likes.push(req.user.id);
    }
    
    await outfit.save();
    
    res.json({
      success: true,
      message: hasLiked ? 'Outfit unliked' : 'Outfit liked',
      data: { 
        likes: outfit.likes.length,
        hasLiked: !hasLiked
      }
    });
  } catch (error) {
    console.error('Like outfit error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating like'
    });
  }
};