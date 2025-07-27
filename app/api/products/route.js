import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/auth';
import { NotificationService } from '../../../lib/notificationService';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get supplier ID
    const supplier = await prisma.supplier.findUnique({
      where: { userId: decoded.userId }
    });

    if (!supplier) {
      return NextResponse.json(
        { error: 'Supplier profile not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId');

    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
      supplierId: supplier.id,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { category: { name: { contains: search, mode: 'insensitive' } } }
        ]
      }),
      ...(categoryId && { categoryId })
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          supplier: {
            select: {
              businessName: true,
              location: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      name, 
      description,
      pricePerKg, 
      availableQty, 
      unit, 
      categoryId, 
      imageUrl,
      minOrderQty,
      maxOrderQty,
      isLocalDelivery,
      deliveryRadius,
      deliveryFee,
      bulkPricing
    } = body;

    // Validate required fields
    if (!name || !pricePerKg || !availableQty || !unit || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get supplier ID
    const supplier = await prisma.supplier.findUnique({
      where: { userId: decoded.userId }
    });

    if (!supplier) {
      return NextResponse.json(
        { error: 'Supplier profile not found' },
        { status: 404 }
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        pricePerKg: parseFloat(pricePerKg),
        availableQty: parseFloat(availableQty),
        unit,
        imageUrl: imageUrl || null,
        minOrderQty: parseFloat(minOrderQty) || 1,
        maxOrderQty: maxOrderQty ? parseFloat(maxOrderQty) : null,
        isLocalDelivery: isLocalDelivery !== undefined ? isLocalDelivery : true,
        deliveryRadius: deliveryRadius ? parseFloat(deliveryRadius) : null,
        deliveryFee: parseFloat(deliveryFee) || 0,
        bulkPricing: bulkPricing ? JSON.stringify(bulkPricing) : null,
        categoryId,
        supplierId: supplier.id
      },
      include: {
        category: true,
        supplier: {
          select: {
            businessName: true,
            location: true
          }
        }
      }
    });

            // Check for low stock and create notification
            if (parseFloat(availableQty) <= 10) {
              await NotificationService.notifyLowStock(product.id, parseFloat(availableQty));
            }

            return NextResponse.json({
              message: 'Product created successfully',
              product
            });

  } catch (error) {
    console.error('Product POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 