import { neon } from '@neondatabase/serverless';
import neo4j from 'neo4j-driver';
import crypto from 'crypto';

// Reusable verified password hash from test user (password: Mayalu123!)
const DEFAULT_PASSWORD_HASH = 'b552cc3585e97e218b3ba88a02b7011c:3d3d3466b6454a96c061492779cf5274ba5e6b1928f06cb46b2dbbd6c60775d1cbda5ef50a47d9be286102060a8992381f2a4edf04cba2864de7fa711954d0ae';

const SEED_USERS = [
  {
    email: 'sushil@mayalu.test',
    name: 'Sushil Sharma',
    firstName: 'Sushil',
    role: 'admin',
    age: 27,
    gender: 'Male',
    interestedIn: 'Female',
    location: 'Kathmandu, Nepal (London 🇬🇧)',
    relationshipIntent: 'Marriage / Matrimonial (विवाह)',
    occupation: 'Full-Stack AI & Graph Engineer',
    education: 'Tribhuvan University / London',
    height: '5 ft 10 in',
    dalBhatFrequency: 'Daily (Power of 24 Hours)',
    musicRepeat: '1974 AD - Mayalu',
    greenFlag: 'Loves deep fireside conversations, respects cultural roots while championing modern growth',
    bio: 'Crafting graph-powered connections for Mayalu. Himalayan trekker, chiya philosopher, and amateur acoustic guitarist. Looking for mutual empathy and lifelong partnership.',
    interests: ['Himalayan Treks', 'Specialty Coffee', 'Indie Cinema', 'Morning Chiya', 'Acoustic Pop', 'Tech Innovation', 'Mutual Empathy'],
    values: ['Mutual Empathy', 'Shared Growth', 'Family First', 'Radical Honesty', 'Emotional Intelligence'],
    lifestyles: ['Daily Dal Bhat', 'Weekend Trekker', 'Early Morning Riser'],
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
    // 3 Photos sealed in Dhukuti (ढुकुटी)
    dhukutiPhotos: [
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&auto=format&fit=crop&q=80', // Himalayan trek
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80', // Chiya / Cafe
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80', // London bridge sunset
    ],
    // Chino (चीनो) Details
    chino: {
      gotra: 'Kashyap',
      caste: 'Brahmin',
      religion: 'Hindu / Spiritual',
      dietary: 'Vegetarian',
      chiyaPreference: 'Ilaam Organic Tea with Cardamom & Fresh Ginger',
      astrologyOpenness: 'Kundali optional, mutual respect mandatory',
      familyVibe: 'Warm, respectful family with deep cultural roots & open mindset',
      verificationStatus: 'verified', // Auto verified!
      verificationSelfie: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
    },
    prompts: {
      'The secret to my heart...': 'A piping hot cup of spiced Ilaam chiya after an Annapurna trail walk.',
      'Ideal Sunday morning...': 'Acoustic guitar melodies, brewing pour-over espresso, and planning our next mountain hike.',
      "We'll get along if...": 'You value emotional intelligence, family warmth, and laugh at nerdy tech humor.'
    },
    speedRound: { drinking: 'Never', smoking: 'Never', kids: 'Want someday' },
    dealbreakers: { ageRangeMin: 22, ageRangeMax: 32, distance: 'Anywhere' }
  },

  {
    email: 'priya@mayalu.test',
    name: 'Priya Adhikari',
    firstName: 'Priya',
    role: 'user',
    age: 25,
    gender: 'Female',
    interestedIn: 'Male',
    location: 'Pokhara, Nepal (Lakeside)',
    relationshipIntent: 'Marriage / Matrimonial (विवाह)',
    occupation: 'Architectural Conservationist',
    education: 'Pulchowk Campus, IOE',
    height: '5 ft 5 in',
    dalBhatFrequency: 'Daily (Power of 24 Hours)',
    musicRepeat: 'Bipul Chettri - Syndicate',
    greenFlag: 'Kind to animals, listens actively, enjoys slow peaceful evenings and heritage art',
    bio: 'Restoring heritage woodcraft in Patan & Pokhara. Sunday watercolor painter, lover of mist over Fewa Lake, and passionate about sustainable vernacular architecture.',
    interests: ['Himalayan Treks', 'Specialty Coffee', 'Indie Cinema', 'Mutual Empathy', 'Traditional Arts', 'Nepali Literature', 'Shared Growth'],
    values: ['Mutual Empathy', 'Shared Growth', 'Family First', 'Spiritual Depth'],
    lifestyles: ['Daily Dal Bhat', 'Weekend Trekker'],
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    // 3 Photos sealed in Dhukuti (ढुकुटी)
    dhukutiPhotos: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80', // Pokhara Lakeside
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80', // Art & Architecture
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80', // Tea garden
    ],
    chino: {
      gotra: 'Vashistha',
      caste: 'Chhetri',
      religion: 'Hindu',
      dietary: 'Flexitarian',
      chiyaPreference: 'CTC Spiced Chiya with Bay Leaf & Cinnamon',
      astrologyOpenness: 'Open to horoscope review, prioritizes genuine connection',
      familyVibe: 'Warm, artistic, values education and integrity',
      verificationStatus: 'verified', // Auto verified!
      verificationSelfie: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
    },
    prompts: {
      'The secret to my heart...': 'Taking time to notice the architectural carvings on old windows and laughing together.',
      'Ideal Sunday morning...': 'Fewa Lake sunrise walk, painting watercolors with warm spiced tea.',
      "We'll get along if...": 'You respect traditions while creating new memories with an open mind.'
    },
    speedRound: { drinking: 'Socially', smoking: 'Never', kids: 'Want someday' },
    dealbreakers: { ageRangeMin: 24, ageRangeMax: 33, distance: 'Nepal / Anywhere' }
  },

  {
    email: 'aarav@mayalu.test',
    name: 'Aarav Shrestha',
    firstName: 'Aarav',
    role: 'user',
    age: 28,
    gender: 'Male',
    interestedIn: 'Female',
    location: 'Kathmandu (Patan Durbar)',
    relationshipIntent: 'Long-term relationship',
    occupation: 'Cinematographer & Creative Director',
    education: 'Kathmandu University',
    height: '5 ft 11 in',
    dalBhatFrequency: 'Daily dal bhat enthusiast',
    musicRepeat: 'Albatross - Kalo Kesh',
    greenFlag: 'Passionate about artistic storytelling, emotionally grounded, great home cook',
    bio: 'Documenting disappearing Himalayan traditions through cinema. Specialized espresso geek and midnight street photographer in Basantapur alleyways.',
    interests: ['Indie Cinema', 'Specialty Coffee', 'Photography', 'Momo Crawls', 'Shared Growth', 'Himalayan Treks'],
    values: ['Shared Growth', 'Emotional Intelligence', 'Radical Honesty'],
    lifestyles: ['Daily Dal Bhat', 'Night Thinker'],
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80',
    dhukutiPhotos: [
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&auto=format&fit=crop&q=80',
    ],
    chino: {
      gotra: 'Open',
      caste: 'Newar',
      religion: 'Buddhist / Hindu',
      dietary: 'Foodie / Samay Baji fan',
      chiyaPreference: 'Pour-over drip & Matka chiya',
      astrologyOpenness: 'Open minded',
      familyVibe: 'Festive Newari family dinners, celebrates Indra Jatra & Dashain together',
      verificationStatus: 'verified',
      verificationSelfie: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'
    },
    prompts: {
      'The secret to my heart...': 'A plate of spicy jhol momos and talking about 90s cinema until 2 AM.',
      'Ideal Sunday morning...': 'Roasting single-origin coffee beans and listening to classic jazz.'
    },
    speedRound: { drinking: 'Socially', smoking: 'Never', kids: 'Open to kids' },
    dealbreakers: { ageRangeMin: 23, ageRangeMax: 31, distance: 'Kathmandu / Remote' }
  },

  {
    email: 'ananya@mayalu.test',
    name: 'Ananya Karki',
    firstName: 'Ananya',
    role: 'user',
    age: 26,
    gender: 'Female',
    interestedIn: 'Male',
    location: 'New York, NY (Kathmandu Roots)',
    relationshipIntent: 'Marriage / Matrimonial (विवाह)',
    occupation: 'Data Scientist & Tech Nomad',
    education: 'Columbia University',
    height: '5 ft 6 in',
    dalBhatFrequency: 'Twice a week (craving momos daily)',
    musicRepeat: 'Sajjan Raj Vaidya - Hataarindai Bataasindai',
    greenFlag: 'Direct communicator, balances ambitious career with warm family values, funny',
    bio: 'Analyzing graph algorithms by weekday, running Central Park loops on Saturdays, making homemade momos on cold NYC Sundays.',
    interests: ['Himalayan Treks', 'Tech Innovation', 'Specialty Coffee', 'Mutual Empathy', 'Indie Cinema'],
    values: ['Mutual Empathy', 'Shared Growth', 'Financial Responsibility', 'Family First'],
    lifestyles: ['Remote Nomad', 'Early Morning Riser'],
    profilePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
    dhukutiPhotos: [
      'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    ],
    chino: {
      gotra: 'Bharadwaj',
      caste: 'Chhetri',
      religion: 'Hindu',
      dietary: 'Non-Vegetarian',
      chiyaPreference: 'Cardamom black chiya',
      astrologyOpenness: 'Kundali optional',
      familyVibe: 'Supportive, global diaspora values with strong Nepali identity',
      verificationStatus: 'verified',
      verificationSelfie: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80'
    },
    prompts: {
      'The secret to my heart...': 'A good sense of humor, ambition, and not taking life too seriously.',
      'We will get along if...': 'You can keep up on a hiking trail and enjoy debating tech and philosophy.'
    },
    speedRound: { drinking: 'Socially', smoking: 'Never', kids: 'Want someday' },
    dealbreakers: { ageRangeMin: 25, ageRangeMax: 34, distance: 'Global' }
  },

  {
    email: 'bikram@mayalu.test',
    name: 'Bikram Gurung',
    firstName: 'Bikram',
    role: 'user',
    age: 29,
    gender: 'Male',
    interestedIn: 'Female',
    location: 'Dharan / Sydney, Australia',
    relationshipIntent: 'Marriage / Matrimonial (विवाह)',
    occupation: 'Civil & Structural Engineer',
    education: 'UNSW Sydney',
    height: '5 ft 11 in',
    dalBhatFrequency: 'Twice a day',
    musicRepeat: 'Cobweb - Maryo Ni Maryo',
    greenFlag: 'Reliable, patient, adventurous, cooks incredible Nepali goat curry and dal bhat',
    bio: 'Summiting Annapurna basecamp thrice. Guitar enthusiast, dal bhat connoisseur, and passionate about building bridges literally and culturally.',
    interests: ['Himalayan Treks', 'Bouldering', 'Acoustic Pop', 'Morning Chiya', 'Mutual Empathy'],
    values: ['Family First', 'Mutual Empathy', 'Radical Honesty'],
    lifestyles: ['Daily Dal Bhat', 'Weekend Trekker'],
    profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80',
    dhukutiPhotos: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
    ],
    chino: {
      gotra: 'Ghyabre',
      caste: 'Gurung',
      religion: 'Buddhist / Hindu',
      dietary: 'Non-Vegetarian',
      chiyaPreference: 'Sweet milky ginger chiya',
      astrologyOpenness: 'Respects family traditions, prioritizes real compatibility',
      familyVibe: 'Warm Gurung hospitality, family gatherings filled with folk music and laughter',
      verificationStatus: 'verified',
      verificationSelfie: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80'
    },
    prompts: {
      'The secret to my heart...': 'Cooking together while singing classic 90s Nepali rock songs.',
      'My greatest adventure so far...': 'Overnight camping under the Annapurna starlight in sub-zero frost.'
    },
    speedRound: { drinking: 'Socially', smoking: 'Never', kids: 'Want someday' },
    dealbreakers: { ageRangeMin: 23, ageRangeMax: 31, distance: 'Anywhere' }
  },

  {
    email: 'shraddha@mayalu.test',
    name: 'Shraddha Joshi',
    firstName: 'Shraddha',
    role: 'user',
    age: 26,
    gender: 'Female',
    interestedIn: 'Male',
    location: 'Toronto, Canada (Bhaktapur)',
    relationshipIntent: 'Marriage / Matrimonial (विवाह)',
    occupation: 'Clinical Psychologist',
    education: 'University of Toronto',
    height: '5 ft 4 in',
    dalBhatFrequency: 'Daily (Power of 24 Hours)',
    musicRepeat: 'Tribal Rain - Bhanai',
    greenFlag: 'Emotionally attuned, calm presence, loves reading literature, makes great tea',
    bio: 'Mindfulness practitioner, lover of antique pottery in Bhaktapur, and weekend baker. Believes in intentional love, emotional depth, and slow living.',
    interests: ['Meditation & Mindfulness', 'Mutual Empathy', 'Specialty Coffee', 'Nepali Literature', 'Shared Growth'],
    values: ['Mutual Empathy', 'Emotional Intelligence', 'Shared Growth', 'Family First'],
    lifestyles: ['Early Morning Riser', 'Daily Dal Bhat'],
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=80',
    dhukutiPhotos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    ],
    chino: {
      gotra: 'Garg',
      caste: 'Brahmin',
      religion: 'Hindu',
      dietary: 'Vegetarian',
      chiyaPreference: 'Tulsi & Cardamom spiced herbal chiya',
      astrologyOpenness: 'Open to traditional Kundali matching with mutual understanding',
      familyVibe: 'Scholarly, compassionate, deeply values respect and empathy',
      verificationStatus: 'verified',
      verificationSelfie: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80'
    },
    prompts: {
      'The secret to my heart...': 'Being gentle with words and being able to sit in comfortable silence.',
      'Ideal Sunday morning...': 'Brewing herbal tea, journaling, and enjoying a quiet morning walk.'
    },
    speedRound: { drinking: 'Never', smoking: 'Never', kids: 'Want someday' },
    dealbreakers: { ageRangeMin: 25, ageRangeMax: 33, distance: 'North America / Nepal' }
  },

  {
    email: 'rohan@mayalu.test',
    name: 'Rohan Thapa',
    firstName: 'Rohan',
    role: 'user',
    age: 30,
    gender: 'Male',
    interestedIn: 'Female',
    location: 'San Francisco, CA (Butwal)',
    relationshipIntent: 'Long-term relationship',
    occupation: 'Lead Product Designer',
    education: 'Stanford University',
    height: '6 ft 0 in',
    dalBhatFrequency: 'Daily',
    musicRepeat: 'The Edge Band - Thaha Chaina',
    greenFlag: 'Thoughtful, curious, supports partner ambitions unconditionally, loves road trips',
    bio: 'Designing calm technology. Passionate about road-trips down Highway 1, finding authentic Nepali timur achar in the Bay, and indie folk tunes.',
    interests: ['Indie Cinema', 'Photography', 'Himalayan Treks', 'Specialty Coffee', 'Tech Innovation'],
    values: ['Shared Growth', 'Radical Honesty', 'Mutual Empathy'],
    lifestyles: ['Remote Nomad', 'Weekend Trekker'],
    profilePhoto: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop&q=80',
    dhukutiPhotos: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80',
    ],
    chino: {
      gotra: 'Open',
      caste: 'Magar / Thapa',
      religion: 'Spiritual',
      dietary: 'Non-Vegetarian',
      chiyaPreference: 'Espresso tonic & Lemongrass black tea',
      astrologyOpenness: 'Open minded',
      familyVibe: 'Progressive, encouraging, values warmth and humor',
      verificationStatus: 'verified',
      verificationSelfie: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80'
    },
    prompts: {
      'The secret to my heart...': 'Playlists with indie acoustic music and fresh momos.',
      'We will get along if...': 'You love weekend getaways with no strict itinerary.'
    },
    speedRound: { drinking: 'Socially', smoking: 'Never', kids: 'Open to kids' },
    dealbreakers: { ageRangeMin: 24, ageRangeMax: 32, distance: 'Global' }
  },

  {
    email: 'pooja@mayalu.test',
    name: 'Pooja Rai',
    firstName: 'Pooja',
    role: 'user',
    age: 25,
    gender: 'Female',
    interestedIn: 'Male',
    location: 'Austin, TX (Dharan)',
    relationshipIntent: 'Dating to explore',
    occupation: 'Sound Engineer & Music Producer',
    education: 'UT Austin',
    height: '5 ft 5 in',
    dalBhatFrequency: 'Standard (Once a day)',
    musicRepeat: 'Sushant KC - Gulabi',
    greenFlag: 'Creative spark, high energy, loves spontaneous jams, super loyal friend',
    bio: 'Making beats with traditional sarangi and modern synthesizers. Vinyl collector, spicy street food seeker, and mountain daydreamer.',
    interests: ['Acoustic Pop', 'Indie Cinema', 'Momo Crawls', 'Mutual Empathy', 'Photography'],
    values: ['Mutual Empathy', 'Shared Growth', 'Radical Honesty'],
    lifestyles: ['Night Thinker', 'Daily Dal Bhat'],
    profilePhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80',
    dhukutiPhotos: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&auto=format&fit=crop&q=80',
    ],
    chino: {
      gotra: 'Open',
      caste: 'Rai',
      religion: 'Kirat / Spiritual',
      dietary: 'Foodie / Open',
      chiyaPreference: 'Strong spiced masala chiya',
      astrologyOpenness: 'Casual / Not strict',
      familyVibe: 'Warm Rai heritage, vibrant celebrations with Sakela dance & good food',
      verificationStatus: 'verified',
      verificationSelfie: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80'
    },
    prompts: {
      'The secret to my heart...': 'Listening to an obscure indie song together and getting chills.',
      'Ideal Sunday morning...': 'Flea market vinyl shopping and street tacos or spicy momos.'
    },
    speedRound: { drinking: 'Socially', smoking: 'Never', kids: 'Open to kids' },
    dealbreakers: { ageRangeMin: 23, ageRangeMax: 32, distance: 'Austin / Anywhere' }
  }
];

async function seedCompleteData() {
  console.log('🚀 Starting Full Mayalu Data Seed (Neon Postgres + Neo4j Aura)...');

  // ==========================================
  // PART 1: NEON POSTGRESQL SEEDING
  // ==========================================
  const sql = neon(process.env.DATABASE_URL);
  console.log('📦 Seeding Neon PostgreSQL Auth & User Profiles...');

  for (const user of SEED_USERS) {
    try {
      // 1. Upsert neon_auth.user
      const existing = await sql`SELECT id FROM neon_auth.user WHERE email = ${user.email} LIMIT 1`;
      let userId = existing.length > 0 ? existing[0].id : crypto.randomUUID();

      if (existing.length > 0) {
        await sql`
          UPDATE neon_auth.user
          SET name = ${user.name},
              "emailVerified" = true,
              role = ${user.role},
              image = ${user.profilePhoto},
              banned = false,
              "updatedAt" = NOW()
          WHERE id = ${userId}
        `;
        console.log(`  🔄 Updated Neon Auth user: ${user.email} (${userId})`);
      } else {
        await sql`
          INSERT INTO neon_auth.user (
            id, email, name, "emailVerified", image, role, banned, "createdAt", "updatedAt"
          ) VALUES (
            ${userId}, ${user.email}, ${user.name}, true, ${user.profilePhoto}, ${user.role}, false, NOW(), NOW()
          )
        `;
        console.log(`  ✨ Created Neon Auth user: ${user.email} (${userId})`);
      }

      // 2. Ensure neon_auth.account credential entry exists
      const acc = await sql`SELECT id FROM neon_auth.account WHERE "userId" = ${userId} LIMIT 1`;
      if (acc.length === 0) {
        await sql`
          INSERT INTO neon_auth.account (
            id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt"
          ) VALUES (
            ${crypto.randomUUID()}, ${userId}, 'credential', ${userId}, ${DEFAULT_PASSWORD_HASH}, NOW(), NOW()
          )
        `;
      }

      // 3. Upsert public.user_profiles with Dhukuti & Chino data
      await sql`
        INSERT INTO public.user_profiles (
          user_id,
          onboarding_completed,
          first_name,
          age,
          gender,
          interested_in,
          location,
          relationship_intent,
          dal_bhat_frequency,
          music_repeat,
          green_flag,
          occupation,
          bio,
          height,
          education,
          interests,
          prompt_answers,
          speed_round,
          private_corner,
          dealbreakers,
          profile_photo,
          additional_photos,
          created_at,
          updated_at
        ) VALUES (
          ${userId},
          true,
          ${user.firstName},
          ${user.age},
          ${user.gender},
          ${user.interestedIn},
          ${user.location},
          ${user.relationshipIntent},
          ${user.dalBhatFrequency},
          ${user.musicRepeat},
          ${user.greenFlag},
          ${user.occupation},
          ${user.bio},
          ${user.height},
          ${user.education},
          ${user.interests},
          ${JSON.stringify(user.prompts)},
          ${JSON.stringify(user.speedRound)},
          ${JSON.stringify(user.chino)},
          ${JSON.stringify(user.dealbreakers)},
          ${user.profilePhoto},
          ${user.dhukutiPhotos},
          NOW(),
          NOW()
        )
        ON CONFLICT (user_id) DO UPDATE SET
          onboarding_completed = true,
          first_name = EXCLUDED.first_name,
          age = EXCLUDED.age,
          gender = EXCLUDED.gender,
          interested_in = EXCLUDED.interested_in,
          location = EXCLUDED.location,
          relationship_intent = EXCLUDED.relationship_intent,
          dal_bhat_frequency = EXCLUDED.dal_bhat_frequency,
          music_repeat = EXCLUDED.music_repeat,
          green_flag = EXCLUDED.green_flag,
          occupation = EXCLUDED.occupation,
          bio = EXCLUDED.bio,
          height = EXCLUDED.height,
          education = EXCLUDED.education,
          interests = EXCLUDED.interests,
          prompt_answers = EXCLUDED.prompt_answers,
          speed_round = EXCLUDED.speed_round,
          private_corner = EXCLUDED.private_corner,
          dealbreakers = EXCLUDED.dealbreakers,
          profile_photo = EXCLUDED.profile_photo,
          additional_photos = EXCLUDED.additional_photos,
          updated_at = NOW();
      `;

      user.resolvedUserId = userId;
    } catch (err) {
      console.error(`  ❌ Error seeding user ${user.email}:`, err);
    }
  }

  console.log('✅ Neon PostgreSQL successfully populated with verified Chinos & Dhukuti photos!\n');

  // ==========================================
  // PART 2: NEO4J KNOWLEDGE GRAPH SEEDING
  // ==========================================
  const uri = process.env.NEO4J_URI;
  const username = process.env.NEO4J_USERNAME;
  const password = process.env.NEO4J_PASSWORD;
  const database = process.env.NEO4J_DATABASE || 'e8cd6554';

  console.log('🌐 Connecting to Neo4j Knowledge Graph...');
  const driver = neo4j.driver(uri, neo4j.auth.basic(username, password), {
    maxConnectionPoolSize: 5,
    disableLosslessIntegers: true
  });

  try {
    for (const user of SEED_USERS) {
      const uId = user.resolvedUserId || user.email;

      const query = `
        CYPHER 25
        MERGE (u:User {userId: $userId})
        SET u.email = $email,
            u.name = $name,
            u.firstName = $firstName,
            u.age = $age,
            u.gender = $gender,
            u.location = $location,
            u.bio = $bio,
            u.relationshipIntent = $relationshipIntent,
            u.dalBhatFrequency = $dalBhatFrequency,
            u.verified = true,
            u.verificationStatus = 'verified',
            u.profilePhoto = $profilePhoto,
            u.updatedAt = datetime()

        // Link Interests with weighted affinities
        WITH u
        UNWIND $interests AS interestName
        MERGE (i:Interest {name: interestName})
        MERGE (u)-[r:PASSIONATE_ABOUT]->(i)
        ON CREATE SET r.weight = 0.92, r.since = datetime()

        // Link Values
        WITH u
        UNWIND $values AS valueName
        MERGE (v:Value {name: valueName})
        MERGE (u)-[rv:EMBODIES]->(v)
        ON CREATE SET rv.importance = 0.95

        // Link Lifestyles
        WITH u
        UNWIND $lifestyles AS lifestyleName
        MERGE (l:Lifestyle {name: lifestyleName})
        MERGE (u)-[rl:PRACTICES]->(l)

        // Link Cultural Heritage (Caste / Gotra)
        WITH u
        MERGE (c:CulturalHeritage {name: $caste})
        MERGE (u)-[:ROOTED_IN]->(c)
      `;

      await driver.executeQuery(
        query,
        {
          userId: uId,
          email: user.email,
          name: user.name,
          firstName: user.firstName,
          age: user.age,
          gender: user.gender,
          location: user.location,
          bio: user.bio,
          relationshipIntent: user.relationshipIntent,
          dalBhatFrequency: user.dalBhatFrequency,
          profilePhoto: user.profilePhoto,
          interests: user.interests,
          values: user.values,
          lifestyles: user.lifestyles,
          caste: user.chino.caste
        },
        { database }
      );
      console.log(`  🌐 Neo4j Synced: ${user.name} (${user.email})`);
    }

    // Connect Sushil and Priya as high-compatibility match cluster in Neo4j
    const sushil = SEED_USERS.find(u => u.email === 'sushil@mayalu.test');
    const priya = SEED_USERS.find(u => u.email === 'priya@mayalu.test');

    if (sushil && priya) {
      console.log('  💞 Creating topological match cluster between Sushil and Priya in Neo4j...');
      await driver.executeQuery(
        `
        CYPHER 25
        MATCH (u1:User {userId: $u1Id})
        MATCH (u2:User {userId: $u2Id})
        MERGE (u1)-[m:MATCHED_WITH]-(u2)
        SET m.harmonyIndex = 0.968,
            m.commonClusters = ['Himalayan Treks', 'Specialty Coffee', 'Indie Cinema', 'Mutual Empathy', 'Shared Growth'],
            m.updatedAt = datetime()
        MERGE (u1)-[sw:SWIPED_RIGHT]->(u2)
        SET sw.timestamp = datetime(), sw.compatibilityScore = 0.968
        `,
        {
          u1Id: sushil.resolvedUserId,
          u2Id: priya.resolvedUserId
        },
        { database }
      );
    }

    console.log('✅ Neo4j Knowledge Graph successfully seeded with rich topological nodes & relationships!');
  } catch (neoErr) {
    console.error('❌ Neo4j seeding error:', neoErr);
  } finally {
    await driver.close();
  }

  console.log('\n🎉 ALL SEEDING COMPLETE! Test accounts ready with Dhukuti photo vaults & verified Chinos.');
}

seedCompleteData();
