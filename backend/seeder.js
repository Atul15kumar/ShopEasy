const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Wishlist = require('./models/Wishlist');
const Order = require('./models/Order');

const sampleCategories = [
  {
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    description: 'Top-rated tech gadgets, smart devices, and computer accessories.',
  },
  {
    name: 'Fashion & Apparel',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80',
    description: 'Trendsetting designer apparel, jackets, and everyday wear.',
  },
  {
    name: 'Footwear & Shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    description: 'Performance sneakers, casual trainers, and luxury footwear.',
  },
  {
    name: 'Audio & Acoustics',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
    description: 'Noise-cancelling wireless headphones and studio-grade sound.',
  },
  {
    name: 'Smart Watches',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    description: 'Fitness trackers, AMOLED smartwatches, and wearable tech.',
  },
  {
    name: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80',
    description: 'Modern aesthetic home decor, lighting, and workspace gear.',
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopeasy';
    await mongoose.connect(mongoUri);
    console.log('[Seeder] Connected to MongoDB');

    // Clean existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();
    await Order.deleteMany();

    console.log('[Seeder] Cleared previous database records.');

    // 1. Create Users
    const adminUser = await User.create({
      name: 'ShopEasy Admin',
      email: 'admin@shopeasy.com',
      password: 'AdminPassword123!',
      phone: '+1 (555) 019-2834',
      role: 'admin',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    });

    const demoUser = await User.create({
      name: 'Alex Johnson',
      email: 'alex@shopeasy.com',
      password: 'UserPassword123!',
      phone: '+1 (555) 014-8921',
      role: 'user',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80',
      addresses: [
        {
          fullName: 'Alex Johnson',
          phone: '+1 (555) 014-8921',
          houseFlat: 'Apt 4B, Skyline Towers',
          street: '742 Evergreen Terrace',
          city: 'San Francisco',
          state: 'California',
          pinCode: '94102',
          country: 'United States',
          isDefault: true,
        },
        {
          fullName: 'Alex Johnson (Office)',
          phone: '+1 (555) 014-8921',
          houseFlat: 'Floor 12, Tech Park',
          street: '100 Market Street',
          city: 'San Francisco',
          state: 'California',
          pinCode: '94105',
          country: 'United States',
          isDefault: false,
        },
      ],
    });

    console.log('[Seeder] Seeded Admin and Customer users.');

    // 2. Create Categories
    const createdCategories = await Category.insertMany(sampleCategories);
    const catMap = {};
    createdCategories.forEach((cat) => {
      catMap[cat.name] = cat._id;
    });

    console.log(`[Seeder] Seeded ${createdCategories.length} categories.`);

    // 3. Create Sample Products
    const sampleProducts = [
      {
        name: 'Aura SoundFlow Wireless ANC Headphones',
        description: 'Immerse yourself in pristine acoustic clarity with active hybrid noise cancellation, 40-hour ultra-long battery life, and plush memory foam ear cushions.',
        price: 199.99,
        discountPrice: 149.99,
        category: catMap['Audio & Acoustics'],
        brand: 'SoundPulse',
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
        ],
        rating: 4.8,
        numReviews: 128,
        stock: 25,
        specifications: [
          { key: 'Connectivity', value: 'Bluetooth 5.3 + 3.5mm Aux' },
          { key: 'Battery Life', value: 'Up to 40 Hours' },
          { key: 'Driver Size', value: '40mm Custom Dynamic' },
          { key: 'Weight', value: '250g' },
        ],
        isFeatured: true,
        isPopular: true,
        isNewArrival: false,
        isBestSeller: true,
      },
      {
        name: 'Veloce Pro Ergonomic Running Sneakers',
        description: 'Engineered for athletes and everyday city explorers. Features responsive energy-returning foam cushioning, breathable mesh weave, and non-slip rubber outsoles.',
        price: 139.0,
        discountPrice: 109.0,
        category: catMap['Footwear & Shoes'],
        brand: 'AeroStep',
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
          'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
        ],
        rating: 4.9,
        numReviews: 245,
        stock: 18,
        specifications: [
          { key: 'Upper Material', value: 'Breathable Knit Mesh' },
          { key: 'Sole Material', value: 'High Rebound EVA & Rubber' },
          { key: 'Closure', value: 'Lace-Up' },
          { key: 'Origin', value: 'Imported' },
        ],
        isFeatured: true,
        isPopular: true,
        isNewArrival: true,
        isBestSeller: true,
      },
      {
        name: 'Titan Horizon AMOLED Smartwatch',
        description: 'Ultra-thin bezel with sapphire glass 1.43" AMOLED display. Features real-time heart rate, SpO2 monitoring, GPS tracking, and IP68 water resistance.',
        price: 249.99,
        discountPrice: 189.99,
        category: catMap['Smart Watches'],
        brand: 'Chronos',
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
          'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80',
        ],
        rating: 4.7,
        numReviews: 89,
        stock: 15,
        specifications: [
          { key: 'Display', value: '1.43" Super AMOLED 466x466' },
          { key: 'Battery', value: '10 Days Regular Use' },
          { key: 'Water Resistance', value: '5 ATM / 50m' },
          { key: 'Compatibility', value: 'iOS & Android' },
        ],
        isFeatured: true,
        isPopular: false,
        isNewArrival: true,
        isBestSeller: false,
      },
      {
        name: 'Urban Explorer Minimalist Waterproof Backpack',
        description: 'Crafted with recycled waterproof ripstop nylon. Dedicated padded compartment fits up to 16" laptops, with hidden anti-theft pockets and USB pass-through.',
        price: 89.99,
        discountPrice: 69.99,
        category: catMap['Fashion & Apparel'],
        brand: 'NomadGear',
        images: [
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
          'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80',
        ],
        rating: 4.6,
        numReviews: 74,
        stock: 30,
        specifications: [
          { key: 'Capacity', value: '24 Liters' },
          { key: 'Laptop Fit', value: 'Up to 16 Inches' },
          { key: 'Material', value: 'Waterproof 900D Nylon' },
          { key: 'Zippers', value: 'YKK Weather-Resistant' },
        ],
        isFeatured: false,
        isPopular: true,
        isNewArrival: false,
        isBestSeller: true,
      },
      {
        name: 'Lumix Beam Minimalist Desk Lamp',
        description: 'Eye-caring architectural LED lamp with touch-sensitive dimming, 5 color temperature modes, and an integrated 15W wireless charging pad.',
        price: 79.5,
        discountPrice: 59.99,
        category: catMap['Home & Living'],
        brand: 'NordicLight',
        images: [
          'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
        ],
        rating: 4.5,
        numReviews: 42,
        stock: 22,
        specifications: [
          { key: 'Brightness', value: '800 Lumens (Dimmable)' },
          { key: 'Color Temp', value: '2700K - 6500K' },
          { key: 'Wireless Charging', value: 'Qi 15W Fast Charge' },
        ],
        isFeatured: false,
        isPopular: true,
        isNewArrival: true,
        isBestSeller: false,
      },
      {
        name: 'Apex Mechanical Gaming Keyboard RGB',
        description: 'Hot-swappable tactile mechanical switches with per-key dynamic RGB lighting, sound-dampening silicone gaskets, and premium CNC aluminum frame.',
        price: 159.99,
        discountPrice: 129.99,
        category: catMap['Electronics'],
        brand: 'KeyForge',
        images: [
          'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
        ],
        rating: 4.9,
        numReviews: 180,
        stock: 12,
        specifications: [
          { key: 'Switch Type', value: 'Pre-lubed Tactile Yellow' },
          { key: 'Keycaps', value: 'Double-shot PBT Cherry Profile' },
          { key: 'Layout', value: '75% Compact (84 Keys)' },
        ],
        isFeatured: true,
        isPopular: true,
        isNewArrival: false,
        isBestSeller: true,
      },
      {
        name: 'Classic Vintage Aviator Sunglasses',
        description: 'Timeless tear-drop aviator frames featuring polarized UV400 lenses with anti-scratch coating and comfortable non-slip silicone nose pads.',
        price: 49.99,
        discountPrice: 34.99,
        category: catMap['Fashion & Apparel'],
        brand: 'SolRay',
        images: [
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
        ],
        rating: 4.4,
        numReviews: 53,
        stock: 40,
        specifications: [
          { key: 'Lens Protection', value: 'Polarized 100% UV400' },
          { key: 'Frame', value: 'Lightweight Alloy' },
          { key: 'Case Included', value: 'Yes, Leather Pouch' },
        ],
        isFeatured: false,
        isPopular: false,
        isNewArrival: true,
        isBestSeller: false,
      },
      {
        name: 'PulseBass Portable Waterproof Speaker',
        description: 'Pocket-sized powerhouse with 360-degree room-filling audio, deep dual passive radiators, IPX7 waterproof rating, and 16 hours of playback.',
        price: 69.99,
        discountPrice: 49.99,
        category: catMap['Audio & Acoustics'],
        brand: 'SoundPulse',
        images: [
          'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
        ],
        rating: 4.7,
        numReviews: 96,
        stock: 35,
        specifications: [
          { key: 'Waterproof', value: 'IPX7 Submersible' },
          { key: 'Battery Life', value: '16 Hours Continuous' },
          { key: 'Pairing', value: 'TWS Stereo Pairing' },
        ],
        isFeatured: false,
        isPopular: true,
        isNewArrival: false,
        isBestSeller: true,
      },
    ];

    const seededProducts = await Product.insertMany(sampleProducts);
    console.log(`[Seeder] Seeded ${seededProducts.length} high quality products.`);

    // 4. Create sample initial Cart and Wishlist for demoUser
    await Cart.create({
      user: demoUser._id,
      items: [
        { product: seededProducts[0]._id, quantity: 1 },
        { product: seededProducts[1]._id, quantity: 2 },
      ],
    });

    await Wishlist.create({
      user: demoUser._id,
      products: [seededProducts[2]._id, seededProducts[5]._id],
    });

    // 5. Create a sample initial past order for demoUser
    await Order.create({
      user: demoUser._id,
      products: [
        {
          product: seededProducts[0]._id,
          name: seededProducts[0].name,
          price: seededProducts[0].discountPrice,
          quantity: 1,
          image: seededProducts[0].images[0],
        },
      ],
      shippingAddress: demoUser.addresses[0],
      paymentMethod: 'Cash on Delivery',
      subtotal: 199.99,
      discount: 50.0,
      deliveryCharge: 0,
      totalAmount: 149.99,
      orderStatus: 'Delivered',
    });

    console.log('[Seeder] Database successfully seeded with demo user, cart, wishlist, and past order!');
    console.log('----------------------------------------------------');
    console.log('Login credentials:');
    console.log('Demo User:  alex@shopeasy.com  |  UserPassword123!');
    console.log('Admin User: admin@shopeasy.com |  AdminPassword123!');
    console.log('----------------------------------------------------');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]', error);
    process.exit(1);
  }
};

seedDatabase();
