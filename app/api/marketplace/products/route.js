import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId');
    const vendorLat = parseFloat(searchParams.get('lat'));
    const vendorLng = parseFloat(searchParams.get('lng'));
    const radius = parseFloat(searchParams.get('radius')) || 10; // Default 10km radius

    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
      availableQty: { gt: 0 }, // Only show available products
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { category: { name: { contains: search, mode: 'insensitive' } } }
        ]
      }),
      ...(categoryId && { categoryId })
    };

    // Get products with supplier location info
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          supplier: {
            select: {
              businessName: true,
              location: true,
              latitude: true,
              longitude: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ]);

    // Filter by distance if vendor location is provided
    let filteredProducts = products;
    if (vendorLat && vendorLng) {
      filteredProducts = products.filter(product => {
        if (!product.supplier.latitude || !product.supplier.longitude) {
          return false; // Skip products without location
        }

        // Calculate distance using Haversine formula
        const distance = calculateDistance(
          vendorLat, vendorLng,
          product.supplier.latitude, product.supplier.longitude
        );

        return distance <= radius;
      });
    }

    // Parse bulk pricing for each product
    const productsWithBulkPricing = filteredProducts.map(product => {
      let bulkPricing = null;
      if (product.bulkPricing) {
        try {
          bulkPricing = JSON.parse(product.bulkPricing);
        } catch (e) {
          console.error('Error parsing bulk pricing:', e);
        }
      }

      return {
        ...product,
        bulkPricing
      };
    });

    return NextResponse.json({
      products: productsWithBulkPricing,
      pagination: {
        page,
        limit,
        total: filteredProducts.length,
        pages: Math.ceil(filteredProducts.length / limit)
      }
    });

  } catch (error) {
    console.error('Marketplace products GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Haversine formula to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
} 