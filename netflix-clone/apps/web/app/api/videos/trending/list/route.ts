import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const trendingVideos = await prisma.video.findMany({
      where: {
        trending: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });
    
    return NextResponse.json(trendingVideos);
  } catch (error) {
    console.error('Error fetching trending videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending videos' },
      { status: 500 }
    );
  }
}
