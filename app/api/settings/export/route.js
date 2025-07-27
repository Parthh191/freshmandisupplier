import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { verifyToken } from '../../../../lib/auth';

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

    // Get user data with all related information
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        userType: true,
        supplier: {
          include: {
            categories: {
              include: {
                products: true
              }
            },
            products: {
              include: {
                category: true
              }
            }
          }
        },
        vendor: {
          include: {
            products: true
          }
        },
        notifications: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prepare export data (excluding sensitive information)
    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType.type,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      profile: user.supplier || user.vendor,
      statistics: {
        totalNotifications: user.notifications.length,
        unreadNotifications: user.notifications.filter(n => n.status === 'unread').length,
        totalProducts: user.supplier?.products?.length || user.vendor?.products?.length || 0,
        totalCategories: user.supplier?.categories?.length || 0
      },
      notifications: user.notifications.map(notification => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        status: notification.status,
        createdAt: notification.createdAt,
        readAt: notification.readAt
      })),
      products: (user.supplier?.products || user.vendor?.products || []).map(product => ({
        id: product.id,
        name: product.name,
        pricePerKg: product.pricePerKg,
        availableQty: product.availableQty,
        unit: product.unit,
        category: product.category?.name,
        createdAt: product.createdAt
      })),
      categories: (user.supplier?.categories || []).map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        productCount: category.products.length,
        createdAt: category.createdAt
      }))
    };

    // Convert to JSON string
    const jsonData = JSON.stringify(exportData, null, 2);

    // Create response with proper headers for file download
    return new NextResponse(jsonData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="freshmandi-data-${new Date().toISOString().split('T')[0]}.json"`
      }
    });

  } catch (error) {
    console.error('Data export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 