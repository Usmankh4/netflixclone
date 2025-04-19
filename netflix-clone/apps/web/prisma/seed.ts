import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Clean up existing data
  await prisma.$transaction([
    prisma.watchHistory.deleteMany(),
    prisma.rating.deleteMany(),
    prisma.video.deleteMany(),
    prisma.profile.deleteMany(),
    prisma.subscription.deleteMany(),
    prisma.user.deleteMany(),
    prisma.imageAsset.deleteMany(),
  ]);

  console.log('Cleaned up existing data');

  // Create a test user
  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      emailVerified: new Date(),
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
      clerkId: 'clerk_' + randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log(`Created user: ${user.name}`);

  // Create a second user for more diverse ratings
  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      emailVerified: new Date(),
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
      clerkId: 'clerk_' + randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log(`Created second user: ${user2.name}`);

  // Create profiles for the user
  const mainProfile = await prisma.profile.create({
    data: {
      name: 'Main Profile',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
      userId: user.id,
    },
  });

  const kidsProfile = await prisma.profile.create({
    data: {
      name: 'Kids',
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop',
      userId: user.id,
    },
  });

  // Create profile for second user
  const user2Profile = await prisma.profile.create({
    data: {
      name: 'Jane',
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
      userId: user2.id,
    },
  });

  console.log(`Created profiles: ${mainProfile.name}, ${kidsProfile.name}, ${user2Profile.name}`);

  // Create videos with real data and images
  const videos = await Promise.all([
    // Netflix Originals - Series
    prisma.video.create({
      data: {
        title: 'Stranger Things',
        description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        trailerUrl: 'https://www.youtube.com/watch?v=b9EkMc79ZSU',
        duration: 3600,
        genre: ['Sci-Fi', 'Horror', 'Drama'],
        releaseYear: 2016,
        director: 'The Duffer Brothers',
        cast: ['Millie Bobby Brown', 'Finn Wolfhard', 'Winona Ryder'],
        maturityRating: 'TV-14',
        featured: true,
        trending: true,
        isOriginal: true,
        type: 'SERIES',
        averageRating: 4.8,
        totalRatings: 1250,
      },
    }),
    prisma.video.create({
      data: {
        title: 'The Witcher',
        description: 'Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        trailerUrl: 'https://www.youtube.com/watch?v=ndl1W4ltcmg',
        duration: 3540,
        genre: ['Fantasy', 'Action', 'Adventure'],
        releaseYear: 2019,
        director: 'Lauren Schmidt Hissrich',
        cast: ['Henry Cavill', 'Freya Allan', 'Anya Chalotra'],
        maturityRating: 'TV-MA',
        featured: true,
        trending: true,
        isOriginal: true,
        type: 'SERIES',
        averageRating: 4.7,
        totalRatings: 980,
      },
    }),
    
    // Netflix Originals - Movies
    prisma.video.create({
      data: {
        title: 'The Irishman',
        description: 'Hitman Frank Sheeran looks back at the secrets he kept as a loyal member of the Bufalino crime family.',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/mbm8k3GFhXS0ROd9AD1gqYbIFbM.jpg',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        trailerUrl: 'https://www.youtube.com/watch?v=WHXxVmeGQUc',
        duration: 9540,
        genre: ['Crime', 'Drama', 'Biography'],
        releaseYear: 2019,
        director: 'Martin Scorsese',
        cast: ['Robert De Niro', 'Al Pacino', 'Joe Pesci'],
        maturityRating: 'R',
        featured: true,
        trending: false,
        isOriginal: true,
        type: 'MOVIE',
        averageRating: 4.6,
        totalRatings: 980,
      },
    }),
    prisma.video.create({
      data: {
        title: 'Extraction',
        description: 'A hardened mercenary\'s mission becomes a soul-searching race to survive when he\'s sent into Bangladesh to rescue a drug lord\'s kidnapped son.',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/wlfDxbGEsW58vGhFljKkcR5IxDj.jpg',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        trailerUrl: 'https://www.youtube.com/watch?v=L6P3nI6VnlY',
        duration: 6900,
        genre: ['Action', 'Thriller'],
        releaseYear: 2020,
        director: 'Sam Hargrave',
        cast: ['Chris Hemsworth', 'Rudhraksh Jaiswal', 'Randeep Hooda'],
        maturityRating: 'R',
        featured: false,
        trending: true,
        isOriginal: true,
        type: 'MOVIE',
        averageRating: 4.3,
        totalRatings: 850,
      },
    }),
    
    // Popular Series
    prisma.video.create({
      data: {
        title: 'The Queen\'s Gambit',
        description: 'In a 1950s orphanage, a young girl reveals an astonishing talent for chess and begins an unlikely journey to stardom while grappling with addiction.',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/zU0htwkhNvBQdVSIKB9s6hgVeFK.jpg',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        trailerUrl: 'https://www.youtube.com/watch?v=CDrieqwSdgI',
        duration: 2340,
        genre: ['Drama'],
        releaseYear: 2020,
        director: 'Scott Frank',
        cast: ['Anya Taylor-Joy', 'Bill Camp', 'Moses Ingram'],
        maturityRating: 'TV-MA',
        featured: false,
        trending: true,
        isOriginal: true,
        type: 'SERIES',
        averageRating: 4.9,
        totalRatings: 1500,
      },
    }),
    prisma.video.create({
      data: {
        title: 'The Crown',
        description: 'This drama follows the political rivalries and romance of Queen Elizabeth II\'s reign and the events that shaped the second half of the 20th century.',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        trailerUrl: 'https://www.youtube.com/watch?v=JWtnJjn6ng0',
        duration: 3300,
        genre: ['Drama', 'History', 'Biography'],
        releaseYear: 2016,
        director: 'Peter Morgan',
        cast: ['Olivia Colman', 'Tobias Menzies', 'Helena Bonham Carter'],
        maturityRating: 'TV-MA',
        featured: true,
        trending: false,
        isOriginal: true,
        type: 'SERIES',
        averageRating: 4.7,
        totalRatings: 1100,
      },
    }),
    
    // Popular Movies
    prisma.video.create({
      data: {
        title: 'Inception',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
        duration: 8880,
        genre: ['Action', 'Sci-Fi', 'Thriller'],
        releaseYear: 2010,
        director: 'Christopher Nolan',
        cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page'],
        maturityRating: 'PG-13',
        featured: true,
        trending: false,
        isOriginal: false,
        type: 'MOVIE',
        averageRating: 4.8,
        totalRatings: 2200,
      },
    }),
    prisma.video.create({
      data: {
        title: 'The Dark Knight',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
        duration: 9120,
        genre: ['Action', 'Crime', 'Drama'],
        releaseYear: 2008,
        director: 'Christopher Nolan',
        cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
        maturityRating: 'PG-13',
        featured: false,
        trending: true,
        isOriginal: false,
        type: 'MOVIE',
        averageRating: 4.9,
        totalRatings: 2500,
      },
    }),
    
    // More Content
    prisma.video.create({
      data: {
        title: 'Breaking Bad',
        description: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        trailerUrl: 'https://www.youtube.com/watch?v=HhesaQXLuRY',
        duration: 2940,
        genre: ['Crime', 'Drama', 'Thriller'],
        releaseYear: 2008,
        director: 'Vince Gilligan',
        cast: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'],
        maturityRating: 'TV-MA',
        featured: true,
        trending: false,
        isOriginal: false,
        type: 'SERIES',
        averageRating: 4.9,
        totalRatings: 2100,
      },
    }),
    prisma.video.create({
      data: {
        title: 'Interstellar',
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
        duration: 10140,
        genre: ['Adventure', 'Drama', 'Sci-Fi'],
        releaseYear: 2014,
        director: 'Christopher Nolan',
        cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
        maturityRating: 'PG-13',
        featured: true,
        trending: true,
        isOriginal: false,
        type: 'MOVIE',
        averageRating: 4.8,
        totalRatings: 1950,
      },
    }),
  ]);

  console.log(`Created ${videos.length} videos`);

  // Create more detailed ratings with different users to avoid unique constraint violations
  const ratings = await Promise.all([
    // Ratings for Stranger Things
    prisma.rating.create({
      data: {
        value: 5,
        comment: 'Absolutely loved it! The perfect blend of 80s nostalgia and supernatural horror.',
        userId: user.id,
        videoId: videos[0].id,
      },
    }),
    prisma.rating.create({
      data: {
        value: 4,
        comment: 'Great character development and storytelling. Can\'t wait for the next season!',
        userId: user2.id,
        videoId: videos[0].id,
      },
    }),
    
    // Ratings for The Witcher
    prisma.rating.create({
      data: {
        value: 5,
        comment: 'Henry Cavill is the perfect Geralt. Amazing adaptation of the books!',
        userId: user.id,
        videoId: videos[1].id,
      },
    }),
    prisma.rating.create({
      data: {
        value: 4,
        comment: 'The fight choreography is incredible. Story can be confusing at times.',
        userId: user2.id,
        videoId: videos[1].id,
      },
    }),
    
    // Ratings for The Irishman
    prisma.rating.create({
      data: {
        value: 5,
        comment: 'A masterpiece from Scorsese. De Niro and Pacino at their best!',
        userId: user.id,
        videoId: videos[2].id,
      },
    }),
    
    // Ratings for Extraction
    prisma.rating.create({
      data: {
        value: 4,
        comment: 'That one-shot action sequence alone is worth watching. Hemsworth is great!',
        userId: user.id,
        videoId: videos[3].id,
      },
    }),
    
    // Ratings for Queen's Gambit
    prisma.rating.create({
      data: {
        value: 5,
        comment: 'Anya Taylor-Joy delivers a mesmerizing performance. Beautifully shot and directed.',
        userId: user.id,
        videoId: videos[4].id,
      },
    }),
    
    // Ratings for popular movies
    prisma.rating.create({
      data: {
        value: 5,
        comment: 'Mind-bending plot with incredible visuals. Nolan at his best!',
        userId: user.id,
        videoId: videos[6].id, // Inception
      },
    }),
    prisma.rating.create({
      data: {
        value: 5,
        comment: 'Heath Ledger\'s Joker is legendary. One of the best superhero movies ever made.',
        userId: user.id,
        videoId: videos[7].id, // The Dark Knight
      },
    }),
    
    // Additional ratings from second user
    prisma.rating.create({
      data: {
        value: 4,
        comment: 'Incredible visuals and soundtrack. The story gets a bit convoluted at times.',
        userId: user2.id,
        videoId: videos[6].id, // Inception
      },
    }),
    prisma.rating.create({
      data: {
        value: 3,
        comment: 'Good performances but too long for my taste.',
        userId: user2.id,
        videoId: videos[2].id, // The Irishman
      },
    }),
  ]);

  console.log(`Created ${ratings.length} ratings`);

  // Create more detailed watch history
  const watchHistory = await Promise.all([
    prisma.watchHistory.create({
      data: {
        profileId: mainProfile.id,
        videoId: videos[0].id, // Stranger Things
        progress: 1800,
        completed: false,
        watchedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
    }),
    prisma.watchHistory.create({
      data: {
        profileId: mainProfile.id,
        videoId: videos[4].id, // Queen's Gambit
        progress: 2340,
        completed: true,
        watchedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
    }),
    prisma.watchHistory.create({
      data: {
        profileId: mainProfile.id,
        videoId: videos[6].id, // Inception
        progress: 4500,
        completed: false,
        watchedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
    }),
    prisma.watchHistory.create({
      data: {
        profileId: kidsProfile.id,
        videoId: videos[0].id, // Stranger Things
        progress: 900,
        completed: false,
        watchedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
    }),
    prisma.watchHistory.create({
      data: {
        profileId: user2Profile.id,
        videoId: videos[7].id, // The Dark Knight
        progress: 8000,
        completed: false,
        watchedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
    }),
  ]);

  console.log(`Created ${watchHistory.length} watch history entries`);

  // Create subscriptions
  const subscription = await prisma.subscription.create({
    data: {
      userId: user.id,
      stripeCustomerId: 'cus_' + randomUUID(),
      stripeSubscriptionId: 'sub_' + randomUUID(),
      stripePriceId: 'price_' + randomUUID(),
      stripeCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      plan: 'PREMIUM',
      status: 'ACTIVE',
    },
  });

  const subscription2 = await prisma.subscription.create({
    data: {
      userId: user2.id,
      stripeCustomerId: 'cus_' + randomUUID(),
      stripeSubscriptionId: 'sub_' + randomUUID(),
      stripePriceId: 'price_' + randomUUID(),
      stripeCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      plan: 'STANDARD',
      status: 'ACTIVE',
    },
  });

  console.log('Created subscriptions');

  // Create image assets
  const imageAssets = await Promise.all([
    prisma.imageAsset.create({
      data: {
        url: 'https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
        key: 'stranger-things-banner',
        type: 'BANNER',
        size: 1024000,
        width: 1920,
        height: 1080,
      },
    }),
    prisma.imageAsset.create({
      data: {
        url: 'https://image.tmdb.org/t/p/original/m6eRgkR1KC6Mr6gKKPmlCnFNbLp.jpg',
        key: 'witcher-banner',
        type: 'BANNER',
        size: 1024000,
        width: 1920,
        height: 1080,
      },
    }),
    prisma.imageAsset.create({
      data: {
        url: 'https://image.tmdb.org/t/p/original/cPuPt6mYJ83DjvO3hbjNGug6Fos.jpg',
        key: 'netflix-logo',
        type: 'LOGO',
        size: 51200,
        width: 800,
        height: 450,
      },
    }),
    prisma.imageAsset.create({
      data: {
        url: 'https://image.tmdb.org/t/p/original/rSPw7tgCH9c6NqICZef4kZjFOQ5.jpg',
        key: 'interstellar-banner',
        type: 'BANNER',
        size: 1024000,
        width: 1920,
        height: 1080,
      },
    }),
    prisma.imageAsset.create({
      data: {
        url: 'https://image.tmdb.org/t/p/original/qJeU7KM4nT2C1WpOrwPcSDGFUWE.jpg',
        key: 'dark-knight-banner',
        type: 'BANNER',
        size: 1024000,
        width: 1920,
        height: 1080,
      },
    }),
  ]);

  console.log(`Created ${imageAssets.length} image assets`);

  console.log('Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
