import { Style, Avatar } from "@dicebear/core";
import initialFaceStyle from "@dicebear/styles/initial-face.json";
import loreleiStyle from "@dicebear/styles/lorelei.json";
import personasStyle from "@dicebear/styles/personas.json";
import notionistsStyle from "@dicebear/styles/notionists.json";
import adventurerStyle from "@dicebear/styles/adventurer.json";
import botttsStyle from "@dicebear/styles/bottts.json";
import thumbsStyle from "@dicebear/styles/thumbs.json";

export type DiceBearStyleName =
  | "initial-face"
  | "lorelei"
  | "personas"
  | "notionists"
  | "adventurer"
  | "bottts"
  | "thumbs";

export interface DiceBearStyleOption {
  id: DiceBearStyleName;
  label: string;
  description: string;
}

export const DICEBEAR_STYLES: DiceBearStyleOption[] = [
  {
    id: "initial-face",
    label: "Initial Face",
    description: "Minimalist, expressive & clean geometric faces",
  },
  {
    id: "lorelei",
    label: "Lorelei",
    description: "Hand-crafted artistic portraits with personality",
  },
  {
    id: "personas",
    label: "Personas",
    description: "Modern, vibrant human character silhouettes",
  },
  {
    id: "notionists",
    label: "Notionists",
    description: "Playful editorial line-art characters",
  },
  {
    id: "adventurer",
    label: "Adventurer",
    description: "Charming fantasy and modern adventurer looks",
  },
  {
    id: "thumbs",
    label: "Thumbs",
    description: "Cute cheerful thumb smileys",
  },
  {
    id: "bottts",
    label: "Bottts",
    description: "Whimsical techie friendly robot avatars",
  },
];

// Definition lookup for offline / zero-network generation
const STYLE_DEFINITIONS: Record<DiceBearStyleName, any> = {
  "initial-face": initialFaceStyle,
  lorelei: loreleiStyle,
  personas: personasStyle,
  notionists: notionistsStyle,
  adventurer: adventurerStyle,
  bottts: botttsStyle,
  thumbs: thumbsStyle,
};

// Curated avatar seeds tailored for Mayalu's Nepali & global audience
export const CURATED_DICEBEAR_SEEDS = [
  "Milo",
  "Sushi",
  "Maya",
  "Aarav",
  "Priya",
  "Rohan",
  "Sneha",
  "Bikash",
  "Pooja",
  "Anjali",
  "Kiran",
  "Diwas",
] as const;

/**
 * Returns a high-speed CDN SVG URL for a DiceBear avatar.
 * Format: https://api.dicebear.com/10.x/{style}/svg?seed={seed}
 */
export function getDiceBearUrl(
  seed: string,
  style: DiceBearStyleName = "initial-face",
  extraParams?: Record<string, string | number | boolean>
): string {
  const cleanSeed = encodeURIComponent(seed.trim() || "Milo");
  const url = new URL(`https://api.dicebear.com/10.x/${style}/svg`);
  url.searchParams.set("seed", cleanSeed);

  if (extraParams) {
    for (const [key, val] of Object.entries(extraParams)) {
      url.searchParams.set(key, String(val));
    }
  }

  return url.toString();
}

/**
 * Generates an SVG data URI locally using @dicebear/core without external network calls.
 */
export function getDiceBearDataUri(
  seed: string,
  styleName: DiceBearStyleName = "initial-face",
  options: Record<string, unknown> = {}
): string {
  try {
    const rawDef = STYLE_DEFINITIONS[styleName] || initialFaceStyle;
    const style = new Style(rawDef);
    const avatar = new Avatar(style, {
      seed: seed || "Milo",
      ...options,
    });
    return avatar.toDataUri();
  } catch (err) {
    console.error("Error generating local DiceBear data URI:", err);
    // Fallback to CDN URL if client-side rendering encounters issue
    return getDiceBearUrl(seed, styleName);
  }
}

/**
 * Curated list of DiceBear default avatars ready for profile creation and onboarding.
 */
export const DICEBEAR_AVATAR_OPTIONS: string[] = CURATED_DICEBEAR_SEEDS.map(
  (seed) => getDiceBearUrl(seed, "initial-face")
);
