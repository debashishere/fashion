import ClothingItem from '../models/ClothingItem.js';
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
};