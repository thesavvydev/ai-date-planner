"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DATE_CATEGORIES, DateIdea, dateIdeaSchema } from "@/schema/dateIdea";
import { experimental_useObject } from "@ai-sdk/react";
import {
  ChevronRight,
  Clock,
  MapPin,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import { FormEvent, useCallback, useState } from "react";
import z from "zod";

const categories = Object.values(DATE_CATEGORIES);

function DateCard({ idea }: { idea: DateIdea }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-4xl">{DATE_CATEGORIES[idea.category]?.icon}</div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{idea.rating}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2">{idea.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{idea.description}</p>

        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{idea.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{idea.duration}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-pink-600">{idea.cost}</span>
            <Badge className=" bg-pink-100 text-pink-700" variant="outline">
              {idea.category}
            </Badge>
          </div>
        </div>

        <button className="w-full mt-4 bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-xl font-medium hover:from-pink-600 hover:to-red-600 transition-all">
          Plan This Date
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  const [filterCategory, setFilterCategory] = useState("all");

  const {
    object: dateIdeas = [],
    submit,
    isLoading,
  } = experimental_useObject({
    api: "/api/chat",
    schema: z.array(dateIdeaSchema),
  });

  const handleSubmitSearch = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const prompt = formData.get("prompt") as string;
      submit({ prompt });
    },
    [submit]
  );

  return (
    <main className="max-w-6xl mx-auto px-4 pb-8 py-4">
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-pink-500 to-red-500 rounded-3xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Find Your Perfect Date</h2>
          <p className="text-xl mb-6 opacity-90">
            Answer a few questions and get personalized date suggestions
          </p>
          <button
            // onClick={startQuestionnaire}
            className="bg-white text-pink-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Start Date Quiz
              <ChevronRight className="w-5 h-5" />
            </span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <form
            className="relative flex flex-row items-center grow gap-2"
            onSubmit={handleSubmitSearch}
          >
            <Search className="text-gray-400 size-5" />
            <Input
              className="bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder:text-gray-400"
              name="prompt"
              placeholder="Enter a location for date ideas..."
              type="text"
            />
            <Button
              disabled={isLoading}
              className=" hidden lg:inline"
              size="sm"
            >
              Search
            </Button>
          </form>

          <div className="flex gap-2 overflow-x-auto pb-4 md:py-0">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setFilterCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all ${
                  filterCategory === category.id
                    ? "bg-pink-500 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Date Ideas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dateIdeas.flatMap((idea) => {
            if (!idea) return [];
            if (filterCategory !== "all" && idea.category !== filterCategory)
              return [];
            return <DateCard key={idea.id} idea={idea as DateIdea} />;
          })}
          {isLoading && (
            <div className="fixed bg-black/60 backdrop-blur-xs z-50 inset-0 grid place-items-center">
              <div className="grid gap-6 justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-8 border-b-4 border-b-pink-100 border-pink-500 mx-auto" />
                <p className="text-2xl font-bold bg-gradient-to-r from-pink-200 via-pink-100 to-red-100 bg-clip-text text-transparent">
                  Loading date ideas...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
