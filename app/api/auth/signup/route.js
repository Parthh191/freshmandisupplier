import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { hashPassword } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const { name, email, phone, password, userType } = await request.json();

    // Validate required fields
    if (!name || !email || !password || !userType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate user type
    if (!['supplier', 'vendor'].includes(userType)) {
      return NextResponse.json(
        { error: 'Invalid user type. Must be "supplier" or "vendor"' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Get or create user type
    let userTypeRecord = await prisma.userType.findUnique({
      where: { type: userType }
    });

    if (!userTypeRecord) {
      userTypeRecord = await prisma.userType.create({
        data: { type: userType }
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        userTypeId: userTypeRecord.id
      },
      include: {
        userType: true
      }
    });

    // Create vendor or supplier profile based on user type
    if (userType === 'vendor') {
      await prisma.vendor.create({
        data: {
          userId: user.id,
          businessName: name,
          location: '',
          latitude: null,
          longitude: null,
          isVerified: false,
          qualityRating: 0,
          totalOrders: 0,
          monthlySpending: 0
        }
      });
    } else if (userType === 'supplier') {
      await prisma.supplier.create({
        data: {
          userId: user.id,
          businessName: name,
          location: ''
        }
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'User created successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 