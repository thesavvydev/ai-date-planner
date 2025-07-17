import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { z } from "zod";

export const maxDuration = 30;

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

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = streamObject({
    model: openai("gpt-4o"),
    prompt: `Generate date ideas based on the following location: ${prompt}`,
    system: `You are a helpful AI assistant that helps users plan a date.
   You can also provide weather information for the date location.  Suggest dates for each of the following categories of date ideas: Casual & Relaxed, Adventurous & Engaging, Creative & Learning, Romantic & Intimate, At-Home & Cozy
    `,
    output: "array",
    schema: dateIdeaSchema,
  });

  return result.toTextStreamResponse();
}
