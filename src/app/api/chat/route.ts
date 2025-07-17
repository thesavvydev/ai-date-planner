import { dateIdeaSchema } from "@/schema/dateIdea";
import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";

export const maxDuration = 30;

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
