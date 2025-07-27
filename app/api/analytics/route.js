import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/auth';

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

    // Get date range from query params (default to last 30 days)
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days')) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all orders for this supplier
    const orders = await prisma.order.findMany({
      where: {
        product: {
          supplierId: supplier.id
        },
        createdAt: {
          gte: startDate
        }
      },
      include: {
        product: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate analytics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Status breakdown
    const statusBreakdown = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    // Category breakdown
    const categoryBreakdown = orders.reduce((acc, order) => {
      const categoryName = order.product.category.name;
      acc[categoryName] = (acc[categoryName] || 0) + 1;
      return acc;
    }, {});

    // Top products by revenue
    const productRevenue = orders.reduce((acc, order) => {
      const productName = order.product.name;
      acc[productName] = (acc[productName] || 0) + order.totalPrice;
      return acc;
    }, {});

    const topProducts = Object.entries(productRevenue)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, revenue]) => ({ name, revenue }));

    // Daily revenue for chart
    const dailyRevenue = {};
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      dailyRevenue[date] = (dailyRevenue[date] || 0) + order.totalPrice;
    });

    const dailyRevenueArray = Object.entries(dailyRevenue)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, revenue]) => ({ date, revenue }));

    // Get product count
    const productCount = await prisma.product.count({
      where: { supplierId: supplier.id }
    });

    // Get category count
    const categoryCount = await prisma.category.count({
      where: { supplierId: supplier.id }
    });

    // Recent activity (last 10 orders)
    const recentOrders = orders.slice(0, 10).map(order => ({
      id: order.id,
      productName: order.product.name,
      quantity: order.quantity,
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      vendorName: order.vendor?.user?.name || 'Unknown'
    }));

    // Monthly comparison
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });

    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const previousMonthOrders = await prisma.order.findMany({
      where: {
        product: {
          supplierId: supplier.id
        },
        createdAt: {
          gte: new Date(previousYear, previousMonth, 1),
          lt: new Date(currentYear, currentMonth, 1)
        }
      }
    });

    const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const previousMonthRevenue = previousMonthOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const revenueGrowth = previousMonthRevenue > 0 
      ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
      : 0;

    return NextResponse.json({
      overview: {
        totalOrders,
        totalRevenue,
        averageOrderValue,
        productCount,
        categoryCount,
        revenueGrowth
      },
      statusBreakdown,
      categoryBreakdown,
      topProducts,
      dailyRevenue: dailyRevenueArray,
      recentOrders,
      currentMonthRevenue,
      previousMonthRevenue
    });

  } catch (error) {
    console.error('Analytics GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 