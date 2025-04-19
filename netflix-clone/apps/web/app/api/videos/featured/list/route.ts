import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const featuredVideos = await prisma.video.findMany({
      where: {
        featured: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });
    
    return NextResponse.json(featuredVideos);
  } catch (error) {
    console.error('Error fetching featured videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured videos' },
      { status: 500 }
    );
  }
}
