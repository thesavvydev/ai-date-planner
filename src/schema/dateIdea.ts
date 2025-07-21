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
});

export type DateIdea = z.infer<typeof dateIdeaSchema>;
