import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(categories);

  } catch (error) {
    console.error('Marketplace categories error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 