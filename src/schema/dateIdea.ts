import { z } from "zod";

export const DATE_CATEGORIES = {
  all: { id: "all", name: "All", icon: "🌟" },
  romantic: { id: "romantic", name: "Romantic", icon: "💕" },
  outdoor: { id: "outdoor", name: "Outdoor", icon: "🌲" },
  culture: { id: "culture", name: "Culture", icon: "🎭" },
  activity: { id: "activity", name: "Activity", icon: "🎯" },
} as const;

export const dateIdeaSchema = z.object({
  id: z.string().describe("Generated unique identifier for the date idea"),
  title: z.string().describe("Title of the date idea"),
  category: z
    .enum(Object.keys(DATE_CATEGORIES) as Array<keyof typeof DATE_CATEGORIES>)
    .describe("Category of the date idea"),
  location: z.string().describe("Location of the date idea"),
  duration: z.string().describe("Duration of the date idea"),
  cost: z.string().describe("Cost of the date idea"),
  rating: z.number().min(0).max(5).describe("Rating of the date idea"),
  description: z.string().describe("Description of the date idea"),
  // category: z.string().describe("Category of date ideas"),
  // address: z.string().describe("Address of the date location"),
  // link_to_map: z
  //   .string()
  //   .optional()
  //   .describe("Full link to map for the date location"),
  // location: z.string(),
  // name: z.string(),
  // id: z.string().describe("Generated unique identifier for the date idea"),
  // cuisine: z.string(),
  // price: z.string().describe("Price range represented by $, $$, $$$, or $$$$"),
  // weather: z.number().describe("Weather in Fahrenheit"),
});

export type DateIdea = z.infer<typeof dateIdeaSchema>;
