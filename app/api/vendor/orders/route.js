import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { verifyToken } from '../../../../lib/auth';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');

    const vendor = await prisma.vendor.findUnique({
      where: { userId: decoded.userId }
    });

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      );
    }

    const where = {
      vendorId: vendor.id
    };

    if (status) {
      where.status = status;
    }

    const orders = await prisma.vendorOrder.findMany({
      where,
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    return NextResponse.json(orders);

  } catch (error) {
    console.error('Get vendor orders error:', error);
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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items are required' },
        { status: 400 }
      );
    }

    const vendor = await prisma.vendor.findUnique({
      where: { userId: decoded.userId }
    });

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      );
    }

    // Calculate total amount and validate products
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }

      if (product.availableQty < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient quantity for product ${product.name}` },
          { status: 400 }
        );
      }

      const itemTotal = product.pricePerKg * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.pricePerKg,
        totalPrice: itemTotal
      });
    }

    // Create order and update product quantities
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.vendorOrder.create({
        data: {
          vendorId: vendor.id,
          totalAmount,
          status: 'pending',
          orderType: 'individual'
        }
      });

      // Create order items
      for (const item of orderItems) {
        await tx.vendorOrderItem.create({
          data: {
            orderId: newOrder.id,
            ...item
          }
        });
      }

      // Update product quantities
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            availableQty: {
              decrement: item.quantity
            }
          }
        });
      }

      // Update vendor stats
      await tx.vendor.update({
        where: { id: vendor.id },
        data: {
          totalOrders: {
            increment: 1
          },
          monthlySpending: {
            increment: totalAmount
          },
          lastOrderAt: new Date()
        }
      });

      return newOrder;
    });

    return NextResponse.json({
      message: 'Order created successfully',
      order
    });

  } catch (error) {
    console.error('Create vendor order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 