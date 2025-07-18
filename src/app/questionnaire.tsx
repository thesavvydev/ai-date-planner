"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const questionsData = [
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

export const Questionnaire = ({ onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [direction, setDirection] = useState<number>(0);

  const handleAnswer = (answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionsData[currentQuestion].id]: answer,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questionsData.length - 1) {
      setDirection(1);
      setCurrentQuestion((prev) => prev + 1);
    } else {
      onComplete(answers);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setDirection(-1);
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const question = questionsData[currentQuestion];
  const progress = ((currentQuestion + 1) / questionsData.length) * 100;

  const slideVariants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
  };

  return (
    <div>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="text-white/80 hover:text-white"
              >
                ← Back
              </button>
              <div className="text-2xl">💕</div>
              <h1 className="text-xl font-bold text-white">AI Date Planner</h1>
            </div>
            <div className="text-white/80">
              {currentQuestion + 1} of {questionsData.length}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white/20 rounded-full h-2 mb-8">
          <motion.div
            className="bg-white rounded-full h-2"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQuestion}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20"
          >
            <div className="text-center mb-8">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-gray-900 mb-4"
              >
                {question.title}
              </motion.h2>
            </div>

            {question.type === "multiple-choice" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {question.options.map((option, index) => (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(option.id)}
                    className={`p-6 rounded-2xl border-2 transition-all text-left ${
                      answers[question.id] === option.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300 hover:bg-purple-25"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{option.emoji}</div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {option.text}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {question.type === "range" && (
              <div className="mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center mb-6"
                >
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {question.unit === "$" ? "$" : ""}
                    {answers[question.id] || question.min}
                    {question.unit !== "$" ? question.unit : ""}
                  </div>
                </motion.div>
                <input
                  type="range"
                  min={question.min}
                  max={question.max}
                  step={question.step}
                  value={answers[question.id] || question.min}
                  onChange={(e) => handleAnswer(parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>
                    {question.unit === "$" ? "$" : ""}
                    {question.min}
                    {question.unit !== "$" ? question.unit : ""}
                  </span>
                  <span>
                    {question.unit === "$" ? "$" : ""}
                    {question.max}
                    {question.unit !== "$" ? question.unit : ""}
                  </span>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  currentQuestion === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Previous
              </button>

              <button
                onClick={nextQuestion}
                disabled={!answers[question.id]}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  !answers[question.id]
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {currentQuestion === questionsData.length - 1
                  ? "Generate My Date!"
                  : "Next"}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
