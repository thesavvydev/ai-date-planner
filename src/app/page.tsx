"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DATE_CATEGORIES, DateIdea, dateIdeaSchema } from "@/schema/dateIdea";
import { experimental_useObject } from "@ai-sdk/react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Clock,
  MapPin,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import { useCallback, useState } from "react";

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
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [questionnaireData, setQuestionnaireData] = useState({
    location: "",
    vibes: [],
    dietary: "",
    budget: "",
    timeframe: "",
    duration: "",
    celebration: "",
    involvement: "",
    dislikes: "",
    activityLevel: "",
  });
  const [isAnimating, setIsAnimating] = useState(false);

  const {
    object: dateIdeas = [],
    error,
    submit,
    isLoading,
  } = experimental_useObject({
    api: "/api/chat",
    schema: z.array(dateIdeaSchema),
  });

  console.log({ dateIdeas, error, isLoading });

  const questions = [
    {
      id: "location",
      title: "Where are you located?",
      subtitle: "We'll find the perfect spots near you",
      type: "text",
      placeholder: "Enter your city or location...",
      icon: "📍",
    },
    {
      id: "vibes",
      title: "What's your ideal vibe?",
      subtitle: "Pick all that apply - we love variety!",
      type: "multiple",
      options: [
        { id: "romantic", label: "Romantic", icon: "💕" },
        { id: "adventurous", label: "Adventurous", icon: "🏔️" },
        { id: "chill", label: "Chill", icon: "😌" },
        { id: "luxe", label: "Luxe", icon: "✨" },
        { id: "nature", label: "Nature", icon: "🌿" },
        { id: "artsy", label: "Artsy", icon: "🎨" },
        { id: "goofy", label: "Goofy", icon: "🤪" },
      ],
    },
    {
      id: "dietary",
      title: "Any dietary preferences?",
      subtitle: "We'll make sure you have delicious options",
      type: "text",
      placeholder: "e.g., vegetarian, gluten-free, no restrictions...",
      icon: "🍽️",
    },
    {
      id: "budget",
      title: "What's your budget?",
      subtitle: "Great dates happen at every price point",
      type: "single",
      options: [
        { id: "free", label: "Free", icon: "💝", desc: "No cost activities" },
        { id: "low", label: "$", icon: "💰", desc: "Under $50 total" },
        { id: "medium", label: "$$", icon: "💰💰", desc: "Under $100 total" },
        { id: "high", label: "$$$", icon: "💳", desc: "Under $200 total" },
      ],
    },
    {
      id: "timeframe",
      title: "When are you planning this?",
      subtitle: "We'll suggest options based on timing",
      type: "single",
      options: [
        {
          id: "tonight",
          label: "Tonight",
          icon: "🌙",
          desc: "Last-minute magic",
        },
        {
          id: "weekend",
          label: "This Weekend",
          icon: "🗓️",
          desc: "Weekend vibes",
        },
        { id: "next-week", label: "Next Week", icon: "📅", desc: "Plan ahead" },
        {
          id: "future",
          label: "Plan Ahead",
          icon: "🔮",
          desc: "Future planning",
        },
      ],
    },
    {
      id: "duration",
      title: "How much time do you have?",
      subtitle: "We'll match activities to your schedule",
      type: "single",
      options: [
        { id: "quick", label: "Quick Hour", icon: "⏰", desc: "1-2 hours" },
        { id: "evening", label: "Evening Out", icon: "🌆", desc: "3-5 hours" },
        { id: "full-day", label: "Full Day", icon: "☀️", desc: "6+ hours" },
      ],
    },
    {
      id: "celebration",
      title: "Celebrating something special?",
      subtitle: "We'll add extra magic to your suggestions",
      type: "text",
      placeholder: "e.g., anniversary, birthday, or just because...",
      icon: "🎉",
    },
    {
      id: "involvement",
      title: "Planning preference?",
      subtitle: "How involved do you want to be?",
      type: "single",
      options: [
        {
          id: "surprise",
          label: "Surprise Me!",
          icon: "🎁",
          desc: "Full surprise planning",
        },
        {
          id: "collaborate",
          label: "Let's Plan Together",
          icon: "🤝",
          desc: "Collaborative planning",
        },
        {
          id: "control",
          label: "I Want Control",
          icon: "🎯",
          desc: "Detailed planning",
        },
      ],
    },
    {
      id: "dislikes",
      title: "What dates do you NOT enjoy?",
      subtitle: "We'll steer clear of these completely",
      type: "text",
      placeholder: "e.g., crowded places, loud music, heights...",
      icon: "🚫",
    },
    {
      id: "activityLevel",
      title: "How active do you want to be?",
      subtitle: "Match the energy to your mood",
      type: "single",
      options: [
        {
          id: "relaxed",
          label: "Relaxed",
          icon: "🧘‍♀️",
          desc: "Calm and peaceful",
        },
        { id: "medium", label: "Medium", icon: "🧗", desc: "Some movement" },
        {
          id: "energetic",
          label: "Energetic",
          icon: "🕺",
          desc: "High energy fun",
        },
      ],
    },
  ];

  // const handleQuestionnaireUpdate = (questionId, value) => {
  //   if (questionId === "vibes") {
  //     setQuestionnaireData((prev) => ({
  //       ...prev,
  //       vibes: prev.vibes.includes(value)
  //         ? prev.vibes.filter((v) => v !== value)
  //         : [...prev.vibes, value],
  //     }));
  //   } else {
  //     setQuestionnaireData((prev) => ({
  //       ...prev,
  //       [questionId]: value,
  //     }));
  //   }
  // };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const startQuestionnaire = () => {
    setShowQuestionnaire(true);
    setCurrentStep(0);
  };

  const finishQuestionnaire = () => {
    setShowQuestionnaire(false);
    setCurrentStep(0);
    // Here you would typically process the data and show results
    console.log("Questionnaire completed:", questionnaireData);
  };

  const handleSubmitSearch = useCallback((e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const prompt = formData.get("prompt") as string;
    submit({ prompt });
  }, []);

  return (
    <>
      {/* Questionnaire Modal */}
      {showQuestionnaire && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Progress Bar */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-800">
                  Find Your Perfect Date
                </h1>
                <button
                  onClick={() => setShowQuestionnaire(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-pink-500 to-red-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentStep + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Step {currentStep + 1} of {questions.length}
              </div>
            </div>

            {/* Question Content */}
            <div className="p-8">
              {/* <QuestionnaireStep
                question={questions[currentStep]}
                value={questionnaireData[questions[currentStep].id]}
                onChange={handleQuestionnaireUpdate}
              /> */}
            </div>

            {/* Navigation */}
            <div className="p-6 border-t border-gray-200 flex justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  currentStep === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              <button
                onClick={
                  currentStep === questions.length - 1
                    ? finishQuestionnaire
                    : nextStep
                }
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl font-medium hover:from-pink-600 hover:to-red-600 transition-all"
              >
                {currentStep === questions.length - 1 ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Get My Suggestions
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pb-8 py-4">
        <div className="space-y-6">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-pink-500 to-red-500 rounded-3xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Find Your Perfect Date</h2>
            <p className="text-xl mb-6 opacity-90">
              Answer a few questions and get personalized date suggestions
            </p>
            <button
              onClick={startQuestionnaire}
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
    </>
  );
}
