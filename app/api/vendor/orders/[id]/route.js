import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { verifyToken } from '../../../../../lib/auth';

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

    // Get vendor profile
    const vendor = await prisma.vendor.findUnique({
      where: { userId: decoded.userId }
    });

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      );
    }

    // Get order with items
    const order = await prisma.vendorOrder.findFirst({
      where: {
        id: id,
        vendorId: vendor.id
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                supplier: {
                  select: {
                    businessName: true,
                    location: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);

  } catch (error) {
    console.error('Vendor order detail error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 