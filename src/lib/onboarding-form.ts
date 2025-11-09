// shared-code.ts
// Notice the import path is different from the client
import { formOptions } from "@tanstack/react-form/nextjs";

// You can pass other form options here
export const onboardingFormOpts = formOptions({
  defaultValues: {
    // Step 0: Basic Info
    birthdate: "",
    gender: "" as "male" | "female" | "non-binary" | "other" | "",
    location: "",
    
    // Step 1: About You
    bio: "",
    height: "",
    education: "",
    occupation: "",
    
    // Step 2: Preferences
    interestedIn: "" as "men" | "women" | "everyone" | "",
    ageRangeMin: "18",
    ageRangeMax: "50",
    relationshipType: "dating" as "dating" | "matrimonial",
    distanceRange: "50",
    
    // Step 3: Interests
    interests: [] as string[],
    
    // Step 4: Photos
    profilePhoto: "",
    additionalPhotos: [] as string[],
  },
});
