import { dateIdeaSchema } from "@/schema/dateIdea";
import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = streamObject({
    model: openai("gpt-4o"),
    prompt: `Generate date ideas based on the following location: ${prompt}`,
    system: `You are a helpful AI assistant that helps users plan a date. Use a 10 mile radius around the specified location. Generate at least 5 unique date ideas for each category.`,
    output: "array",
    schema: dateIdeaSchema,
  });

  return result.toTextStreamResponse();
}
