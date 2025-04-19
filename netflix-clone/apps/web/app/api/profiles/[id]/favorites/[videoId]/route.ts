import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';
import { auth } from '@clerk/nextjs';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; videoId: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, videoId } = params;

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const profile = await prisma.profile.findUnique({
      where: { id },
      include: {
        favorites: true,
      },
    });
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    if (profile.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const video = await prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    const isAlreadyFavorite = profile.favorites.some((v: { id: string }) => v.id === videoId);
    if (isAlreadyFavorite) {
      return NextResponse.json(
        { error: 'Video already in favorites' },
        { status: 400 }
      );
    }

   
    await prisma.profile.update({
      where: { id },
      data: {
        favorites: {
          connect: {
            id: videoId,
          },
        },
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error adding video ${params.videoId} to favorites for profile ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to add to favorites' },
      { status: 500 }
    );
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; videoId: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, videoId } = params;

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const profile = await prisma.profile.findUnique({
      where: { id },
      include: {
        favorites: true,
      },
    });
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    
    if (profile.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const isInFavorites = profile.favorites.some((v: { id: string }) => v.id === videoId);

    if (!isInFavorites) {
      return NextResponse.json(
        { error: 'Video not in favorites' },
        { status: 400 }
      );
    }

    
    await prisma.profile.update({
      where: { id },
      data: {
        favorites: {
          disconnect: {
            id: videoId,
          },
        },
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error removing video ${params.videoId} from favorites for profile ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to remove from favorites' },
      { status: 500 }
    );
  }
}
