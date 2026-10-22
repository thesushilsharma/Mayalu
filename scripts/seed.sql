-- ============================================================================
-- MAYALU CANDIDATES SEED DATA (Future-Proof PostgreSQL Seed)
-- Seeds verified users, Chino (चीनो) matrimonial profiles, and Dhukuti (ढुकुटी) vaults
-- ============================================================================

-- 1. NEON AUTH USERS (neon_auth."user")
INSERT INTO neon_auth."user" (
  id, email, name, "emailVerified", image, role, banned, "createdAt", "updatedAt"
) VALUES 
  (
    '212b6b9a-fb2e-4bf6-b757-4819f3fbf419'::uuid,
    'sushil@mayalu.test',
    'Sushil Sharma',
    true,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
    'admin',
    false,
    NOW(),
    NOW()
  ),
  (
    'e2696210-0c9d-4603-81b2-e22498800bd2'::uuid,
    'priya@mayalu.test',
    'Priya Adhikari',
    true,
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    'user',
    false,
    NOW(),
    NOW()
  ),
  (
    'f42ee29e-5e57-4776-9c46-5e3e728caf21'::uuid,
    'ananya@mayalu.test',
    'Ananya Karki',
    true,
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
    'user',
    false,
    NOW(),
    NOW()
  ),
  (
    'c83f6691-e012-4fed-94b2-bdaf33f1a2b3'::uuid,
    'aarav@mayalu.test',
    'Aarav Shrestha',
    true,
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80',
    'user',
    false,
    NOW(),
    NOW()
  ),
  (
    'ce97f8d1-cb3e-4b45-a060-72d8a42be561'::uuid,
    'bikram@mayalu.test',
    'Bikram Gurung',
    true,
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80',
    'user',
    false,
    NOW(),
    NOW()
  ),
  (
    '1a9fdf3f-4c2f-44ac-85d3-7047e9e08f71'::uuid,
    'shraddha@mayalu.test',
    'Shraddha Joshi',
    true,
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=80',
    'user',
    false,
    NOW(),
    NOW()
  ),
  (
    '327adf58-a326-4fae-88bb-c940f3eaa428'::uuid,
    'rohan@mayalu.test',
    'Rohan Thapa',
    true,
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop&q=80',
    'user',
    false,
    NOW(),
    NOW()
  ),
  (
    'dae307fd-296e-4d89-bbee-5d17f04ee9ad'::uuid,
    'pooja@mayalu.test',
    'Pooja Rai',
    true,
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80',
    'user',
    false,
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "emailVerified" = true,
  image = EXCLUDED.image,
  role = EXCLUDED.role,
  banned = false,
  "updatedAt" = NOW();


-- 2. NEON AUTH CREDENTIAL ACCOUNTS (neon_auth."account")
-- Clean up any prior duplicate accounts for candidate users
DELETE FROM neon_auth."account" WHERE "userId" IN (
  '212b6b9a-fb2e-4bf6-b757-4819f3fbf419'::uuid,
  'e2696210-0c9d-4603-81b2-e22498800bd2'::uuid,
  'f42ee29e-5e57-4776-9c46-5e3e728caf21'::uuid,
  'c83f6691-e012-4fed-94b2-bdaf33f1a2b3'::uuid,
  'ce97f8d1-cb3e-4b45-a060-72d8a42be561'::uuid,
  '1a9fdf3f-4c2f-44ac-85d3-7047e9e08f71'::uuid,
  '327adf58-a326-4fae-88bb-c940f3eaa428'::uuid,
  'dae307fd-296e-4d89-bbee-5d17f04ee9ad'::uuid
);

-- Password for all test users: Mayalu123!
INSERT INTO neon_auth."account" (
  id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt"
) VALUES 
  ('212b6b9a-fb2e-4bf6-b757-4819f3fbf410'::uuid, '212b6b9a-fb2e-4bf6-b757-4819f3fbf419', 'credential', '212b6b9a-fb2e-4bf6-b757-4819f3fbf419'::uuid, '6bd5ab63fa194c62f19a68ae76701da4:07329af7edd1ddebd446cc35be54cefbe0c25aa32aece5f1e803ef32b7899b1b53294987d5189dd6ba9affae1cd25bc2a1e83bb413a66ce40aad15ae569fb9a4', NOW(), NOW()),
  ('e2696210-0c9d-4603-81b2-e22498800bd0'::uuid, 'e2696210-0c9d-4603-81b2-e22498800bd2', 'credential', 'e2696210-0c9d-4603-81b2-e22498800bd2'::uuid, '6bd5ab63fa194c62f19a68ae76701da4:07329af7edd1ddebd446cc35be54cefbe0c25aa32aece5f1e803ef32b7899b1b53294987d5189dd6ba9affae1cd25bc2a1e83bb413a66ce40aad15ae569fb9a4', NOW(), NOW()),
  ('f42ee29e-5e57-4776-9c46-5e3e728caf20'::uuid, 'f42ee29e-5e57-4776-9c46-5e3e728caf21', 'credential', 'f42ee29e-5e57-4776-9c46-5e3e728caf21'::uuid, '6bd5ab63fa194c62f19a68ae76701da4:07329af7edd1ddebd446cc35be54cefbe0c25aa32aece5f1e803ef32b7899b1b53294987d5189dd6ba9affae1cd25bc2a1e83bb413a66ce40aad15ae569fb9a4', NOW(), NOW()),
  ('c83f6691-e012-4fed-94b2-bdaf33f1a2b0'::uuid, 'c83f6691-e012-4fed-94b2-bdaf33f1a2b3', 'credential', 'c83f6691-e012-4fed-94b2-bdaf33f1a2b3'::uuid, '6bd5ab63fa194c62f19a68ae76701da4:07329af7edd1ddebd446cc35be54cefbe0c25aa32aece5f1e803ef32b7899b1b53294987d5189dd6ba9affae1cd25bc2a1e83bb413a66ce40aad15ae569fb9a4', NOW(), NOW()),
  ('ce97f8d1-cb3e-4b45-a060-72d8a42be560'::uuid, 'ce97f8d1-cb3e-4b45-a060-72d8a42be561', 'credential', 'ce97f8d1-cb3e-4b45-a060-72d8a42be561'::uuid, '6bd5ab63fa194c62f19a68ae76701da4:07329af7edd1ddebd446cc35be54cefbe0c25aa32aece5f1e803ef32b7899b1b53294987d5189dd6ba9affae1cd25bc2a1e83bb413a66ce40aad15ae569fb9a4', NOW(), NOW()),
  ('1a9fdf3f-4c2f-44ac-85d3-7047e9e08f70'::uuid, '1a9fdf3f-4c2f-44ac-85d3-7047e9e08f71', 'credential', '1a9fdf3f-4c2f-44ac-85d3-7047e9e08f71'::uuid, '6bd5ab63fa194c62f19a68ae76701da4:07329af7edd1ddebd446cc35be54cefbe0c25aa32aece5f1e803ef32b7899b1b53294987d5189dd6ba9affae1cd25bc2a1e83bb413a66ce40aad15ae569fb9a4', NOW(), NOW()),
  ('327adf58-a326-4fae-88bb-c940f3eaa420'::uuid, '327adf58-a326-4fae-88bb-c940f3eaa428', 'credential', '327adf58-a326-4fae-88bb-c940f3eaa428'::uuid, '6bd5ab63fa194c62f19a68ae76701da4:07329af7edd1ddebd446cc35be54cefbe0c25aa32aece5f1e803ef32b7899b1b53294987d5189dd6ba9affae1cd25bc2a1e83bb413a66ce40aad15ae569fb9a4', NOW(), NOW()),
  ('dae307fd-296e-4d89-bbee-5d17f04ee9a0'::uuid, 'dae307fd-296e-4d89-bbee-5d17f04ee9ad', 'credential', 'dae307fd-296e-4d89-bbee-5d17f04ee9ad'::uuid, '6bd5ab63fa194c62f19a68ae76701da4:07329af7edd1ddebd446cc35be54cefbe0c25aa32aece5f1e803ef32b7899b1b53294987d5189dd6ba9affae1cd25bc2a1e83bb413a66ce40aad15ae569fb9a4', NOW(), NOW());


-- 3. PUBLIC USER PROFILES (public.user_profiles)
-- Includes Chino, Dhukuti photos, prompts, and verified private corner
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
) VALUES 
  (
    'e2696210-0c9d-4603-81b2-e22498800bd2'::uuid,
    true,
    'Priya',
    25,
    'Female',
    'Male',
    'Pokhara, Nepal (Lakeside)',
    'Marriage / Matrimonial (विवाह)',
    'Daily (Power of 24 Hours)',
    'Bipul Chettri - Syndicate',
    'Kind to animals, listens actively, enjoys slow peaceful evenings and heritage woodcraft',
    'Architectural Conservationist',
    'Restoring heritage woodcraft in Patan & Pokhara. Sunday watercolor painter, lover of mist over Fewa Lake, and passionate about sustainable vernacular architecture. 🏔️🎨',
    '5 ft 5 in',
    'Pulchowk Campus, IOE',
    ARRAY['Himalayan Treks', 'Specialty Coffee', 'Indie Cinema', 'Mutual Empathy', 'Traditional Arts', 'Nepali Literature', 'Shared Growth'],
    '{
      "The secret to my heart...": "Taking time to notice the architectural woodcraft on old windows and laughing together over hot chiya.",
      "Ideal Sunday morning...": "Fewa Lake sunrise walk, painting watercolors with warm spiced tea.",
      "We''ll get along if...": "You respect traditions while creating new memories with an open mind."
    }'::jsonb,
    '{"drinking": "Socially", "smoking": "Never", "kids": "Want someday"}'::jsonb,
    '{
      "gotra": "Vashistha",
      "caste": "Chhetri",
      "religion": "Hindu",
      "dietary": "Flexitarian",
      "chiyaPreference": "CTC Spiced Chiya with Bay Leaf & Cinnamon",
      "astrologyOpenness": "Open to horoscope review, prioritizes genuine connection",
      "familyVibe": "Warm, artistic, values education and integrity",
      "verificationStatus": "verified",
      "verificationSelfie": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
    }'::jsonb,
    '{"ageRangeMin": 24, "ageRangeMax": 33, "distance": "Nepal / Anywhere"}'::jsonb,
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80'
    ],
    NOW(),
    NOW()
  ),
  (
    '212b6b9a-fb2e-4bf6-b757-4819f3fbf419'::uuid,
    true,
    'Sushil',
    27,
    'Male',
    'Female',
    'Kathmandu, Nepal (London 🇬🇧)',
    'Marriage / Matrimonial (विवाह)',
    'Daily (Power of 24 Hours)',
    '1974 AD - Mayalu',
    'Loves deep fireside conversations, respects cultural roots while championing modern growth',
    'Full-Stack AI & Graph Engineer',
    'Crafting graph-powered connections for Mayalu. Himalayan trekker, chiya philosopher, and amateur acoustic guitarist. Looking for mutual empathy and lifelong partnership. ☕🎸',
    '5 ft 10 in',
    'Tribhuvan University / London',
    ARRAY['Himalayan Treks', 'Specialty Coffee', 'Indie Cinema', 'Morning Chiya', 'Acoustic Pop', 'Tech Innovation', 'Mutual Empathy'],
    '{
      "The secret to my heart...": "A piping hot cup of spiced Ilaam chiya after an Annapurna trail walk.",
      "Ideal Sunday morning...": "Acoustic guitar melodies, brewing pour-over espresso, and planning our next mountain hike.",
      "We''ll get along if...": "You value emotional intelligence, family warmth, and laugh at nerdy tech humor."
    }'::jsonb,
    '{"drinking": "Never", "smoking": "Never", "kids": "Want someday"}'::jsonb,
    '{
      "gotra": "Kashyap",
      "caste": "Brahmin",
      "religion": "Hindu / Spiritual",
      "dietary": "Vegetarian",
      "chiyaPreference": "Ilaam Organic Tea with Cardamom & Fresh Ginger",
      "astrologyOpenness": "Kundali optional, mutual respect mandatory",
      "familyVibe": "Warm, respectful family with deep cultural roots & open mindset",
      "verificationStatus": "verified",
      "verificationSelfie": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
    }'::jsonb,
    '{"ageRangeMin": 22, "ageRangeMax": 32, "distance": "Anywhere"}'::jsonb,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80'
    ],
    NOW(),
    NOW()
  ),
  (
    'f42ee29e-5e57-4776-9c46-5e3e728caf21'::uuid,
    true,
    'Ananya',
    26,
    'Female',
    'Male',
    'New York, NY (Kathmandu Roots)',
    'Marriage / Matrimonial (विवाह)',
    'Twice a week (craving momos daily)',
    'Sajjan Raj Vaidya - Hataarindai Bataasindai',
    'Direct communicator, balances ambitious career with warm family values, funny',
    'Data Scientist',
    'Analyzing graph algorithms by weekday, running Central Park loops on Saturdays, making homemade momos on cold NYC Sundays. 🗽🥟',
    '5 ft 6 in',
    'Columbia University',
    ARRAY['Himalayan Treks', 'Tech Innovation', 'Specialty Coffee', 'Mutual Empathy', 'Indie Cinema'],
    '{
      "The secret to my heart...": "A good sense of humor, ambition, and not taking life too seriously.",
      "We will get along if...": "You can keep up on a hiking trail and enjoy debating tech and philosophy."
    }'::jsonb,
    '{"drinking": "Socially", "smoking": "Never", "kids": "Want someday"}'::jsonb,
    '{
      "gotra": "Bharadwaj",
      "caste": "Chhetri",
      "religion": "Hindu",
      "dietary": "Non-Vegetarian",
      "chiyaPreference": "Cardamom black chiya",
      "astrologyOpenness": "Kundali optional",
      "familyVibe": "Supportive, global diaspora values with strong Nepali identity",
      "verificationStatus": "verified",
      "verificationSelfie": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80"
    }'::jsonb,
    '{"ageRangeMin": 25, "ageRangeMax": 34, "distance": "Global"}'::jsonb,
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80'
    ],
    NOW(),
    NOW()
  ),
  (
    'c83f6691-e012-4fed-94b2-bdaf33f1a2b3'::uuid,
    true,
    'Aarav',
    28,
    'Male',
    'Female',
    'Kathmandu (Patan Durbar)',
    'Long-term relationship',
    'Daily dal bhat enthusiast',
    'Albatross - Kalo Kesh',
    'Passionate about artistic storytelling, emotionally grounded, great home cook',
    'Cinematographer & Creative Director',
    'Documenting disappearing Himalayan traditions through cinema. Specialized espresso geek and midnight street photographer in Basantapur. 🎬☕',
    '5 ft 11 in',
    'Kathmandu University',
    ARRAY['Indie Cinema', 'Specialty Coffee', 'Photography', 'Momo Crawls', 'Shared Growth', 'Himalayan Treks'],
    '{
      "The secret to my heart...": "A plate of spicy jhol momos and talking about 90s cinema until 2 AM.",
      "Ideal Sunday morning...": "Roasting single-origin coffee beans and listening to classic 90s rock."
    }'::jsonb,
    '{"drinking": "Socially", "smoking": "Never", "kids": "Open to kids"}'::jsonb,
    '{
      "gotra": "Open",
      "caste": "Newar",
      "religion": "Buddhist / Hindu",
      "dietary": "Foodie / Samay Baji fan",
      "chiyaPreference": "Pour-over drip & Matka chiya",
      "astrologyOpenness": "Open minded",
      "familyVibe": "Festive Newari family dinners, celebrates Indra Jatra & Dashain together",
      "verificationStatus": "verified",
      "verificationSelfie": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80"
    }'::jsonb,
    '{"ageRangeMin": 23, "ageRangeMax": 31, "distance": "Kathmandu / Remote"}'::jsonb,
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&auto=format&fit=crop&q=80'
    ],
    NOW(),
    NOW()
  ),
  (
    'ce97f8d1-cb3e-4b45-a060-72d8a42be561'::uuid,
    true,
    'Bikram',
    29,
    'Male',
    'Female',
    'Dharan / Sydney, Australia',
    'Marriage / Matrimonial (विवाह)',
    'Twice a day',
    'Cobweb - Maryo Ni Maryo',
    'Reliable, patient, adventurous, cooks incredible Nepali goat curry and dal bhat',
    'Civil & Structural Engineer',
    'Summiting Annapurna basecamp thrice. Guitar enthusiast, dal bhat connoisseur, and passionate about building bridges literally and culturally. 🏔️🎸',
    '5 ft 11 in',
    'UNSW Sydney',
    ARRAY['Himalayan Treks', 'Bouldering', 'Acoustic Pop', 'Morning Chiya', 'Mutual Empathy'],
    '{
      "The secret to my heart...": "Cooking together while singing classic 90s Nepali rock songs.",
      "My greatest adventure so far...": "Overnight camping under the Annapurna starlight in sub-zero frost."
    }'::jsonb,
    '{"drinking": "Socially", "smoking": "Never", "kids": "Want someday"}'::jsonb,
    '{
      "gotra": "Ghyabre",
      "caste": "Gurung",
      "religion": "Buddhist / Hindu",
      "dietary": "Non-Vegetarian",
      "chiyaPreference": "Sweet milky ginger chiya",
      "astrologyOpenness": "Respects family traditions, prioritizes real compatibility",
      "familyVibe": "Warm Gurung hospitality, family gatherings filled with folk music and laughter",
      "verificationStatus": "verified",
      "verificationSelfie": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80"
    }'::jsonb,
    '{"ageRangeMin": 23, "ageRangeMax": 31, "distance": "Anywhere"}'::jsonb,
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80'
    ],
    NOW(),
    NOW()
  ),
  (
    '1a9fdf3f-4c2f-44ac-85d3-7047e9e08f71'::uuid,
    true,
    'Shraddha',
    26,
    'Female',
    'Male',
    'Toronto, Canada (Bhaktapur)',
    'Marriage / Matrimonial (विवाह)',
    'Daily (Power of 24 Hours)',
    'Tribal Rain - Bhanai',
    'Emotionally attuned, calm presence, loves reading literature, makes great tea',
    'Clinical Psychologist',
    'Mindfulness practitioner, lover of antique pottery in Bhaktapur, and weekend baker. Believes in intentional love, emotional depth, and slow living. 🌿🧘‍♀️',
    '5 ft 4 in',
    'University of Toronto',
    ARRAY['Meditation & Mindfulness', 'Mutual Empathy', 'Specialty Coffee', 'Nepali Literature', 'Shared Growth'],
    '{
      "The secret to my heart...": "Being gentle with words and being able to sit in comfortable silence.",
      "Ideal Sunday morning...": "Brewing herbal tea, journaling, and enjoying a quiet morning walk."
    }'::jsonb,
    '{"drinking": "Never", "smoking": "Never", "kids": "Want someday"}'::jsonb,
    '{
      "gotra": "Garg",
      "caste": "Brahmin",
      "religion": "Hindu",
      "dietary": "Vegetarian",
      "chiyaPreference": "Tulsi & Cardamom spiced herbal chiya",
      "astrologyOpenness": "Open to traditional Kundali matching with mutual understanding",
      "familyVibe": "Scholarly, compassionate, deeply values respect and empathy",
      "verificationStatus": "verified",
      "verificationSelfie": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80"
    }'::jsonb,
    '{"ageRangeMin": 25, "ageRangeMax": 33, "distance": "North America / Nepal"}'::jsonb,
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80'
    ],
    NOW(),
    NOW()
  ),
  (
    '327adf58-a326-4fae-88bb-c940f3eaa428'::uuid,
    true,
    'Rohan',
    30,
    'Male',
    'Female',
    'San Francisco, CA (Butwal)',
    'Long-term relationship',
    'Daily',
    'The Edge Band - Thaha Chaina',
    'Thoughtful, curious, supports partner ambitions unconditionally, loves road trips',
    'Lead Product Designer',
    'Designing calm technology. Passionate about road-trips down Highway 1, finding authentic Nepali timur achar in the Bay, and indie folk tunes. 🌲🚗',
    '6 ft 0 in',
    'Stanford University',
    ARRAY['Indie Cinema', 'Photography', 'Himalayan Treks', 'Specialty Coffee', 'Tech Innovation'],
    '{
      "The secret to my heart...": "Playlists with indie acoustic music and fresh momos.",
      "We will get along if...": "You love weekend road trips with no strict itinerary and good podcasts."
    }'::jsonb,
    '{"drinking": "Socially", "smoking": "Never", "kids": "Open to kids"}'::jsonb,
    '{
      "gotra": "Open",
      "caste": "Magar / Thapa",
      "religion": "Spiritual",
      "dietary": "Non-Vegetarian",
      "chiyaPreference": "Espresso tonic & Lemongrass black tea",
      "astrologyOpenness": "Open minded",
      "familyVibe": "Progressive, encouraging, values warmth and humor",
      "verificationStatus": "verified",
      "verificationSelfie": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80"
    }'::jsonb,
    '{"ageRangeMin": 24, "ageRangeMax": 32, "distance": "Global"}'::jsonb,
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80'
    ],
    NOW(),
    NOW()
  ),
  (
    'dae307fd-296e-4d89-bbee-5d17f04ee9ad'::uuid,
    true,
    'Pooja',
    25,
    'Female',
    'Male',
    'Austin, TX (Dharan)',
    'Dating to explore',
    'Standard (Once a day)',
    'Sushant KC - Gulabi',
    'Creative spark, high energy, loves spontaneous jams, super loyal friend',
    'Sound Engineer & Music Producer',
    'Making beats with traditional sarangi and modern synthesizers. Vinyl collector, spicy street food seeker, and mountain daydreamer. 🎧🎵',
    '5 ft 5 in',
    'UT Austin',
    ARRAY['Acoustic Pop', 'Indie Cinema', 'Momo Crawls', 'Mutual Empathy', 'Photography'],
    '{
      "The secret to my heart...": "Listening to an obscure indie song together and getting chills.",
      "Ideal Sunday morning...": "Flea market vinyl shopping and street tacos or spicy momos."
    }'::jsonb,
    '{"drinking": "Socially", "smoking": "Never", "kids": "Open to kids"}'::jsonb,
    '{
      "gotra": "Open",
      "caste": "Rai",
      "religion": "Kirat / Spiritual",
      "dietary": "Foodie / Open",
      "chiyaPreference": "Strong spiced masala chiya",
      "astrologyOpenness": "Casual / Not strict",
      "familyVibe": "Warm Rai heritage, vibrant celebrations with Sakela dance & good food",
      "verificationStatus": "verified",
      "verificationSelfie": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80"
    }'::jsonb,
    '{"ageRangeMin": 23, "ageRangeMax": 32, "distance": "Austin / Anywhere"}'::jsonb,
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&auto=format&fit=crop&q=80'
    ],
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
