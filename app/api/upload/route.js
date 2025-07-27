import { NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request) {
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
    const { imageData, fileName } = body;

    if (!imageData) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Validate that it's a base64 image
    if (!imageData.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image format' },
        { status: 400 }
      );
    }

    // Extract the base64 data and content type
    const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json(
        { error: 'Invalid image data format' },
        { status: 400 }
      );
    }

    const contentType = matches[1];
    const base64Data = matches[2];

    // Validate content type
    if (!contentType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid content type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Get file extension from content type
    const extension = contentType.split('/')[1];
    if (!['jpeg', 'jpg', 'png', 'gif', 'webp'].includes(extension)) {
      return NextResponse.json(
        { error: 'Unsupported image format. Use JPEG, PNG, GIF, or WebP.' },
        { status: 400 }
      );
    }

    // Check file size (5MB limit)
    const buffer = Buffer.from(base64Data, 'base64');
    const fileSizeInMB = buffer.length / (1024 * 1024);
    if (fileSizeInMB > 5) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const uniqueFileName = `product_${timestamp}_${randomString}.${extension}`;

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Save file to public/uploads directory
    const filePath = join(uploadsDir, uniqueFileName);
    
    await writeFile(filePath, buffer);

    // Generate the URL that will be accessible from the browser
    const imageUrl = `/uploads/${uniqueFileName}`;

    console.log('Image uploaded successfully:', { 
      fileName: uniqueFileName, 
      imageUrl,
      filePath,
      size: `${fileSizeInMB.toFixed(2)}MB`
    });

    return NextResponse.json({
      success: true,
      imageUrl,
      fileName: uniqueFileName
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 