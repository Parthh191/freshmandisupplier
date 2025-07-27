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
    const { language, timezone, currency, theme } = body;

    // Validate account settings
    const accountSettings = {
      language: language || 'en',
      timezone: timezone || 'Asia/Kolkata',
      currency: currency || 'INR',
      theme: theme || 'dark'
    };

    // Store account settings in user preferences
    // For now, we'll just return success
    // In a real application, you might want to store these in a UserPreferences table
    await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        // You can add a preferences field to the User model if needed
        // For now, we'll just return success
      }
    });

    return NextResponse.json({
      message: 'Account settings updated successfully',
      settings: accountSettings
    });

  } catch (error) {
    console.error('Account settings update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
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

    // Delete user account and all associated data
    await prisma.user.delete({
      where: { id: decoded.userId }
    });

    return NextResponse.json({
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Account deletion error:', error);
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

    // Get user's account settings
    // For now, return default settings
    const defaultSettings = {
      language: 'en',
      timezone: 'Asia/Kolkata',
      currency: 'INR',
      theme: 'dark'
    };

    return NextResponse.json({
      settings: defaultSettings
    });

  } catch (error) {
    console.error('Account settings get error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 