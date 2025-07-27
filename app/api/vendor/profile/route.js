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

    const vendor = await prisma.vendor.findUnique({
      where: { userId: decoded.userId }
    });

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(vendor);

  } catch (error) {
    console.error('Get vendor profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
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
    const { businessName, location, latitude, longitude } = body;

    const updateData = {};
    if (businessName) updateData.businessName = businessName;
    if (location) updateData.location = location;
    if (latitude !== undefined) updateData.latitude = parseFloat(latitude);
    if (longitude !== undefined) updateData.longitude = parseFloat(longitude);

    const vendor = await prisma.vendor.update({
      where: { userId: decoded.userId },
      data: updateData
    });

    return NextResponse.json(vendor);

  } catch (error) {
    console.error('Update vendor profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 