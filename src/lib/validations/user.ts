import { z } from 'zod';

export const userProfileSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email(),
  name: z.string().min(2).max(50),
  age: z.number().int().min(18).max(120),
  gender: z.enum(['male', 'female', 'non-binary', 'other']),
  interestedIn: z.array(z.enum(['male', 'female', 'non-binary', 'other'])),
  bio: z.string().max(500).optional(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
  photos: z.array(z.string().url()).min(1).max(6),
  preferences: z.object({
    ageMin: z.number().int().min(18).max(120),
    ageMax: z.number().int().min(18).max(120),
    distance: z.number().int().min(1).max(100),
  }),
});

export type UserProfile = z.infer<typeof userProfileSchema>;