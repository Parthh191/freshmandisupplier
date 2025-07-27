const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create UserTypes
  const supplierType = await prisma.userType.upsert({
    where: { type: 'supplier' },
    update: {},
    create: { type: 'supplier' }
  })

  const vendorType = await prisma.userType.upsert({
    where: { type: 'vendor' },
    update: {},
    create: { type: 'vendor' }
  })

  console.log('✅ UserTypes created')

  // Create Users
  const supplierUser = await prisma.user.upsert({
    where: { email: 'supplier@freshmandi.com' },
    update: {},
    create: {
      name: 'Fresh Farms Supplier',
      email: 'supplier@freshmandi.com',
      phone: '+91-9876543210',
      password: await bcrypt.hash('password123', 12),
      userTypeId: supplierType.id
    }
  })

  const vendorUser = await prisma.user.upsert({
    where: { email: 'vendor@freshmandi.com' },
    update: {},
    create: {
      name: 'City Market Vendor',
      email: 'vendor@freshmandi.com',
      phone: '+91-9876543211',
      password: await bcrypt.hash('password123', 12),
      userTypeId: vendorType.id
    }
  })

  console.log('✅ Users created')

  // Create Supplier Profile
  const supplier = await prisma.supplier.upsert({
    where: { userId: supplierUser.id },
    update: {},
    create: {
      userId: supplierUser.id,
      businessName: 'Fresh Farms',
      location: 'Mumbai, Maharashtra',
      latitude: 19.0760,
      longitude: 72.8777
    }
  })

  // Create Vendor Profile
  const vendor = await prisma.vendor.upsert({
    where: { userId: vendorUser.id },
    update: {},
    create: {
      userId: vendorUser.id,
      businessName: 'City Market',
      location: 'Delhi, India',
      latitude: 28.7041,
      longitude: 77.1025,
      isVerified: true,
      qualityRating: 4.5
    }
  })

  console.log('✅ Profiles created')

  // Create Default Categories for Street Food Vendors
  const defaultCategories = [
    { name: 'Raw Materials', description: 'Essential raw materials for street food preparation' },
    { name: 'Equipment & Utensils', description: 'Cooking equipment and serving utensils' },
    { name: 'Packaging Materials', description: 'Disposable packaging and serving items' },
    { name: 'Fresh Produce', description: 'Fresh vegetables, fruits, and herbs' },
    { name: 'Spices & Seasonings', description: 'Whole and ground spices for street food' },
    { name: 'Dairy & Eggs', description: 'Milk, cheese, eggs, and dairy products' },
    { name: 'Grains & Flours', description: 'Rice, wheat flour, and other grains' },
    { name: 'Oils & Ghee', description: 'Cooking oils, ghee, and fats' },
    { name: 'Meat & Seafood', description: 'Fresh meat, poultry, and seafood' },
    { name: 'Ready-to-Use Items', description: 'Pre-made items and convenience foods' }
  ]

  for (const categoryData of defaultCategories) {
    // Check if category already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: categoryData.name,
        supplierId: supplier.id
      }
    })

    if (!existingCategory) {
      await prisma.category.create({
        data: {
          name: categoryData.name,
          description: categoryData.description,
          supplierId: supplier.id
        }
      })
    }
  }

  console.log('✅ Default categories created')

  // Create Sample Products for Street Food Vendors
  const categories = await prisma.category.findMany({
    where: { supplierId: supplier.id }
  })

  const sampleProducts = [
    // Raw Materials
    {
      name: 'Wheat Flour (Atta)',
      pricePerKg: 35,
      availableQty: 500,
      unit: 'kg',
      categoryId: categories.find(c => c.name === 'Raw Materials')?.id,
      imageUrl: '/uploads/flour.jpg',
      description: 'High-quality wheat flour for making rotis, parathas, and other breads',
      minOrderQty: 5,
      maxOrderQty: 100,
      isLocalDelivery: true,
      deliveryRadius: 10,
      deliveryFee: 50,
      bulkPricing: JSON.stringify({
        '5kg': 32,
        '10kg': 30,
        '25kg': 28
      })
    },
    {
      name: 'Rice Flour',
      pricePerKg: 45,
      availableQty: 200,
      unit: 'kg',
      categoryId: categories.find(c => c.name === 'Raw Materials')?.id,
      imageUrl: '/uploads/rice-flour.jpg',
      description: 'Fine rice flour for making dosas, idlis, and other South Indian dishes',
      minOrderQty: 2,
      maxOrderQty: 50,
      isLocalDelivery: true,
      deliveryRadius: 8,
      deliveryFee: 40,
      bulkPricing: JSON.stringify({
        '5kg': 42,
        '10kg': 40,
        '25kg': 38
      })
    },
    {
      name: 'Besan (Gram Flour)',
      pricePerKg: 60,
      availableQty: 300,
      unit: 'kg',
      categoryId: categories.find(c => c.name === 'Raw Materials')?.id,
      imageUrl: '/uploads/besan.jpg',
      description: 'Chickpea flour for making pakoras, dhokla, and other snacks',
      minOrderQty: 1,
      maxOrderQty: 75,
      isLocalDelivery: true,
      deliveryRadius: 12,
      deliveryFee: 60,
      bulkPricing: JSON.stringify({
        '5kg': 57,
        '10kg': 55,
        '25kg': 52
      })
    },
    
    // Equipment & Utensils
    {
      name: 'Tawa (Griddle)',
      pricePerKg: 800,
      availableQty: 50,
      unit: 'piece',
      categoryId: categories.find(c => c.name === 'Equipment & Utensils')?.id,
      imageUrl: '/uploads/tawa.jpg',
      description: 'Heavy-duty iron griddle for making rotis and parathas',
      minOrderQty: 1,
      maxOrderQty: 10,
      isLocalDelivery: true,
      deliveryRadius: 15,
      deliveryFee: 100,
      bulkPricing: JSON.stringify({
        '2piece': 750,
        '5piece': 700,
        '10piece': 650
      })
    },
    {
      name: 'Kadai (Wok)',
      pricePerKg: 1200,
      availableQty: 30,
      unit: 'piece',
      categoryId: categories.find(c => c.name === 'Equipment & Utensils')?.id,
      imageUrl: '/uploads/kadai.jpg',
      description: 'Deep cooking vessel for frying and cooking curries',
      minOrderQty: 1,
      maxOrderQty: 5,
      isLocalDelivery: true,
      deliveryRadius: 15,
      deliveryFee: 120,
      bulkPricing: JSON.stringify({
        '2piece': 1100,
        '3piece': 1050
      })
    },
    {
      name: 'Serving Plates (Steel)',
      pricePerKg: 15,
      availableQty: 1000,
      unit: 'piece',
      categoryId: categories.find(c => c.name === 'Equipment & Utensils')?.id,
      imageUrl: '/uploads/plates.jpg',
      description: 'Stainless steel plates for serving street food',
      minOrderQty: 10,
      maxOrderQty: 200,
      isLocalDelivery: true,
      deliveryRadius: 10,
      deliveryFee: 30,
      bulkPricing: JSON.stringify({
        '50piece': 14,
        '100piece': 13,
        '200piece': 12
      })
    },
    
    // Packaging Materials
    {
      name: 'Paper Plates (Large)',
      pricePerKg: 2.5,
      availableQty: 5000,
      unit: 'piece',
      categoryId: categories.find(c => c.name === 'Packaging Materials')?.id,
      imageUrl: '/uploads/paper-plates.jpg',
      description: 'Disposable paper plates for serving street food',
      minOrderQty: 100,
      maxOrderQty: 1000,
      isLocalDelivery: true,
      deliveryRadius: 8,
      deliveryFee: 20,
      bulkPricing: JSON.stringify({
        '500piece': 2.3,
        '1000piece': 2.1,
        '2000piece': 2.0
      })
    },
    {
      name: 'Plastic Bags (Small)',
      pricePerKg: 0.5,
      availableQty: 10000,
      unit: 'piece',
      categoryId: categories.find(c => c.name === 'Packaging Materials')?.id,
      imageUrl: '/uploads/plastic-bags.jpg',
      description: 'Small plastic bags for packaging snacks and items',
      minOrderQty: 500,
      maxOrderQty: 5000,
      isLocalDelivery: true,
      deliveryRadius: 8,
      deliveryFee: 15,
      bulkPricing: JSON.stringify({
        '1000piece': 0.45,
        '2000piece': 0.42,
        '5000piece': 0.40
      })
    },
    {
      name: 'Aluminum Foil',
      pricePerKg: 120,
      availableQty: 200,
      unit: 'roll',
      categoryId: categories.find(c => c.name === 'Packaging Materials')?.id,
      imageUrl: '/uploads/aluminum-foil.jpg',
      description: 'Aluminum foil for wrapping and packaging',
      minOrderQty: 5,
      maxOrderQty: 50,
      isLocalDelivery: true,
      deliveryRadius: 10,
      deliveryFee: 40,
      bulkPricing: JSON.stringify({
        '10roll': 115,
        '20roll': 110,
        '50roll': 105
      })
    },
    
    // Fresh Produce
    {
      name: 'Fresh Tomatoes',
      pricePerKg: 40,
      availableQty: 200,
      unit: 'kg',
      categoryId: categories.find(c => c.name === 'Fresh Produce')?.id,
      imageUrl: '/uploads/tomatoes.jpg',
      description: 'Fresh red tomatoes for chutneys and curries',
      minOrderQty: 5,
      maxOrderQty: 50,
      isLocalDelivery: true,
      deliveryRadius: 5,
      deliveryFee: 30,
      bulkPricing: JSON.stringify({
        '10kg': 38,
        '20kg': 36,
        '50kg': 34
      })
    },
    {
      name: 'Onions',
      pricePerKg: 25,
      availableQty: 300,
      unit: 'kg',
      categoryId: categories.find(c => c.name === 'Fresh Produce')?.id,
      imageUrl: '/uploads/onions.jpg',
      description: 'Fresh onions for cooking and garnishing',
      minOrderQty: 10,
      maxOrderQty: 100,
      isLocalDelivery: true,
      deliveryRadius: 5,
      deliveryFee: 25,
      bulkPricing: JSON.stringify({
        '25kg': 23,
        '50kg': 22,
        '100kg': 20
      })
    },
    {
      name: 'Fresh Coriander',
      pricePerKg: 80,
      availableQty: 50,
      unit: 'kg',
      categoryId: categories.find(c => c.name === 'Fresh Produce')?.id,
      imageUrl: '/uploads/coriander.jpg',
      description: 'Fresh coriander leaves for garnishing',
      minOrderQty: 1,
      maxOrderQty: 10,
      isLocalDelivery: true,
      deliveryRadius: 3,
      deliveryFee: 20,
      bulkPricing: JSON.stringify({
        '2kg': 75,
        '5kg': 72,
        '10kg': 70
      })
    },
    
    // Spices & Seasonings
    {
      name: 'Red Chili Powder',
      pricePerKg: 180,
      availableQty: 100,
      unit: 'kg',
      categoryId: categories.find(c => c.name === 'Spices & Seasonings')?.id,
      imageUrl: '/uploads/chili-powder.jpg',
      description: 'Hot red chili powder for adding spice to dishes',
      minOrderQty: 1,
      maxOrderQty: 25,
      isLocalDelivery: true,
      deliveryRadius: 8,
      deliveryFee: 40,
      bulkPricing: JSON.stringify({
        '5kg': 175,
        '10kg': 170,
        '25kg': 165
      })
    },
    {
      name: 'Turmeric Powder',
      pricePerKg: 120,
      availableQty: 150,
      unit: 'kg',
      categoryId: categories.find(c => c.name === 'Spices & Seasonings')?.id,
      imageUrl: '/uploads/turmeric.jpg',
      description: 'Ground turmeric for color and flavor',
      minOrderQty: 1,
      maxOrderQty: 30,
      isLocalDelivery: true,
      deliveryRadius: 8,
      deliveryFee: 35,
      bulkPricing: JSON.stringify({
        '5kg': 115,
        '10kg': 110,
        '25kg': 105
      })
    },
    {
      name: 'Garam Masala',
      pricePerKg: 400,
      availableQty: 50,
      unit: 'kg',
      categoryId: categories.find(c => c.name === 'Spices & Seasonings')?.id,
      imageUrl: '/uploads/garam-masala.jpg',
      description: 'Aromatic spice blend for Indian dishes',
      minOrderQty: 0.5,
      maxOrderQty: 10,
      isLocalDelivery: true,
      deliveryRadius: 8,
      deliveryFee: 50,
      bulkPricing: JSON.stringify({
        '2kg': 380,
        '5kg': 370,
        '10kg': 360
      })
    },
    
    // Dairy & Eggs
    {
      name: 'Fresh Milk',
      pricePerKg: 60,
      availableQty: 100,
      unit: 'liter',
      categoryId: categories.find(c => c.name === 'Dairy & Eggs')?.id,
      imageUrl: '/uploads/milk.jpg',
      description: 'Fresh cow milk for making tea and sweets',
      minOrderQty: 5,
      maxOrderQty: 50,
      isLocalDelivery: true,
      deliveryRadius: 3,
      deliveryFee: 25,
      bulkPricing: JSON.stringify({
        '10liter': 58,
        '20liter': 56,
        '50liter': 54
      })
    },
    {
      name: 'Paneer (Cottage Cheese)',
      pricePerKg: 200,
      availableQty: 50,
      unit: 'kg',
      categoryId: categories.find(c => c.name === 'Dairy & Eggs')?.id,
      imageUrl: '/uploads/paneer.jpg',
      description: 'Fresh paneer for making curries and snacks',
      minOrderQty: 1,
      maxOrderQty: 10,
      isLocalDelivery: true,
      deliveryRadius: 5,
      deliveryFee: 40,
      bulkPricing: JSON.stringify({
        '2kg': 190,
        '5kg': 185,
        '10kg': 180
      })
    },
    {
      name: 'Fresh Eggs',
      pricePerKg: 120,
      availableQty: 1000,
      unit: 'dozen',
      categoryId: categories.find(c => c.name === 'Dairy & Eggs')?.id,
      imageUrl: '/uploads/eggs.jpg',
      description: 'Fresh eggs for making omelets and other dishes',
      minOrderQty: 5,
      maxOrderQty: 100,
      isLocalDelivery: true,
      deliveryRadius: 5,
      deliveryFee: 30,
      bulkPricing: JSON.stringify({
        '10dozen': 115,
        '25dozen': 110,
        '50dozen': 105
      })
    },
    
    // Oils & Ghee
    {
      name: 'Refined Oil',
      pricePerKg: 140,
      availableQty: 200,
      unit: 'liter',
      categoryId: categories.find(c => c.name === 'Oils & Ghee')?.id,
      imageUrl: '/uploads/refined-oil.jpg',
      description: 'Refined cooking oil for frying and cooking',
      minOrderQty: 5,
      maxOrderQty: 50,
      isLocalDelivery: true,
      deliveryRadius: 10,
      deliveryFee: 60,
      bulkPricing: JSON.stringify({
        '10liter': 135,
        '20liter': 130,
        '50liter': 125
      })
    },
    {
      name: 'Pure Ghee',
      pricePerKg: 600,
      availableQty: 50,
      unit: 'kg',
      categoryId: categories.find(c => c.name === 'Oils & Ghee')?.id,
      imageUrl: '/uploads/ghee.jpg',
      description: 'Pure clarified butter for authentic taste',
      minOrderQty: 1,
      maxOrderQty: 10,
      isLocalDelivery: true,
      deliveryRadius: 8,
      deliveryFee: 80,
      bulkPricing: JSON.stringify({
        '2kg': 580,
        '5kg': 570,
        '10kg': 560
      })
    }
  ]

  for (const productData of sampleProducts) {
    if (productData.categoryId) {
      // Check if product already exists
      const existingProduct = await prisma.product.findFirst({
        where: {
          name: productData.name,
          supplierId: supplier.id
        }
      })

      if (!existingProduct) {
        await prisma.product.create({
          data: {
            ...productData,
            supplierId: supplier.id
          }
        })
      }
    }
  }

  console.log('✅ Sample products created')

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 