"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { QUESTIONS } from "@/lib/questions";
import { ArrowLeft, ArrowRight, Beef, Bone, CarrotIcon, CheckCircle, Droplet, Fish, Flower2, Leaf, MilkOff, Nut, Salad, Scale, Sparkles, Wheat } from "lucide-react";
import { createContext, useCallback, useContext, useState } from "react";



function QuestionText() {
  const { currentStep, questionnaireData, handleQuestionnaireUpdate } = useQuestionnaire();
  const question = QUESTIONS[currentStep];
  const value = questionnaireData[question.id] || "";
  const onChange = (val: string) => handleQuestionnaireUpdate(question.id, val);
  return (
    <div className="space-y-4">
      <label className="block text-lg font-semibold flex items-center gap-2">
        <span className="text-2xl">{question.icon}</span>
        {question.title}
      </label>
      <div className="text-gray-500 mb-2">{question.subtitle}</div>
      <Input
        autoFocus
        placeholder={question.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
      />
    </div>
  );
}

function QuestionMultiple() {
  const { currentStep, questionnaireData, handleQuestionnaireUpdate } = useQuestionnaire();
  const question = QUESTIONS[currentStep];
  const value = questionnaireData[question.id] || [];
  const onChange = (val: any) => handleQuestionnaireUpdate(question.id, val);
  return (
    <div className="space-y-4">
      <label className="block text-lg font-semibold flex items-center gap-2">
        <span className="text-2xl">{question.icon}</span>
        {question.title}
      </label>
      <div className="text-gray-500 mb-2">{question.subtitle}</div>
      <div className="flex flex-wrap gap-3">
        {question.options?.map((opt) => (
          <Button
            autoFocus
            key={opt.id}
            type="button"
            variant={value.includes(opt.id) ? "default" : "outline"}
            className={cn(
              "flex gap-2 rounded-xl min-w-[100px] border",
              value.includes(opt.id) ? "border-pink-500 bg-pink-50 text-pink-700 hover:bg-pink-100" : ""
            )}
            onClick={() => {
              if (value.includes(opt.id)) {
                onChange(value.filter((v: any) => v !== opt.id));
              } else {
                onChange([...value, opt.id]);
              }
            }}
          >
            <span className="text-xl">{opt.icon}</span>
            <span className="font-medium">{opt.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

function QuestionSingle() {
  const { currentStep, questionnaireData, handleQuestionnaireUpdate } = useQuestionnaire();
  const question = QUESTIONS[currentStep];
  const value = questionnaireData[question.id] || "";
  const onChange = (val: string) => handleQuestionnaireUpdate(question.id, val);

  return (
    <div className="space-y-4">
      <label className="block text-lg font-semibold flex items-center gap-2">
        <span className="text-2xl">{question.icon}</span>
        {question.title}
      </label>
      <div className="text-gray-500 mb-2">{question.subtitle}</div>
      <RadioGroup
        className="flex items-center gap-2"
        value={value}
        onValueChange={onChange}
      >
        {question.options?.map((opt) => (
          <div className={cn(value === opt.id ? "border-pink-500 bg-pink-50 text-pink-700 hover:bg-pink-100" : "border-gray-200", "flex items-center gap-2 px-4 py-2 border-2 rounded-full shrink-0 focus:border-pink-300 focus:bg-pink-50")} key={opt.id}>
            <RadioGroupItem
              autoFocus
              className="hidden"
              id={opt.id}
              value={opt.id}
            />
            <Label className="flex items-center gap-2 peer-checked:text-white" htmlFor={opt.id}>
              <div className="text-xl">{opt.icon}</div>
              <div>
                <div className="font-medium">{opt.label}</div>
                {"desc" in opt && opt.desc && (
                  <div className="text-xs text-gray-500">{opt.desc}</div>
                )}
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

function ReviewStep() {
  const { questionnaireData, jumpToQuestion } = useQuestionnaire();

  const formatAnswer = (questionId: string, value: any) => {
    const question = QUESTIONS.find(q => q.id === questionId);
    if (!question) return value;

    if (question.type === "multiple" && Array.isArray(value)) {
      if (value.length === 0) return "None selected";
      return value.map((v: string) => {
        const option = question.options?.find((opt: any) => opt.id === v);
        return option?.label || v;
      }).join(", ");
    }

    if (question.type === "single") {
      const option = question.options?.find((opt: any) => opt.id === value);
      return option?.label || value;
    }

    return value || "Not answered";
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Review Your Answers</h2>
        <p className="text-gray-600">Please review your answers before we generate your perfect date suggestions.</p>
      </div>

      <div className="space-y-4">
        {QUESTIONS.map((question, index) => (
          <div key={question.id} className="border border-gray-200 rounded-lg p-4 hover:border-pink-300 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{question.icon}</span>
                  <h3 className="font-semibold text-gray-800">{question.title}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-2">{question.subtitle}</p>
                <p className="text-gray-800 font-medium">
                  {formatAnswer(question.id, questionnaireData[question.id])}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => jumpToQuestion(index)}
                className="ml-4 shrink-0"
              >
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuestionComponent() {
  const { currentStep, isReviewMode } = useQuestionnaire();

  if (isReviewMode) {
    return <ReviewStep />;
  }

  const question = QUESTIONS[currentStep];

  switch (question?.type) {
    case "text":
      return (
        <QuestionText />
      );
    case "multiple":
      return (
        <QuestionMultiple />
      );
    case "single":
      return (
        <QuestionSingle />
      );
    default:
      return null;
  }
}


const QuestionnaireContext = createContext<{
  currentStep: number;
  setCurrentStep: (step: number) => void;
  questionnaireData: any;
  setQuestionnaireData: (data: any) => void;
  isAnimating: boolean;
  setIsAnimating: (isAnimating: boolean) => void;
  handleQuestionnaireUpdate: (questionId: string, value: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  questions: any[];
  finishQuestionnaire: () => void;
  showQuestionnaire: boolean;
  setShowQuestionnaire: (show: boolean) => void;
  onFinish: (data: any) => void;
  close: () => void;
  isReviewMode: boolean;
  setIsReviewMode: (isReview: boolean) => void;
  jumpToQuestion: (step: number) => void;
} | undefined>(undefined);

function QuestionnaireProvider({ children, onFinish, close }: { children: React.ReactNode, onFinish: (data: any) => void, close: () => void }) {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [questionnaireData, setQuestionnaireData] = useState({
    location: "",
    vibes: [],
    dietary: [],
    budget: "",
    timeframe: "",
    duration: "",
    celebration: "",
    involvement: "",
    dislikes: "",
    activityLevel: "",
  });
  const [isAnimating, setIsAnimating] = useState(false);


  const handleQuestionnaireUpdate = useCallback((questionId: string, value: any) => {
    setQuestionnaireData((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < QUESTIONS.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      // Show review step when reaching the last question
      setIsReviewMode(true);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  }, [currentStep]);

  const finishQuestionnaire = useCallback(() => {
    // Handle questionnaire completion
    console.log('Questionnaire completed:', questionnaireData);
    setShowQuestionnaire(false);
    onFinish(questionnaireData);
    close();
  }, [questionnaireData, onFinish, close]);

  const jumpToQuestion = useCallback((step: number) => {
    setIsReviewMode(false);
    setCurrentStep(step);
  }, []);

  const value = {
    currentStep,
    setCurrentStep,
    questionnaireData,
    setQuestionnaireData,
    isAnimating,
    setIsAnimating,
    handleQuestionnaireUpdate,
    nextStep,
    prevStep,
    questions: QUESTIONS,
    finishQuestionnaire,
    showQuestionnaire,
    setShowQuestionnaire,
    onFinish,
    close,
    isReviewMode,
    setIsReviewMode,
    jumpToQuestion,
  };

  return (
    <QuestionnaireContext.Provider value={value}>
      {children}
    </QuestionnaireContext.Provider>
  );
}

function useQuestionnaire() {
  const context = useContext(QuestionnaireContext);
  if (!context) {
    throw new Error("useQuestionnaire must be used within a QuestionnaireProvider");
  }
  return context;
}

function ProgressBar() {
  const { currentStep, close, isReviewMode } = useQuestionnaire();
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          {isReviewMode ? "Review Your Answers" : "Find Your Perfect Date"}
        </h1>
        <button
          onClick={close}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-pink-500 to-red-500 h-2 rounded-full transition-all duration-500"
          style={{
            width: isReviewMode ? "100%" : `${((currentStep + 1) / QUESTIONS.length) * 100}%`,
          }}
        />
      </div>
      <div className="text-sm text-gray-600 mt-2">
        {isReviewMode ? "Review Step" : `Step ${currentStep + 1} of ${QUESTIONS.length}`}
      </div>
    </div>
  );
}

function QuestionnaireNavigation() {
  const { currentStep, prevStep, nextStep, finishQuestionnaire, isReviewMode, setIsReviewMode } = useQuestionnaire();

  if (isReviewMode) {
    return (
      <div className="p-6 border-t border-gray-200 flex justify-between">
        <button
          onClick={() => setIsReviewMode(false)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Questions
        </button>

        <button
          onClick={finishQuestionnaire}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl font-medium hover:from-pink-600 hover:to-red-600 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Get My Suggestions
        </button>
      </div>
    );
  }

  return <div className="p-6 border-t border-gray-200 flex justify-between">
    <button
      onClick={prevStep}
      disabled={currentStep === 0}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${currentStep === 0
        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
    >
      <ArrowLeft className="w-4 h-4" />
      Previous
    </button>

    <button
      onClick={nextStep}
      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl font-medium hover:from-pink-600 hover:to-red-600 transition-all"
    >
      {currentStep === QUESTIONS.length - 1 ? (
        <>
          Review Answers
          <ArrowRight className="w-4 h-4" />
        </>
      ) : (
        <>
          Next
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  </div>
}

export function Questionnaire({ onFinish, close }: { onFinish: (data: any) => void, close: () => void }) {

  return <QuestionnaireProvider onFinish={onFinish} close={close}>
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 h-screen">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <ProgressBar />
        <div className="p-8">
          <QuestionComponent />
        </div>
        <QuestionnaireNavigation />
      </div>
    </div>
  </QuestionnaireProvider>
}
