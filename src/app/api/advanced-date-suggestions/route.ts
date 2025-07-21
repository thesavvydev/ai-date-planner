import { dateIdeaSchema } from "@/schema/dateIdea";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {

  const {  questionData }: { questionData: Record<string, any> } = await req.json();

  function formatQuestionData(data: Record<string, any>) {
    if (!data) return "";
    return Object.entries(data)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          if (value.length === 0) return `${key}: none`;
          return `${key}: ${value.join(", ")}`;
        }
        if (typeof value === "string" && value.trim() === "") {
          return `${key}: none`;
        }
        return `${key}: ${value}`;
      })
      .join("; ");
  }

  const userAnswers = formatQuestionData(questionData);

  
  const result = await generateObject({
    model: openai("gpt-4o"),
    prompt: `Generate date ideas based on the user's answers to a questionnaire. Make it the most amazing date possible.`,
    system: `You are a helpful AI assistant that helps users plan a date. 
    Use a 10 mile radius around the specified location. 
    Generate at least 5 unique date ideas per category.
    The user has provided the following answers to a questionnaire: ${userAnswers}`,
    output: "array",
    schema: dateIdeaSchema,
  });

  return result.toJsonResponse();
}
