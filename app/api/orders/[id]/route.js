import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { verifyToken } from '../../../../lib/auth';
import { NotificationService } from '../../../../lib/notificationService';

export async function GET(request, { params }) {
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

    const { id } = params;

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

    const order = await prisma.order.findFirst({
      where: {
        id,
        product: {
          supplierId: supplier.id
        }
      },
      include: {
        product: {
          include: {
            category: true
          }
        },
        vendor: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                phone: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });

  } catch (error) {
    console.error('Order GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
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

    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
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

    // Check if order exists and belongs to the supplier
    const existingOrder = await prisma.order.findFirst({
      where: {
        id,
        product: {
          supplierId: supplier.id
        }
      }
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

                // Update order status
            const order = await prisma.order.update({
              where: { id },
              data: { status },
              include: {
                product: {
                  include: {
                    category: true
                  }
                },
                vendor: {
                  include: {
                    user: {
                      select: {
                        name: true,
                        email: true,
                        phone: true
                      }
                    }
                  }
                }
              }
            });

            // Create notification for status update
            await NotificationService.notifyOrderStatusUpdate(id, status);

            return NextResponse.json({
              message: 'Order status updated successfully',
              order
            });

  } catch (error) {
    console.error('Order PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 