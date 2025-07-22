import { z } from "zod";

export const DATE_CATEGORIES = {
  romantic: { id: "romantic", label: "Romantic", icon: "💕" },
  adventurous: { id: "adventurous", label: "Adventurous", icon: "🏔️" },
  chill: { id: "chill", label: "Chill", icon: "😌" },
  luxe: { id: "luxe", label: "Luxe", icon: "✨" },
  nature: { id: "nature", label: "Nature", icon: "🌿" },
  artsy: { id: "artsy", label: "Artsy", icon: "🎨" },
  goofy: { id: "goofy", label: "Goofy", icon: "🤪" },
} as const;

export const dateIdeaSchema = z.object({
  id: z.string().describe("Generated unique identifier for the date idea that can be used to get the detailed date idea"),
  title: z.string().describe("Title of the date idea"),
  category: z.string().pipe(z.enum(Object.keys(DATE_CATEGORIES) as [keyof typeof DATE_CATEGORIES, ...Array<keyof typeof DATE_CATEGORIES>])).describe("Categorize the date into one of the following enums"),
  location: z.string().describe("Location of the date idea"),
  duration: z.string().describe("Duration of the date idea"),
  cost: z.string().describe("Cost of the date idea"),
  rating: z.number().min(0).max(5).describe("Rating of the date idea"),
  description: z.string().describe("Description of the date idea.").length(200, { message: "Description must be exactly 200 characters" }),
  /* Date details */
  detailedDescription: z.string().describe("A comprehensive description of the date idea with all the details"),
  exactLocation: z.string().describe("The exact address or specific location details"),
  suggestedLocations: z.array(z.object({
    name: z.string(),
    address: z.string(),
    description: z.string(),
    website: z.string().optional(),
    phone: z.string().optional(),
  })).describe("List of specific venue suggestions for this date idea"),
  whatToBring: z.array(z.string()).describe("Items to bring for this date"),
  whatToWear: z.string().describe("Suggested attire for this date"),
  bestTime: z.string().describe("Best time of day or season for this date"),
  tips: z.array(z.string()).describe("Helpful tips for making this date successful"),
  alternatives: z.array(z.object({
    title: z.string(),
    description: z.string(),
    why: z.string(),
  })).describe("Alternative options if the main idea doesn't work out"),
  costBreakdown: z.object({
    mainActivity: z.string(),
    food: z.string(),
    transportation: z.string(),
    extras: z.string(),
    total: z.string(),
  }).describe("Detailed cost breakdown"),
  weatherConsiderations: z.string().describe("How weather might affect this date"),
  accessibility: z.string().describe("Accessibility considerations"),
  parking: z.string().describe("Parking information"),
  reservations: z.string().describe("Whether reservations are needed and how to make them"),
});

export type DateIdea = z.infer<typeof dateIdeaSchema>;
