"use client";

import { dateIdeaSchema } from "@/schema/dateIdea";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import z from "zod";

export default function Chat() {
  const { object, submit, isLoading } = useObject({
    api: "/api/chat",
    schema: z.array(dateIdeaSchema),
  });

  return (
    <div className="relative h-screen max-w-xl mx-auto py-20">
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 grid place-items-center">
          Loading...
        </div>
      )}
      <div className="grid justify-center gap-2">
        {object?.flatMap((dateIdea) =>
          dateIdea ? (
            <div
              className="bg-slate-700 p-4 text-gray-200 w-full rounded-2xl"
              key={dateIdea.id}
            >
              {JSON.stringify(dateIdea)}
            </div>
          ) : (
            []
          )
        )}
      </div>
      <div className="h-32" />
      <div className="fixed bottom-10 w-full">
        <form
          className="bg-white rounded-lg shadow-md max-w-xl"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            submit({ prompt: formData.get("prompt") as string });
            e.currentTarget.reset();
          }}
        >
          <input
            className="text-gray-800 placeholder-gray-500 w-full p-4"
            name="prompt"
            placeholder="Say something..."
          />
        </form>
      </div>
    </div>
  );
}
