"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { DATE_CATEGORIES, DateIdea, dateIdeaSchema } from "@/schema/dateIdea";
import { experimental_useObject } from "@ai-sdk/react";
import { QUESTIONS_DICTIONARY } from "@/lib/questions";
import { cn } from "@/lib/utils";
import { Star, MapPin, Clock, Share2, ChevronLeft, ChevronRight, X, Bookmark } from "lucide-react";
import z from "zod";
import React from "react"; // Added missing import
import { clsx } from "clsx"; // Added missing import

const STEPS = [
  QUESTIONS_DICTIONARY.location,
  QUESTIONS_DICTIONARY.vibes,
  ...Object.values(QUESTIONS_DICTIONARY).filter(q => q.id !== "location" && q.id !== "vibes"),
];

// Progress bar for multi-step filter, clickable steps, require location for later steps
function ProgressBar({ current, total, onStepClick, canGoToStep }: {
  current: number;
  total: number;
  onStepClick: (idx: number) => void;
  canGoToStep: (idx: number) => boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6" aria-label="Progress" role="list">
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === current;
        const isClickable = canGoToStep(i);
        return (
          <button
            key={i}
            type="button"
            className={clsx(
              'h-2 rounded-full transition-all duration-200 focus:outline-none',
              isActive ? 'w-8 bg-pink-500' : 'w-4 bg-pink-200',
              isClickable ? 'cursor-pointer focus-visible:ring-2 focus-visible:ring-pink-500' : 'cursor-not-allowed opacity-60'
            )}
            aria-current={isActive ? 'step' : undefined}
            aria-label={`Go to step ${i + 1}`}
            onClick={() => isClickable && onStepClick(i)}
            disabled={!isClickable}
            tabIndex={isClickable ? 0 : -1}
            role="listitem"
          />
        );
      })}
    </div>
  );
}

function CarouselProgress({ current, total }: { current: number; total: number }) {
  return (
    <nav className="flex justify-center gap-2 mb-4" aria-label="Date idea progress">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "inline-block w-3 h-3 rounded-full transition-all border-2",
            i === current ? "bg-pink-600 border-pink-600" : "bg-gray-300 border-gray-400"
          )}
          aria-current={i === current ? "step" : undefined}
        />
      ))}
    </nav>
  );
}

function OptionCard({ selected, icon, label, onClick }: { selected: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 text-base font-semibold shadow transition-all min-w-[96px] min-h-[96px] focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500",
        selected
          ? "bg-gradient-to-br from-pink-600 to-red-500 text-white border-pink-600 scale-105 shadow-lg"
          : "bg-white/90 border-pink-200 text-pink-700 hover:bg-pink-50 hover:border-pink-400"
      )}
      onClick={onClick}
      aria-pressed={selected}
      tabIndex={0}
      aria-label={label}
    >
      <span className="text-2xl" aria-hidden="true">{icon}</span>
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

function InfluencerDateStory({ idea, onPlan, onShare, onSave, onPrev, onNext, showPrev, showNext }: {
  idea: DateIdea,
  onPlan: () => void,
  onShare: () => void,
  onSave: () => void,
  onPrev: () => void,
  onNext: () => void,
  showPrev: boolean,
  showNext: boolean,
}) {
  return (
    <section className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-200/60 overflow-hidden flex flex-col items-center justify-center min-h-[340px] max-w-md w-full mx-auto p-4 sm:p-8" aria-label={`Date idea: ${idea.title}`}> 
      <div className="flex flex-col gap-3 items-center w-full">
        <span className="text-5xl mb-1" aria-hidden="true">{DATE_CATEGORIES[idea.category]?.icon}</span>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-1 text-center break-words">{idea.title}</h2>
        <div className="flex items-center gap-2 mb-1">
          <Star className="w-5 h-5 text-yellow-500 fill-current" aria-hidden="true" />
          <span className="font-bold text-base">{idea.rating}</span>
          <Badge className="bg-pink-100 text-pink-700 ml-2" variant="outline">{idea.category}</Badge>
        </div>
        <p className="text-gray-700 text-base mb-1 text-center line-clamp-4 break-words">{idea.description}</p>
        <div className="flex flex-wrap gap-3 text-sm text-gray-600 justify-center mb-2">
          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" aria-hidden="true" />{idea.location}</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" aria-hidden="true" />{idea.duration}</span>
        </div>
        <div className="flex gap-2 w-full justify-center mt-2 flex-wrap">
          <Button className="bg-gradient-to-r from-pink-600 to-red-500 text-white font-bold px-4 py-3 rounded-full text-base hover:from-pink-700 hover:to-red-600 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500" onClick={onPlan} aria-label="Plan this date">
            Plan Date
          </Button>
          <Button variant="outline" className="rounded-full px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500" onClick={onShare} aria-label="Share this date idea">
            <Share2 className="w-5 h-5 mr-1" aria-hidden="true" /> <span className="sr-only">Share</span>
          </Button>
          <Button variant="outline" className="rounded-full px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500" onClick={onSave} aria-label="Save this date idea">
            <Bookmark className="w-5 h-5 mr-1" aria-hidden="true" /> <span className="sr-only">Save</span>
          </Button>
        </div>
      </div>
      {/* Footer navigation for mobile accessibility */}
      <div className="flex w-full justify-between items-center mt-6 gap-4">
        <Button
          variant="ghost"
          className="rounded-full p-2 bg-white/80 hover:bg-pink-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
          onClick={onPrev}
          disabled={!showPrev}
          aria-label="Previous date idea"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          className="rounded-full p-2 bg-white/80 hover:bg-pink-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
          onClick={onNext}
          disabled={!showNext}
          aria-label="Next date idea"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </section>
  );
}

// Location Autocomplete Hook
function useLocationAutocomplete({ value, onSelect }: { value: string; onSelect: (val: string) => void }) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!value || value.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    setShowDropdown(true);
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `/api/location-autocomplete?q=${encodeURIComponent(value)}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Failed to fetch suggestions");
        const data = await res.json();
        setSuggestions(data);
      } catch (e) {
        if ((e as any).name !== "AbortError") setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };
    const debounce = setTimeout(fetchSuggestions, 250);
    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [value]);

  const handleSelect = (idx: number) => {
    if (suggestions[idx]) {
      onSelect(suggestions[idx].display_name);
      setShowDropdown(false);
    }
  };

  return {
    suggestions,
    loading,
    showDropdown,
    setShowDropdown,
    highlightedIdx,
    setHighlightedIdx,
    handleSelect,
  };
}

export default function InfluencerPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({ location: "", vibes: [] });
  const [showResults, setShowResults] = useState(false);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [shareIdea, setShareIdea] = useState<DateIdea | null>(null);

  const {
    object: dateIdeas = [],
    submit,
    isLoading,
  } = experimental_useObject({
    api: "/api/advanced-date-suggestions",
    schema: z.array(dateIdeaSchema),
    onError: (error) => {
      console.error(error);
    }
  });

  function handleNext() {
    // Require location step to be filled before advancing past it
    const locationStepIdx = STEPS.findIndex(s => s.id === 'location');
    if (step === locationStepIdx && (!answers.location || answers.location.trim() === '')) {
      // Optionally, show error or shake input
      // setShowLocationError(true); // This state was removed, so this line is removed
      return;
    }
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      submit({ questionData: answers });
      setShowResults(true);
      setCarouselIdx(0);
    }
  }
  function handleBack() {
    if (step > 0) setStep(step - 1);
  }
  function handleAnswer(id: string, value: any) {
    setAnswers((prev: any) => ({ ...prev, [id]: value }));
  }
  function handleMultiAnswer(id: string, option: string) {
    setAnswers((prev: any) => {
      const arr = prev[id] || [];
      if (arr.includes(option)) {
        return { ...prev, [id]: arr.filter((o: string) => o !== option) };
      } else {
        return { ...prev, [id]: [...arr, option] };
      }
    });
  }
  function handlePlan(idea: DateIdea) {
    // For demo: just copy to clipboard
    navigator.clipboard.writeText(`${idea.title} - ${idea.description}`);
    alert("Date planned! (Demo)");
  }
  function handleShare(idea: DateIdea) {
    setShareIdea(idea);
    navigator.clipboard.writeText(`${idea.title} - ${idea.description}`);
  }
  function handleSave(idea: DateIdea) {
    alert("Saved! (Demo)");
  }
  function closeShare() {
    setShareIdea(null);
  }

  const q = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const ideas = (dateIdeas.filter(Boolean) as DateIdea[]);
  const currentIdea = ideas[carouselIdx];

  // Progress bar and stepper
  const totalSteps = STEPS.length;
  const isLastStep = step === totalSteps - 1;

  // Only allow going to a step if all required steps before it are filled
  function canGoToStep(idx: number) {
    // If the step is before or equal to current, always allow
    if (idx <= step) return true;
    // If the location step is required and not filled, block later steps
    const locationStepIdx = STEPS.findIndex(s => s.id === 'location');
    if (locationStepIdx !== -1 && answers.location?.trim() === '') {
      // Only allow going to location step or before
      return idx <= locationStepIdx;
    }
    // Otherwise, allow
    return true;
  }

  // --- Location autocomplete hooks (always called in same order) ---
  const isLocationStep = q.type === "text" && q.id === "location";
  const inputValue = answers[q.id] || "";
  const inputRef = useRef<HTMLInputElement>(null);
  const locationAutocomplete = useLocationAutocomplete({
    value: isLocationStep ? inputValue : "",
    onSelect: (val) => {
      if (isLocationStep) {
        handleAnswer(q.id, val);
        handleNext();
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-50 to-white flex flex-col">
      <main className="flex-1 w-full max-w-2xl mx-auto px-2 sm:px-6 py-8 flex flex-col items-center">
        <ProgressBar
          current={step}
          total={totalSteps}
          onStepClick={setStep}
          canGoToStep={canGoToStep}
        />
        {!showResults ? (
          <form className="w-full max-w-lg bg-white/80 rounded-2xl shadow-xl border border-pink-200/60 p-8 flex flex-col items-center gap-8">
            <div className="w-full text-center">
              <h2 className="text-2xl font-extrabold text-pink-600 mb-2">{q.title}</h2>
              <p className="text-gray-500 mb-6">{q.subtitle}</p>
            </div>
            {isLocationStep ? (
              <div className="relative w-full">
                <Input
                  ref={inputRef}
                  className="w-full rounded-xl border-2 border-pink-200 bg-white text-base placeholder:text-pink-300"
                  placeholder={(q as any)?.placeholder}
                  value={inputValue}
                  onChange={e => {
                    handleAnswer(q.id, e.target.value);
                    locationAutocomplete.setShowDropdown(true);
                  }}
                  required={(q as any)?.required}
                  autoComplete="off"
                  aria-autocomplete="list"
                  aria-controls="location-autocomplete-list"
                  aria-expanded={locationAutocomplete.showDropdown}
                  aria-activedescendant={locationAutocomplete.highlightedIdx >= 0 ? `location-suggestion-${locationAutocomplete.highlightedIdx}` : undefined}
                  onBlur={() => setTimeout(() => locationAutocomplete.setShowDropdown(false), 100)}
                  onFocus={() => inputValue.length >= 2 && locationAutocomplete.setShowDropdown(true)}
                  onKeyDown={e => {
                    if (!locationAutocomplete.showDropdown) return;
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      locationAutocomplete.setHighlightedIdx(i => Math.min(i + 1, locationAutocomplete.suggestions.length - 1));
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      locationAutocomplete.setHighlightedIdx(i => Math.max(i - 1, 0));
                    } else if (e.key === "Enter" && locationAutocomplete.highlightedIdx >= 0) {
                      e.preventDefault();
                      locationAutocomplete.handleSelect(locationAutocomplete.highlightedIdx);
                    }
                  }}
                />
                {locationAutocomplete.showDropdown && locationAutocomplete.suggestions.length > 0 && (
                  <ul
                    id="location-autocomplete-list"
                    className="absolute z-20 left-0 right-0 bg-white border border-pink-200 rounded-xl mt-1 shadow-lg max-h-60 overflow-auto"
                    role="listbox"
                  >
                    {locationAutocomplete.suggestions.map((s, idx) => (
                      <li
                        key={s.place_id || s.osm_id || idx}
                        id={`location-suggestion-${idx}`}
                        role="option"
                        aria-selected={locationAutocomplete.highlightedIdx === idx}
                        className={clsx(
                          "px-4 py-2 cursor-pointer hover:bg-pink-50",
                          locationAutocomplete.highlightedIdx === idx && "bg-pink-100 text-pink-700"
                        )}
                        onMouseDown={e => {
                          e.preventDefault();
                          locationAutocomplete.handleSelect(idx);
                        }}
                        onMouseEnter={() => locationAutocomplete.setHighlightedIdx(idx)}
                      >
                        {s.display_name}
                      </li>
                    ))}
                  </ul>
                )}
                {locationAutocomplete.loading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="animate-spin inline-block w-5 h-5 border-2 border-pink-300 border-t-pink-600 rounded-full" aria-label="Loading suggestions" />
                  </div>
                )}
              </div>
            ) : q.type === "text" ? (
              <Input
                className="w-full rounded-xl border-2 border-pink-200 bg-white text-base placeholder:text-pink-300"
                placeholder={(q as any)?.placeholder}
                value={answers[q.id] || ""}
                onChange={e => handleAnswer(q.id, e.target.value)}
                required={(q as any)?.required}
              />
            ) : null}
            {q.type === "single" && (
              <div className="flex flex-wrap gap-4 justify-center">
                {(q as any).options?.map((opt: any) => (
                  <OptionCard
                    key={opt.id}
                    selected={answers[q.id] === opt.id}
                    icon={opt.icon}
                    label={opt.label}
                    onClick={() => handleAnswer(q.id, opt.id)}
                  />
                ))}
              </div>
            )}
            {q.type === "multiple" && (
              <div className="flex flex-wrap gap-4 justify-center">
                {(q as any).options?.map((opt: any) => (
                  <OptionCard
                    key={opt.id}
                    selected={answers[q.id]?.includes(opt.id)}
                    icon={opt.icon}
                    label={opt.label}
                    onClick={() => handleMultiAnswer(q.id, opt.id)}
                  />
                ))}
              </div>
            )}
            <div className="flex w-full justify-between mt-8">
              <Button type="button" variant="outline" onClick={handleBack} disabled={step === 0} className="rounded-full px-6 py-2">
                <ChevronLeft className="w-5 h-5 mr-1" /> Back
              </Button>
              {(() => {
                const stepKey = q.id;
                const isRequired = (q as any)?.required;
                let hasValue = false;
                if (q.type === 'text') {
                  hasValue = Boolean(answers[stepKey] && String(answers[stepKey]).trim() !== '');
                } else if (q.type === 'single') {
                  hasValue = Boolean(answers[stepKey]);
                } else if (q.type === 'multiple') {
                  hasValue = Array.isArray(answers[stepKey]) && answers[stepKey].length > 0;
                }
                // Always show primary button for last step (Plan Date)
                if (isLast) {
                  return (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="rounded-full px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold text-lg shadow-lg hover:from-pink-600 hover:to-red-600 transition-all"
                      disabled={isRequired && !hasValue}
                    >
                      Plan Date <ChevronRight className="w-5 h-5 ml-1" />
                    </Button>
                  );
                }
                // If required and not filled, show disabled primary Next
                if (isRequired && !hasValue) {
                  return (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="rounded-full px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold text-lg shadow-lg hover:from-pink-600 hover:to-red-600 transition-all"
                      disabled
                    >
                      Next <ChevronRight className="w-5 h-5 ml-1" />
                    </Button>
                  );
                }
                // If not required and not filled, show Skip (secondary)
                if (!isRequired && !hasValue) {
                  return (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleNext}
                      className="rounded-full px-8 py-3"
                    >
                      Skip <ChevronRight className="w-5 h-5 ml-1" />
                    </Button>
                  );
                }
                // Otherwise, show primary Next
                return (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="rounded-full px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold text-lg shadow-lg hover:from-pink-600 hover:to-red-600 transition-all"
                  >
                    Next <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                );
              })()}
            </div>
          </form>
        ) : (
          <div className="w-full">
            <h2 className="text-2xl font-extrabold text-pink-600 mb-6 text-center">Your Date Ideas</h2>
            {ideas.length > 0 && (
              <>
                <CarouselProgress current={carouselIdx} total={ideas.length} />
                <div className="flex items-center justify-center w-full">
                  {currentIdea && (
                    <InfluencerDateStory
                      idea={currentIdea}
                      onPlan={() => handlePlan(currentIdea)}
                      onShare={() => handleShare(currentIdea)}
                      onSave={() => handleSave(currentIdea)}
                      onPrev={() => setCarouselIdx(i => Math.max(0, i - 1))}
                      onNext={() => setCarouselIdx(i => Math.min(ideas.length - 1, i + 1))}
                      showPrev={carouselIdx > 0}
                      showNext={carouselIdx < ideas.length - 1}
                    />
                  )}
                </div>
              </>
            )}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-8 border-b-4 border-b-pink-100 border-pink-500 mx-auto" aria-label="Loading spinner" />
                <p className="text-2xl font-bold bg-gradient-to-r from-pink-200 via-pink-100 to-red-100 bg-clip-text text-transparent mt-4">
                  Planning your perfect date...
                </p>
              </div>
            )}
            <div className="flex justify-center mt-8">
              <Button variant="outline" className="rounded-full px-8 py-3" onClick={() => setShowResults(false)} disabled={isLoading}>
                <ChevronLeft className="w-5 h-5 mr-1" /> Start Over
              </Button>
            </div>
          </div>
        )}
        {/* Share Modal */}
        {shareIdea && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-pink-500" onClick={closeShare} aria-label="Close">
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-xl font-bold mb-4 text-pink-600">Share This Date Idea</h3>
              <p className="mb-4 text-gray-700">Link copied! Share your date idea on your favorite platform.</p>
              <Button className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold py-3 rounded-xl text-lg hover:from-pink-600 hover:to-red-600 transition-all" onClick={closeShare}>
                Close
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 