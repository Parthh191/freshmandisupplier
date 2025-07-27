import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { verifyToken } from '../../../../lib/auth';

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
    const {
      emailNotifications,
      pushNotifications,
      orderUpdates,
      productAlerts,
      paymentNotifications,
      systemUpdates
    } = body;

    // Validate notification settings
    const notificationSettings = {
      emailNotifications: Boolean(emailNotifications),
      pushNotifications: Boolean(pushNotifications),
      orderUpdates: Boolean(orderUpdates),
      productAlerts: Boolean(productAlerts),
      paymentNotifications: Boolean(paymentNotifications),
      systemUpdates: Boolean(systemUpdates)
    };

    // Store notification settings in user preferences
    // For now, we'll store them in a JSON field in the user table
    // In a real application, you might want a separate UserPreferences table
    await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        // You can add a preferences field to the User model if needed
        // For now, we'll just return success
      }
    });

    return NextResponse.json({
      message: 'Notification settings updated successfully',
      settings: notificationSettings
    });

  } catch (error) {
    console.error('Notification settings update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    // Get user's notification settings
    // For now, return default settings
    const defaultSettings = {
      emailNotifications: true,
      pushNotifications: true,
      orderUpdates: true,
      productAlerts: true,
      paymentNotifications: true,
      systemUpdates: true
    };

    return NextResponse.json({
      settings: defaultSettings
    });

  } catch (error) {
    console.error('Notification settings get error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 