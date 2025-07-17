import { z } from "zod";

export const dateIdeaSchema = z.object({
  category: z.string().describe("Category of date ideas"),
  address: z.string().describe("Address of the date location"),
  link_to_map: z
    .string()
    .optional()
    .describe("Full link to map for the date location"),
  location: z.string(),
  name: z.string(),
  id: z.string().describe("Generated unique identifier for the date idea"),
  cuisine: z.string(),
  price: z.string().describe("Price range represented by $, $$, $$$, or $$$$"),
  weather: z.number().describe("Weather in Fahrenheit"),
});

export type DateIdea = z.infer<typeof dateIdeaSchema>;
