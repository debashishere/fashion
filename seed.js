import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ClothingItem from './src/models/ClothingItem.js';
import Outfit from './src/models/Outfit.js';
import User from './src/models/User.js';


dotenv.config();

// Sample data
const SAMPLE_USERS = [
  {
    username: 'fashionista',
    email: 'fashionista@example.com',
    password: 'password123',
    profile: {
      fullName: 'Emma Style',
      bio: 'Fashion enthusiast and style blogger',
      stylePersonality: 'minimalist'
    },
    preferences: {
      preferredColors: ['black', 'white', 'navy', 'beige'],
      avoidedColors: ['neon green', 'hot pink'],
      fitPreference: 'regular'
    }
  },
  {
    username: 'streetwear_king',
    email: 'streetwear@example.com',
    password: 'password123',
    profile: {
      fullName: 'Alex Chen',
      bio: 'Streetwear collector and sneakerhead',
      stylePersonality: 'streetwear'
    },
    preferences: {
      preferredColors: ['black', 'gray', 'olive', 'burgundy'],
      avoidedColors: ['pastel pink', 'lavender'],
      fitPreference: 'loose'
    }
  },
  {
    username: 'classic_elegance',
    email: 'classic@example.com',
    password: 'password123',
    profile: {
      fullName: 'Sophia Williams',
      bio: 'Love timeless and elegant fashion',
      stylePersonality: 'formal'
    },
    preferences: {
      preferredColors: ['navy', 'white', 'gray', 'burgundy'],
      avoidedColors: ['bright orange', 'yellow'],
      fitPreference: 'slim'
    }
  }
];

const SAMPLE_COLORS = [
  'black', 'white', 'gray', 'navy', 'blue', 'red', 'green', 
  'yellow', 'pink', 'purple', 'orange', 'brown', 'beige', 
  'burgundy', 'teal', 'olive', 'maroon', 'cream'
];

const SAMPLE_BRANDS = [
  'Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo', 'Levi\'s', 
  'Ralph Lauren', 'Tommy Hilfiger', 'Calvin Klein', 'Gucci',
  'Prada', 'Louis Vuitton', 'Chanel', 'Dior', 'Burberry'
];

const SAMPLE_MATERIALS = [
  'cotton', 'denim', 'wool', 'silk', 'linen', 'polyester',
  'cashmere', 'leather', 'suede', 'velvet', 'nylon', 'spandex'
];

const SAMPLE_TAGS = {
  top: ['casual', 'formal', 'v-neck', 'crew-neck', 'long-sleeve', 'short-sleeve', 'button-down', 'hoodie', 'sweater'],
  bottom: ['jeans', 'chinos', 'shorts', 'skirt', 'dress-pants', 'leggings', 'cargo', 'sweatpants'],
  shoes: ['sneakers', 'boots', 'loafers', 'heels', 'sandals', 'flats', 'oxfords', 'espadrilles'],
  accessories: ['minimal', 'statement', 'leather', 'gold', 'silver', 'vintage', 'modern'],
  outerwear: ['jacket', 'coat', 'blazer', 'raincoat', 'parka', 'bomber', 'trench'],
  dress: ['casual', 'cocktail', 'maxi', 'mini', 'midi', 'bodycon', 'a-line']
};

// Sample clothing items for different categories
const generateSampleItems = (userId) => [
  // TOPS
  {
    userId,
    name: 'Classic White T-Shirt',
    category: 'top',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    cloudinaryId: 'sample-white-tshirt',
    color: 'white',
    brand: 'Uniqlo',
    tags: ['casual', 'basic', 'crew-neck', 'cotton'],
    season: ['spring', 'summer', 'fall'],
    occasion: ['casual', 'sport'],
    size: 'M',
    material: 'cotton',
    price: 25.99,
    isFavorite: true
  },
  {
    userId,
    name: 'Black Denim Jacket',
    category: 'outerwear',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
    cloudinaryId: 'sample-black-jacket',
    color: 'black',
    brand: 'Levi\'s',
    tags: ['jacket', 'denim', 'casual'],
    season: ['spring', 'fall'],
    occasion: ['casual', 'date'],
    size: 'M',
    material: 'denim',
    price: 89.99,
    isFavorite: false
  },
  {
    userId,
    name: 'Navy Blue Blazer',
    category: 'outerwear',
    imageUrl: 'https://images.unsplash.com/photo-1594938373333-1c67d0eaa5a8?w=400',
    cloudinaryId: 'sample-navy-blazer',
    color: 'navy',
    brand: 'Ralph Lauren',
    tags: ['blazer', 'formal', 'business'],
    season: ['fall', 'winter'],
    occasion: ['formal', 'business'],
    size: 'M',
    material: 'wool',
    price: 199.99,
    isFavorite: true
  },
  {
    userId,
    name: 'Red Flannel Shirt',
    category: 'top',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
    cloudinaryId: 'sample-red-flannel',
    color: 'red',
    brand: 'Tommy Hilfiger',
    tags: ['casual', 'flannel', 'plaid'],
    season: ['fall', 'winter'],
    occasion: ['casual', 'date'],
    size: 'M',
    material: 'cotton',
    price: 59.99,
    isFavorite: false
  },

  // BOTTOMS
  {
    userId,
    name: 'Slim Black Jeans',
    category: 'bottom',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    cloudinaryId: 'sample-black-jeans',
    color: 'black',
    brand: 'Zara',
    tags: ['jeans', 'slim-fit', 'casual'],
    season: ['all-season'],
    occasion: ['casual', 'date'],
    size: '32x32',
    material: 'denim',
    price: 69.99,
    isFavorite: true
  },
  {
    userId,
    name: 'Beige Chino Pants',
    category: 'bottom',
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400',
    cloudinaryId: 'sample-beige-chinos',
    color: 'beige',
    brand: 'H&M',
    tags: ['chinos', 'casual', 'business'],
    season: ['spring', 'summer'],
    occasion: ['casual', 'business'],
    size: '32x32',
    material: 'cotton',
    price: 45.99,
    isFavorite: false
  },
  {
    userId,
    name: 'Blue Denim Shorts',
    category: 'bottom',
    imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
    cloudinaryId: 'sample-blue-shorts',
    color: 'blue',
    brand: 'Levi\'s',
    tags: ['shorts', 'denim', 'casual'],
    season: ['summer'],
    occasion: ['casual', 'beach'],
    size: 'M',
    material: 'denim',
    price: 39.99,
    isFavorite: false
  },

  // SHOES
  {
    userId,
    name: 'White Leather Sneakers',
    category: 'shoes',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
    cloudinaryId: 'sample-white-sneakers',
    color: 'white',
    brand: 'Adidas',
    tags: ['sneakers', 'casual', 'comfort'],
    season: ['all-season'],
    occasion: ['casual', 'sport'],
    size: '10',
    material: 'leather',
    price: 89.99,
    isFavorite: true
  },
  {
    userId,
    name: 'Brown Leather Boots',
    category: 'shoes',
    imageUrl: 'https://images.unsplash.com/photo-1542280756-74b2f55e73ab?w=400',
    cloudinaryId: 'sample-brown-boots',
    color: 'brown',
    brand: 'Timberland',
    tags: ['boots', 'casual', 'durable'],
    season: ['fall', 'winter'],
    occasion: ['casual', 'travel'],
    size: '10',
    material: 'leather',
    price: 149.99,
    isFavorite: false
  },
  {
    userId,
    name: 'Black Formal Shoes',
    category: 'shoes',
    imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400',
    cloudinaryId: 'sample-black-formal',
    color: 'black',
    brand: 'Calvin Klein',
    tags: ['formal', 'business', 'leather'],
    season: ['all-season'],
    occasion: ['formal', 'business'],
    size: '10',
    material: 'leather',
    price: 129.99,
    isFavorite: true
  },

  // ACCESSORIES
  {
    userId,
    name: 'Silver Watch',
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400',
    cloudinaryId: 'sample-silver-watch',
    color: 'silver',
    brand: 'Fossil',
    tags: ['minimal', 'silver', 'modern'],
    season: ['all-season'],
    occasion: ['casual', 'business'],
    size: 'standard',
    material: 'stainless steel',
    price: 159.99,
    isFavorite: true
  },
  {
    userId,
    name: 'Brown Leather Belt',
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=400',
    cloudinaryId: 'sample-brown-belt',
    color: 'brown',
    brand: 'Gucci',
    tags: ['leather', 'classic', 'brown'],
    season: ['all-season'],
    occasion: ['casual', 'business'],
    size: 'M',
    material: 'leather',
    price: 89.99,
    isFavorite: false
  },
  {
    userId,
    name: 'Black Sunglasses',
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
    cloudinaryId: 'sample-black-sunglasses',
    color: 'black',
    brand: 'Ray-Ban',
    tags: ['modern', 'black', 'uv-protection'],
    season: ['spring', 'summer'],
    occasion: ['casual', 'beach'],
    size: 'standard',
    material: 'plastic',
    price: 149.99,
    isFavorite: true
  },

  // DRESSES (for female users)
  {
    userId,
    name: 'Black Cocktail Dress',
    category: 'dress',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
    cloudinaryId: 'sample-black-dress',
    color: 'black',
    brand: 'Zara',
    tags: ['cocktail', 'elegant', 'little-black-dress'],
    season: ['all-season'],
    occasion: ['formal', 'party'],
    size: 'M',
    material: 'polyester',
    price: 79.99,
    isFavorite: true
  },
  {
    userId,
    name: 'Floral Summer Dress',
    category: 'dress',
    imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400',
    cloudinaryId: 'sample-floral-dress',
    color: 'pink',
    brand: 'H&M',
    tags: ['casual', 'floral', 'summer'],
    season: ['spring', 'summer'],
    occasion: ['casual', 'date'],
    size: 'M',
    material: 'cotton',
    price: 49.99,
    isFavorite: false
  }
];

// Sample outfits combining the items
const generateSampleOutfits = (userId, itemIds) => [
  {
    userId,
    name: 'Casual Weekend Look',
    description: 'Perfect for brunch or casual outings',
    items: [itemIds[0], itemIds[4], itemIds[7]], // White tee + black jeans + white sneakers
    occasion: 'casual',
    season: ['spring', 'summer', 'fall'],
    tags: ['weekend', 'comfortable', 'minimal'],
    isFavorite: true,
    aiAnalysis: {
      overallScore: 88,
      colorHarmony: {
        score: 90,
        feedback: 'Excellent monochromatic scheme with white accents'
      },
      styleCohesion: {
        score: 85,
        feedback: 'Well-balanced casual outfit'
      },
      occasionAppropriateness: {
        score: 89,
        feedback: 'Perfect for casual weekend activities'
      },
      strengths: ['Great color coordination', 'Comfortable and practical', 'Versatile for multiple occasions'],
      improvements: ['Consider adding a watch for completeness'],
      generatedAt: new Date()
    }
  },
  {
    userId,
    name: 'Business Casual',
    description: 'Professional yet comfortable office wear',
    items: [itemIds[2], itemIds[5], itemIds[9]], // Navy blazer + beige chinos + black formal shoes
    occasion: 'business',
    season: ['fall', 'winter'],
    tags: ['office', 'professional', 'smart'],
    isFavorite: true,
    aiAnalysis: {
      overallScore: 92,
      colorHarmony: {
        score: 95,
        feedback: 'Classic navy and beige combination works perfectly'
      },
      styleCohesion: {
        score: 90,
        feedback: 'Professional and well-put-together'
      },
      occasionAppropriateness: {
        score: 91,
        feedback: 'Ideal for business settings'
      },
      strengths: ['Professional appearance', 'Classic color palette', 'Appropriate for office'],
      improvements: ['Add a dress shirt underneath the blazer'],
      generatedAt: new Date()
    }
  },
  {
    userId,
    name: 'Date Night Outfit',
    description: 'Stylish and confident for evening dates',
    items: [itemIds[3], itemIds[4], itemIds[7], itemIds[10]], // Red flannel + black jeans + white sneakers + silver watch
    occasion: 'date',
    season: ['fall', 'winter'],
    tags: ['date', 'evening', 'stylish'],
    isFavorite: false,
    aiAnalysis: {
      overallScore: 85,
      colorHarmony: {
        score: 82,
        feedback: 'Good contrast between red and black'
      },
      styleCohesion: {
        score: 87,
        feedback: 'Stylish and contemporary'
      },
      occasionAppropriateness: {
        score: 86,
        feedback: 'Great for casual dinner dates'
      },
      strengths: ['Fashion-forward', 'Comfortable yet stylish', 'Good accessory choice'],
      improvements: ['Consider a darker shoe option for evening'],
      generatedAt: new Date()
    }
  },
  {
    userId,
    name: 'Summer Beach Day',
    description: 'Light and comfortable for warm weather',
    items: [itemIds[0], itemIds[6], itemIds[7], itemIds[12]], // White tee + blue shorts + white sneakers + sunglasses
    occasion: 'casual',
    season: ['summer'],
    tags: ['beach', 'summer', 'light'],
    isFavorite: false,
    aiAnalysis: {
      overallScore: 83,
      colorHarmony: {
        score: 85,
        feedback: 'Fresh and light summer colors'
      },
      styleCohesion: {
        score: 80,
        feedback: 'Perfect for warm weather'
      },
      occasionAppropriateness: {
        score: 84,
        feedback: 'Ideal for beach or summer outings'
      },
      strengths: ['Breathable materials', 'Summer-appropriate', 'Comfortable for warm weather'],
      improvements: ['Add a hat for sun protection'],
      generatedAt: new Date()
    }
  },
  {
    userId,
    name: 'Formal Evening',
    description: 'Elegant and sophisticated for special occasions',
    items: [itemIds[13], itemIds[9], itemIds[10]], // Black dress + black formal shoes + silver watch
    occasion: 'formal',
    season: ['all-season'],
    tags: ['formal', 'elegant', 'evening'],
    isFavorite: true,
    aiAnalysis: {
      overallScore: 94,
      colorHarmony: {
        score: 96,
        feedback: 'Classic black and silver elegance'
      },
      styleCohesion: {
        score: 92,
        feedback: 'Sophisticated and complete'
      },
      occasionAppropriateness: {
        score: 94,
        feedback: 'Perfect for formal events and evenings'
      },
      strengths: ['Timeless elegance', 'Perfect for special occasions', 'Well-accessorized'],
      improvements: ['Consider adding statement jewelry'],
      generatedAt: new Date()
    }
  }
];

class Seeder {
  constructor() {
    this.users = [];
    this.items = [];
    this.outfits = [];
  }

  async connectDB() {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      process.exit(1);
    }
  }

  async clearDatabase() {
    try {
      await ClothingItem.deleteMany({});
      await Outfit.deleteMany({});
      console.log('✅ Cleared existing data');
    } catch (error) {
      console.error('❌ Error clearing database:', error);
    }
  }

  async createUsers() {
    try {
      console.log('👤 Creating sample users...');
      
      for (const userData of SAMPLE_USERS) {
        const user = new User(userData);
        await user.save();
        this.users.push(user);
        console.log(`   Created user: ${user.username}`);
      }
      
      console.log(`✅ Created ${this.users.length} users`);
    } catch (error) {
      console.error('❌ Error creating users:', error);
    }
  }

async createItems() {
  try {
    console.log('👕 Creating sample clothing items...');
    
    for (const user of this.users) {
      const userItems = this.generateSampleItems(user._id);
      
      for (const itemData of userItems) {
        try {
          const item = new ClothingItem(itemData);
          await item.save();
          this.items.push(item);
        } catch (itemError) {
          console.log(`   ⚠️ Failed to create item "${itemData.name}": ${itemError.message}`);
          // Skip this item and continue with others
          continue;
        }
      }
      
      console.log(`   Created items for ${user.username}`);
    }
    
    console.log(`✅ Created ${this.items.length} total items`);
  } catch (error) {
    console.error('❌ Error creating items:', error);
  }
}

// Fixed generateSampleItems method with valid occasion values
generateSampleItems(userId) {
  // Valid occasion values based on your model enum
  const VALID_OCCASIONS = ['casual', 'formal', 'business', 'sport', 'evening', 'beach'];
  
  return [
    // TOPS
    {
      userId,
      name: 'Classic White T-Shirt',
      category: 'top',
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      cloudinaryId: `sample-white-tshirt-${userId}`,
      color: 'white',
      brand: 'Uniqlo',
      tags: ['casual', 'basic', 'crew-neck', 'cotton'],
      season: ['spring', 'summer', 'fall'],
      occasion: ['casual', 'sport'], // Using valid values
      size: 'M',
      material: 'cotton',
      price: 25.99,
      isFavorite: true
    },
    {
      userId,
      name: 'Black Denim Jacket',
      category: 'outerwear',
      imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
      cloudinaryId: `sample-black-jacket-${userId}`,
      color: 'black',
      brand: 'Levi\'s',
      tags: ['jacket', 'denim', 'casual'],
      season: ['spring', 'fall'],
      occasion: ['casual'], // Using valid values
      size: 'M',
      material: 'denim',
      price: 89.99,
      isFavorite: false
    },
    {
      userId,
      name: 'Navy Blue Blazer',
      category: 'outerwear',
      imageUrl: 'https://images.unsplash.com/photo-1594938373333-1c67d0eaa5a8?w=400',
      cloudinaryId: `sample-navy-blazer-${userId}`,
      color: 'navy',
      brand: 'Ralph Lauren',
      tags: ['blazer', 'formal', 'business'],
      season: ['fall', 'winter'],
      occasion: ['formal', 'business'], // Using valid values
      size: 'M',
      material: 'wool',
      price: 199.99,
      isFavorite: true
    },
    {
      userId,
      name: 'Red Flannel Shirt',
      category: 'top',
      imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
      cloudinaryId: `sample-red-flannel-${userId}`,
      color: 'red',
      brand: 'Tommy Hilfiger',
      tags: ['casual', 'flannel', 'plaid'],
      season: ['fall', 'winter'],
      occasion: ['casual'], // Using valid values (removed 'date')
      size: 'M',
      material: 'cotton',
      price: 59.99,
      isFavorite: false
    },

    // BOTTOMS
    {
      userId,
      name: 'Slim Black Jeans',
      category: 'bottom',
      imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
      cloudinaryId: `sample-black-jeans-${userId}`,
      color: 'black',
      brand: 'Zara',
      tags: ['jeans', 'slim-fit', 'casual'],
      season: ['all-season'],
      occasion: ['casual'], // Using valid values (removed 'date')
      size: '32x32',
      material: 'denim',
      price: 69.99,
      isFavorite: true
    },
    {
      userId,
      name: 'Beige Chino Pants',
      category: 'bottom',
      imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400',
      cloudinaryId: `sample-beige-chinos-${userId}`,
      color: 'beige',
      brand: 'H&M',
      tags: ['chinos', 'casual', 'business'],
      season: ['spring', 'summer'],
      occasion: ['casual', 'business'], // Using valid values
      size: '32x32',
      material: 'cotton',
      price: 45.99,
      isFavorite: false
    },
    {
      userId,
      name: 'Blue Denim Shorts',
      category: 'bottom',
      imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
      cloudinaryId: `sample-blue-shorts-${userId}`,
      color: 'blue',
      brand: 'Levi\'s',
      tags: ['shorts', 'denim', 'casual'],
      season: ['summer'],
      occasion: ['casual', 'beach'], // Using valid values
      size: 'M',
      material: 'denim',
      price: 39.99,
      isFavorite: false
    },

    // SHOES
    {
      userId,
      name: 'White Leather Sneakers',
      category: 'shoes',
      imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
      cloudinaryId: `sample-white-sneakers-${userId}`,
      color: 'white',
      brand: 'Adidas',
      tags: ['sneakers', 'casual', 'comfort'],
      season: ['all-season'],
      occasion: ['casual', 'sport'], // Using valid values
      size: '10',
      material: 'leather',
      price: 89.99,
      isFavorite: true
    },
    {
      userId,
      name: 'Brown Leather Boots',
      category: 'shoes',
      imageUrl: 'https://images.unsplash.com/photo-1542280756-74b2f55e73ab?w=400',
      cloudinaryId: `sample-brown-boots-${userId}`,
      color: 'brown',
      brand: 'Timberland',
      tags: ['boots', 'casual', 'durable'],
      season: ['fall', 'winter'],
      occasion: ['casual'], // Using valid values (removed 'travel')
      size: '10',
      material: 'leather',
      price: 149.99,
      isFavorite: false
    },
    {
      userId,
      name: 'Black Formal Shoes',
      category: 'shoes',
      imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400',
      cloudinaryId: `sample-black-formal-${userId}`,
      color: 'black',
      brand: 'Calvin Klein',
      tags: ['formal', 'business', 'leather'],
      season: ['all-season'],
      occasion: ['formal', 'business'], // Using valid values
      size: '10',
      material: 'leather',
      price: 129.99,
      isFavorite: true
    },

    // ACCESSORIES
    {
      userId,
      name: 'Silver Watch',
      category: 'accessories',
      imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400',
      cloudinaryId: `sample-silver-watch-${userId}`,
      color: 'silver',
      brand: 'Fossil',
      tags: ['minimal', 'silver', 'modern'],
      season: ['all-season'],
      occasion: ['casual', 'business'], // Using valid values
      size: 'standard',
      material: 'stainless steel',
      price: 159.99,
      isFavorite: true
    },
    {
      userId,
      name: 'Brown Leather Belt',
      category: 'accessories',
      imageUrl: 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=400',
      cloudinaryId: `sample-brown-belt-${userId}`,
      color: 'brown',
      brand: 'Gucci',
      tags: ['leather', 'classic', 'brown'],
      season: ['all-season'],
      occasion: ['casual', 'business'], // Using valid values
      size: 'M',
      material: 'leather',
      price: 89.99,
      isFavorite: false
    },
    {
      userId,
      name: 'Black Sunglasses',
      category: 'accessories',
      imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
      cloudinaryId: `sample-black-sunglasses-${userId}`,
      color: 'black',
      brand: 'Ray-Ban',
      tags: ['modern', 'black', 'uv-protection'],
      season: ['spring', 'summer'],
      occasion: ['casual', 'beach'], // Using valid values
      size: 'standard',
      material: 'plastic',
      price: 149.99,
      isFavorite: true
    },

    // DRESSES
    {
      userId,
      name: 'Black Cocktail Dress',
      category: 'dress',
      imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
      cloudinaryId: `sample-black-dress-${userId}`,
      color: 'black',
      brand: 'Zara',
      tags: ['cocktail', 'elegant', 'little-black-dress'],
      season: ['all-season'],
      occasion: ['formal', 'evening'], // Using valid values
      size: 'M',
      material: 'polyester',
      price: 79.99,
      isFavorite: true
    },
    {
      userId,
      name: 'Floral Summer Dress',
      category: 'dress',
      imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400',
      cloudinaryId: `sample-floral-dress-${userId}`,
      color: 'pink',
      brand: 'H&M',
      tags: ['casual', 'floral', 'summer'],
      season: ['spring', 'summer'],
      occasion: ['casual'], // Using valid values (removed 'date')
      size: 'M',
      material: 'cotton',
      price: 49.99,
      isFavorite: false
    }
  ];
}

async createOutfits() {
  try {
    console.log('👗 Creating sample outfits...');
    
    for (const user of this.users) {
      // Get items belonging to this user
      const userItems = this.items.filter(item => 
        item.userId.toString() === user._id.toString()
      );
      
      if (userItems.length < 3) {
        console.log(`   ⚠️ Skipping ${user.username} - not enough items (${userItems.length})`);
        continue;
      }
      
      const userItemIds = userItems.map(item => item._id);
      const userOutfits = this.generateSampleOutfits(user._id, userItems);
      
      for (const outfitData of userOutfits) {
        // Ensure we have at least 3 items for the outfit
        if (outfitData.items.length < 3) {
          console.log(`   ⚠️ Skipping outfit "${outfitData.name}" - not enough items`);
          continue;
        }
        
        const outfit = new Outfit(outfitData);
        await outfit.save();
        this.outfits.push(outfit);
      }
      
      console.log(`   Created ${userOutfits.length} outfits for ${user.username}`);
    }
    
    console.log(`✅ Created ${this.outfits.length} total outfits`);
  } catch (error) {
    console.error('❌ Error creating outfits:', error);
  }
}

// Updated generateSampleOutfits method
generateSampleOutfits(userId, userItems) {
  // Group items by category for easier selection
  const itemsByCategory = {
    top: userItems.filter(item => item.category === 'top'),
    bottom: userItems.filter(item => item.category === 'bottom'),
    shoes: userItems.filter(item => item.category === 'shoes'),
    accessories: userItems.filter(item => item.category === 'accessories'),
    outerwear: userItems.filter(item => item.category === 'outerwear'),
    dress: userItems.filter(item => item.category === 'dress')
  };

  const outfits = [];

  // Outfit 1: Casual Basic
  if (itemsByCategory.top.length > 0 && itemsByCategory.bottom.length > 0 && itemsByCategory.shoes.length > 0) {
    const top = this.getRandomItem(itemsByCategory.top);
    const bottom = this.getRandomItem(itemsByCategory.bottom);
    const shoes = this.getRandomItem(itemsByCategory.shoes);
    
    outfits.push({
      userId,
      name: 'Casual Everyday',
      description: 'Perfect for daily activities and casual outings',
      items: [top._id, bottom._id, shoes._id],
      occasion: 'casual',
      season: ['spring', 'summer', 'fall'],
      tags: ['casual', 'everyday', 'comfortable'],
      isFavorite: true,
      aiAnalysis: {
        overallScore: 85,
        colorHarmony: {
          score: 82,
          feedback: 'Good color coordination for casual wear'
        },
        styleCohesion: {
          score: 88,
          feedback: 'Well-balanced casual outfit'
        },
        occasionAppropriateness: {
          score: 85,
          feedback: 'Perfect for casual daily activities'
        },
        strengths: ['Comfortable', 'Versatile', 'Easy to wear'],
        improvements: ['Add a watch or simple accessories'],
        generatedAt: new Date()
      }
    });
  }

  // Outfit 2: Business Casual
  if (itemsByCategory.top.length > 0 && itemsByCategory.bottom.length > 0 && itemsByCategory.shoes.length > 0) {
    const top = this.getRandomItem(itemsByCategory.top.filter(item => 
      item.tags.some(tag => ['formal', 'button-down', 'blouse'].includes(tag))
    )) || this.getRandomItem(itemsByCategory.top);
    
    const bottom = this.getRandomItem(itemsByCategory.bottom.filter(item => 
      item.tags.some(tag => ['chinos', 'dress-pants', 'formal'].includes(tag))
    )) || this.getRandomItem(itemsByCategory.bottom);
    
    const shoes = this.getRandomItem(itemsByCategory.shoes.filter(item => 
      item.tags.some(tag => ['formal', 'business', 'leather'].includes(tag))
    )) || this.getRandomItem(itemsByCategory.shoes);

    if (top && bottom && shoes) {
      outfits.push({
        userId,
        name: 'Business Casual',
        description: 'Professional yet comfortable office wear',
        items: [top._id, bottom._id, shoes._id],
        occasion: 'business',
        season: ['fall', 'winter', 'spring'],
        tags: ['office', 'professional', 'smart'],
        isFavorite: true,
        aiAnalysis: {
          overallScore: 88,
          colorHarmony: {
            score: 86,
            feedback: 'Professional color combination'
          },
          styleCohesion: {
            score: 90,
            feedback: 'Appropriate for business settings'
          },
          occasionAppropriateness: {
            score: 88,
            feedback: 'Ideal for office environment'
          },
          strengths: ['Professional appearance', 'Well-put-together', 'Office-appropriate'],
          improvements: ['Consider adding a blazer or cardigan'],
          generatedAt: new Date()
        }
      });
    }
  }

  // Outfit 3: Date Night
  if (itemsByCategory.top.length > 0 && itemsByCategory.bottom.length > 0 && itemsByCategory.shoes.length > 0) {
    const top = this.getRandomItem(itemsByCategory.top.filter(item => 
      !item.tags.includes('basic') && !item.tags.includes('sport')
    )) || this.getRandomItem(itemsByCategory.top);
    
    const bottom = this.getRandomItem(itemsByCategory.bottom.filter(item => 
      item.tags.some(tag => ['jeans', 'dress-pants', 'skirt'].includes(tag))
    )) || this.getRandomItem(itemsByCategory.bottom);
    
    const shoes = this.getRandomItem(itemsByCategory.shoes.filter(item => 
      !item.tags.includes('sport') && !item.tags.includes('beach')
    )) || this.getRandomItem(itemsByCategory.shoes);

    // Add accessory if available
    const accessory = itemsByCategory.accessories.length > 0 ? 
      this.getRandomItem(itemsByCategory.accessories) : null;

    const dateItems = [top._id, bottom._id, shoes._id];
    if (accessory) {
      dateItems.push(accessory._id);
    }

    outfits.push({
      userId,
      name: 'Date Night',
      description: 'Stylish and confident for evening outings',
      items: dateItems,
      occasion: 'date',
      season: ['fall', 'winter'],
      tags: ['date', 'evening', 'stylish'],
      isFavorite: false,
      aiAnalysis: {
        overallScore: 87,
        colorHarmony: {
          score: 85,
          feedback: 'Good contrast and style for evening'
        },
        styleCohesion: {
          score: 89,
          feedback: 'Stylish and contemporary look'
        },
        occasionAppropriateness: {
          score: 87,
          feedback: 'Great for dinner dates and evening events'
        },
        strengths: ['Fashion-forward', 'Appropriate for evening', 'Well-accessorized'],
        improvements: ['Consider a jacket for cooler evenings'],
        generatedAt: new Date()
      }
    });
  }

  // Outfit 4: Weekend Comfort
  if (itemsByCategory.top.length > 0 && itemsByCategory.bottom.length > 0 && itemsByCategory.shoes.length > 0) {
    const top = this.getRandomItem(itemsByCategory.top.filter(item => 
      item.tags.some(tag => ['casual', 'comfort', 'hoodie', 'sweater'].includes(tag))
    )) || this.getRandomItem(itemsByCategory.top);
    
    const bottom = this.getRandomItem(itemsByCategory.bottom.filter(item => 
      item.tags.some(tag => ['jeans', 'sweatpants', 'casual'].includes(tag))
    )) || this.getRandomItem(itemsByCategory.bottom);
    
    const shoes = this.getRandomItem(itemsByCategory.shoes.filter(item => 
      item.tags.some(tag => ['sneakers', 'comfort', 'casual'].includes(tag))
    )) || this.getRandomItem(itemsByCategory.shoes);

    outfits.push({
      userId,
      name: 'Weekend Comfort',
      description: 'Relaxed and comfortable for weekend activities',
      items: [top._id, bottom._id, shoes._id],
      occasion: 'casual',
      season: ['all-season'],
      tags: ['weekend', 'comfort', 'relaxed'],
      isFavorite: true,
      aiAnalysis: {
        overallScore: 83,
        colorHarmony: {
          score: 80,
          feedback: 'Comfort-focused color scheme'
        },
        styleCohesion: {
          score: 85,
          feedback: 'Perfect for relaxed weekends'
        },
        occasionAppropriateness: {
          score: 84,
          feedback: 'Ideal for casual weekend activities'
        },
        strengths: ['Very comfortable', 'Easy to move in', 'Low maintenance'],
        improvements: ['Perfect as is for casual weekends'],
        generatedAt: new Date()
      }
    });
  }

  // Outfit 5: Smart Casual
  if (itemsByCategory.outerwear.length > 0 && itemsByCategory.top.length > 0 && itemsByCategory.bottom.length > 0 && itemsByCategory.shoes.length > 0) {
    const outerwear = this.getRandomItem(itemsByCategory.outerwear);
    const top = this.getRandomItem(itemsByCategory.top);
    const bottom = this.getRandomItem(itemsByCategory.bottom);
    const shoes = this.getRandomItem(itemsByCategory.shoes);

    outfits.push({
      userId,
      name: 'Smart Casual',
      description: 'Elevated casual look with layers',
      items: [outerwear._id, top._id, bottom._id, shoes._id],
      occasion: 'casual',
      season: ['fall', 'winter', 'spring'],
      tags: ['layered', 'smart', 'casual'],
      isFavorite: false,
      aiAnalysis: {
        overallScore: 89,
        colorHarmony: {
          score: 88,
          feedback: 'Well-layered with good color coordination'
        },
        styleCohesion: {
          score: 90,
          feedback: 'Sophisticated casual look'
        },
        occasionAppropriateness: {
          score: 89,
          feedback: 'Great for dinners or social gatherings'
        },
        strengths: ['Layered look', 'Versatile', 'Seasonally appropriate'],
        improvements: ['Consider adding a scarf for extra style'],
        generatedAt: new Date()
      }
    });
  }

  return outfits;
}

// Helper method to get random item from array
getRandomItem(items) {
  if (!items || items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)];
}

  async seed() {
    try {
      console.log('🌱 Starting database seeding...\n');
      
      await this.connectDB();
      await this.clearDatabase();
      await this.createUsers();
      await this.createItems();
      await this.createOutfits();
      
      console.log('\n🎉 Database seeding completed!');
      console.log('\n📊 Summary:');
      console.log(`   👤 Users: ${this.users.length}`);
      console.log(`   👕 Clothing Items: ${this.items.length}`);
      console.log(`   👗 Outfits: ${this.outfits.length}`);
      console.log('\n🔗 Sample user credentials:');
      this.users.forEach(user => {
        console.log(`   👉 ${user.username} / password123`);
      });
      
    } catch (error) {
      console.error('❌ Seeding failed:', error);
    } finally {
      await mongoose.connection.close();
      console.log('\n📴 Database connection closed');
    }
  }

  // Method to get sample data for testing
  getSampleData() {
    return {
      users: this.users,
      items: this.items,
      outfits: this.outfits
    };
  }
}

// Clean up

export const quickCleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('🧹 Starting quick cleanup...');
    
    const [items, outfits, users] = await Promise.all([
      ClothingItem.deleteMany({}),
      Outfit.deleteMany({}),
      User.deleteMany({ email: /example\.com$/ }) // Delete only example users
    ]);
    
    console.log('✅ Cleanup completed!');
    console.log(`📊 Deleted: ${items.deletedCount} items, ${outfits.deletedCount} outfits, ${users.deletedCount} users`);
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  } finally {
    await mongoose.connection.close();
  }
};



// Export for use in other files
export default Seeder;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const seeder = new Seeder();
  seeder.seed();
}



// Run immediately if called directly
// if (import.meta.url === `file://${process.argv[1]}`) {
//   quickCleanup();
// }