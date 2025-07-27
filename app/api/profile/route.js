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

                // Check if user is supplier or vendor
            const user = await prisma.user.findUnique({
              where: { id: decoded.userId },
              include: {
                userType: true,
                supplier: {
                  include: {
                    user: {
                      select: {
                        name: true,
                        email: true,
                        phone: true,
                        userType: true
                      }
                    },
                    categories: {
                      include: {
                        _count: {
                          select: { products: true }
                        }
                      }
                    },
                    _count: {
                      select: { products: true }
                    }
                  }
                },
                vendor: {
                  include: {
                    user: {
                      select: {
                        name: true,
                        email: true,
                        phone: true,
                        userType: true
                      }
                    },
                    _count: {
                      select: { products: true, orders: true }
                    }
                  }
                }
              }
            });

            if (!user) {
              return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
              );
            }

            if (user.userType.type === 'supplier' && user.supplier) {
              return NextResponse.json({ supplier: user.supplier });
            } else if (user.userType.type === 'vendor' && user.vendor) {
              return NextResponse.json({ vendor: user.vendor });
            } else {
              return NextResponse.json(
                { error: 'Profile not found' },
                { status: 404 }
              );
            }

  } catch (error) {
    console.error('Profile GET error:', error);
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { businessName, location, latitude, longitude } = body;

    if (!businessName || !location) {
      return NextResponse.json(
        { error: 'Business name and location are required' },
        { status: 400 }
      );
    }

                // Check if user is supplier or vendor
            const user = await prisma.user.findUnique({
              where: { id: decoded.userId },
              include: {
                userType: true
              }
            });

            if (!user) {
              return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
              );
            }

            let updatedProfile;

            if (user.userType.type === 'supplier') {
              updatedProfile = await prisma.supplier.update({
                where: { userId: decoded.userId },
                data: {
                  businessName,
                  location,
                  latitude: latitude ? parseFloat(latitude) : null,
                  longitude: longitude ? parseFloat(longitude) : null
                },
                include: {
                  user: {
                    select: {
                      name: true,
                      email: true,
                      phone: true,
                      userType: true
                    }
                  },
                  categories: {
                    include: {
                      _count: {
                        select: { products: true }
                      }
                    }
                  },
                  _count: {
                    select: { products: true }
                  }
                }
              });

              return NextResponse.json({
                message: 'Profile updated successfully',
                supplier: updatedProfile
              });
            } else if (user.userType.type === 'vendor') {
              updatedProfile = await prisma.vendor.update({
                where: { userId: decoded.userId },
                data: {
                  mandiName: businessName,
                  location,
                  latitude: latitude ? parseFloat(latitude) : null,
                  longitude: longitude ? parseFloat(longitude) : null
                },
                include: {
                  user: {
                    select: {
                      name: true,
                      email: true,
                      phone: true,
                      userType: true
                    }
                  },
                  _count: {
                    select: { products: true, orders: true }
                  }
                }
              });

              return NextResponse.json({
                message: 'Profile updated successfully',
                vendor: updatedProfile
              });
            } else {
              return NextResponse.json(
                { error: 'Invalid user type' },
                { status: 400 }
              );
            }

  } catch (error) {
    console.error('Profile PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 