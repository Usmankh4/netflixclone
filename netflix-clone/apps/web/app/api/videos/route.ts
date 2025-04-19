import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const type = searchParams.get('type') as 'MOVIE' | 'SERIES' | null;
    const genre = searchParams.get('genre');
    const featured = searchParams.get('featured') === 'true';
    const trending = searchParams.get('trending') === 'true';
    const isOriginal = searchParams.get('isOriginal') === 'true';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    const search = searchParams.get('search');
    
    const where: any = {};
    
    if (type) where.type = type;
    if (genre) where.genre = { has: genre };
    if (featured) where.featured = true;
    if (trending) where.trending = true;
    if (isOriginal) where.isOriginal = true;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.video.count({ where }),
    ]);
    
    
    const pages = Math.ceil(total / limit);
    
    return NextResponse.json({
      videos,
      pagination: {
        total,
        page,
        limit,
        pages,
      },
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
