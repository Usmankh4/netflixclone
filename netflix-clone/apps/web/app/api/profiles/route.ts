import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { auth } from '@clerk/nextjs';

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    // Get user from database using Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get profiles for the user
    const profiles = await prisma.profile.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, imageUrl } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Get user from database using Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        profiles: true,
        subscription: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has reached profile limit based on subscription
    const profileLimit = user.subscription?.plan === 'PREMIUM' 
      ? 5 
      : user.subscription?.plan === 'STANDARD' 
        ? 3 
        : 1;

    if (user.profiles.length >= profileLimit) {
      return NextResponse.json(
        { 
          error: 'Profile limit reached', 
          currentProfiles: user.profiles.length,
          limit: profileLimit
        },
        { status: 403 }
      );
    }

    // Create new profile
    const profile = await prisma.profile.create({
      data: {
        name,
        imageUrl,
        userId: user.id,
      },
    });
    
    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    );
  }
}
