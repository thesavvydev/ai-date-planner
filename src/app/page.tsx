"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { QUESTIONS_DICTIONARY } from "@/lib/questions";
import { cn } from "@/lib/utils";
import { DATE_CATEGORIES, DateIdea, dateIdeaSchema } from "@/schema/dateIdea";
import { experimental_useObject } from "@ai-sdk/react";
import { ChevronDown, Clock, MapPin, Star, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import z from "zod";

// --- useLocalStorage hook ---
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  };



  return [storedValue, setValue];
}
// --- end useLocalStorage hook ---

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
        <Link href={`/date-idea/${idea.id}`}>
          <button className="w-full mt-4 bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-xl font-medium hover:from-pink-600 hover:to-red-600 transition-all">
            Plan This Date
          </button>
        </Link>
      </div>
    </div>
  );
}

function SelectedFiltersRow({ formState, onRemove, onClearAll }: { formState: any, onRemove: (id: string, value?: string) => void, onClearAll?: () => void }) {
  const { location:_location, vibes:_vibes, ...otherFilters } = formState || {};
  const filterQs = Object.values(otherFilters)
  type Selected = { id: string; label: string; value: string | string[]; q: any };
  const selected: Selected[] = [];
  for (const q of filterQs) {
    const val = formState?.[q.id];
    if (q.type === "text" && val && val.trim() !== "") {
      selected.push({ id: q.id, label: q.title, value: val, q });
    } else if (q.type === "single" && val) {
      const opt = (q as any).options?.find((o: any) => o.id === val);
      if (opt) selected.push({ id: q.id, label: q.title, value: opt.label, q });
    } else if (q.type === "multiple" && Array.isArray(val) && val.length > 0) {
      const opts = (q as any).options?.filter((o: any) => val.includes(o.id));
      if (opts && opts.length > 0) selected.push({ id: q.id, label: q.title, value: opts.map((o: any) => o.label), q });
    }
  }
  if (selected.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-gray-200 relative" aria-label="Selected filters" role="region">
      {selected.map(sel => (
        <span
          key={sel.id}
          className={cn(
            "inline-flex items-center gap-1 bg-pink-100 text-pink-700 rounded-full px-4 py-2 text-sm font-semibold border border-pink-200 hover:border-pink-400 transition-all cursor-pointer focus-within:ring-2 focus-within:ring-pink-400",
            "outline-none"
          )}
          tabIndex={0}
          aria-label={`Selected filter: ${sel.label}`}
        >
          <span className="font-bold mr-1">{sel.label}:</span>
          {Array.isArray(sel.value)
            ? sel.value.map((v, i) => (
                <span key={v} className="ml-1 flex items-center">
                  {v}
                  <button
                    type="button"
                    className="ml-1 text-pink-400 hover:text-pink-700 rounded-full bg-white p-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-pink-400"
                    aria-label={`Remove ${v} from ${sel.label}`}
                    onClick={() => onRemove(sel.id, (sel.q as any).options?.find((o: any) => o.label === v)?.id)}
                  >
                    <X className="inline w-4 h-4" aria-hidden="true" />
                  </button>
                  {i < sel.value.length - 1 ? <span className="mx-1 text-pink-300">|</span> : null}
                </span>
              ))
            : <span className="ml-1 flex items-center">{sel.value}<button type="button" className="ml-1 text-pink-400 hover:text-pink-700 rounded-full bg-white p-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-pink-400" aria-label={`Remove ${sel.label}`} onClick={() => onRemove(sel.id)}><X className="inline w-4 h-4" aria-hidden="true" /></button></span>}
        </span>
      ))}
      {onClearAll && (
        <button
          type="button"
          className="ml-2 flex items-center gap-1 text-gray-600 hover:text-pink-600 rounded-full px-2 py-1 transition-all border border-transparent hover:border-pink-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-400"
          aria-label="Clear all filters"
          onClick={onClearAll}
        >
          <X className="w-4 h-4" aria-hidden="true" />
          <span>Clear all</span>
        </button>
      )}
    </div>
  );
}

function FilterRow({ formState, setFormState, openModal, onApply, isLoading }: { formState: any, setFormState: (f: any) => void, openModal: () => void, onApply: () => void, isLoading: boolean }) {
  const locationQ = QUESTIONS_DICTIONARY.location;
  const vibeQ = QUESTIONS_DICTIONARY.vibes;
  return (
    <form
      className="w-full mb-0"
      onSubmit={e => {
        e.preventDefault();
        onApply();
      }}
    >
      <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-4 bg-transparent rounded-2xl border-0 px-0 py-0">
        {/* Location input */}
        <div className="flex-1 flex flex-col justify-end">
          <Label htmlFor="location-input" className="mb-1 text-pink-700 text-xs font-semibold tracking-wide">{(locationQ as any)?.icon ?? ""} {locationQ?.title}</Label>
          <Input
            id="location-input"
            placeholder={(locationQ as any)?.placeholder ?? ""}
            value={formState.location || ""}
            onChange={e => setFormState((prev: any) => ({ ...prev, location: e.target.value ?? "" }))}
            className="w-full rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 bg-white text-base shadow-none placeholder:text-pink-300 focus:outline-none"
            required={(locationQ as any)?.required ?? false}
          />
        </div>
        {/* Vibe dropdown */}
        <div className="flex-1 flex flex-col justify-end">
          <Label className="mb-1 text-pink-700 text-xs font-semibold tracking-wide">{(vibeQ as any)?.icon ?? ""} Vibe</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" className="w-full flex justify-between items-center rounded-xl border-2 border-pink-200 bg-white hover:bg-pink-50 text-base font-medium transition-all shadow-none focus:outline-none focus:ring-2 focus:ring-pink-400">
                <span className="truncate">
                  {formState.vibes?.length
                    ? (vibeQ as any)?.options?.filter((o: any) => formState.vibes?.includes(o.id)).map((o: any) => o.label).join(", ")
                    : <span className="text-pink-300">{vibeQ?.title}</span>}
                </span>
                <ChevronDown className="ml-2 w-4 h-4 text-pink-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-64 rounded-2xl border-pink-200 bg-white shadow-xl">
              <div className="font-semibold mb-2 text-pink-700">{vibeQ?.title}</div>
              <div className="text-xs text-gray-500 mb-2">{vibeQ?.subtitle}</div>
              <div className="flex flex-col gap-2">
                {(vibeQ as any)?.options?.map((opt: any) => (
                  <Label key={opt.id} className="flex items-center gap-2 py-1 cursor-pointer hover:bg-pink-50 rounded-lg px-2 transition-all">
                    <Checkbox
                      checked={formState.vibes?.includes(opt.id) || false}
                      onCheckedChange={() => {
                        setFormState((prev: any) => {
                          const arr = prev.vibes || [];
                          if (arr.includes(opt.id)) {
                            return { ...prev, vibes: arr.filter((o: string) => o !== opt.id) };
                          } else {
                            return { ...prev, vibes: [...arr, opt.id] };
                          }
                        });
                      }}
                      aria-label={opt.label}
                    />
                    <span className="text-lg" aria-hidden="true">{opt.icon}</span>
                    <span>{opt.label}</span>
                  </Label>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {/* Filter menu button */}
        <div className="flex-none flex flex-col justify-end">
          <Button type="button" variant="outline" className="w-full sm:w-auto rounded-xl border-2 border-pink-200 bg-white hover:bg-pink-50 text-base font-medium shadow-none transition-all focus:outline-none focus:ring-2 focus:ring-pink-400" onClick={openModal} aria-label="Open more filters">
            <span className="hidden sm:inline">More Filters</span>
            <span className="sm:hidden">Filters</span>
          </Button>
        </div>
        {/* Apply Filters/Search button */}
        <div className="flex-none flex flex-col justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold text-base px-6 py-2 shadow-none hover:from-pink-600 hover:to-red-600 hover:scale-105 active:scale-100 transition-all border-0 focus:outline-none focus:ring-2 focus:ring-pink-400"
            aria-label="Apply filters"
          >
            {isLoading ? "Searching..." : "Apply Filters"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function FilterModal({ open, onOpenChange, formState, setFormState, onSubmit, isLoading }: { open: boolean, onOpenChange: (o: boolean) => void, formState: any, setFormState: (f: any) => void, onSubmit: () => void, isLoading: boolean }) {
  const { location:_location, vibes:_vibes, ...remainingQuestions } = QUESTIONS_DICTIONARY;
  const filterQs = Object.values(remainingQuestions);
  function handleChange(id: string, value: any) {
    setFormState((prev: any) => ({ ...prev, [id]: value }));
  }
  function handleMultiChange(id: string, option: string) {
    setFormState((prev: any) => {
      const arr = prev[id] || [];
      if (arr.includes(option)) {
        return { ...prev, [id]: arr.filter((o: string) => o !== option) };
      } else {
        return { ...prev, [id]: [...arr, option] };
      }
    });
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto w-full max-w-lg p-6">
        <DialogTitle>More Filters</DialogTitle>
        <form onSubmit={e => { e.preventDefault(); onSubmit(); onOpenChange(false); }} className="space-y-6 mt-4">
          {filterQs.map((q) => (
            <div key={q.id}>
              <Label className="block font-semibold mb-1">{q.title}</Label>
              <div className="text-xs text-gray-500 mb-2">{q.subtitle}</div>
              {q.type === "text" && (
                <Input
                  placeholder={(q as any)?.placeholder ?? ""}
                  value={formState[q.id] || ""}
                  onChange={e => handleChange(q.id, e.target.value)}
                  className="max-w-full"
                  required={(q as any)?.required ?? false}
                />
              )}
              {q.type === "single" && (
                <RadioGroup
                  value={formState[q.id] || ""}
                  onValueChange={val => handleChange(q.id, val)}
                  className="gap-2"
                >
                  {(q as any)?.options?.map((opt: any) => (
                    <Label key={opt.id} className="flex items-center gap-2 py-1">
                      <RadioGroupItem value={opt.id} />
                      <span className="text-lg">{opt.icon}</span>
                      <span>{opt.label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              )}
              {q.type === "multiple" && (
                <div className="flex flex-col gap-2">
                  {(q as any)?.options?.map((opt: any) => (
                    <Label key={opt.id} className="flex items-center gap-2 py-1">
                      <Checkbox
                        checked={formState[q.id]?.includes(opt.id) || false}
                        onCheckedChange={() => handleMultiChange(q.id, opt.id)}
                      />
                      <span className="text-lg">{opt.icon}</span>
                      <span>{opt.label}</span>
                    </Label>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="ghost">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold">
              {isLoading ? "Searching..." : "Apply Filters"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Page() {
  const [form, setForm] = useLocalStorage<any>("dateFilters", {});
  const [formState, setFormState] = useState<any>(form);
  const [modalOpen, setModalOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);
  const loadingInterval = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => { setHasMounted(true); }, []);
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

  const hasResults = dateIdeas.length > 0;

  // Timer for loading overlay
  useEffect(() => {
    if (isLoading) {
      setLoadingTime(0);
      loadingInterval.current = setInterval(() => {
        setLoadingTime((t) => t + 1);
      }, 1000);
    } else {
      if (loadingInterval.current) {
        clearInterval(loadingInterval.current);
        loadingInterval.current = null;
      }
    }
    return () => {
      if (loadingInterval.current) {
        clearInterval(loadingInterval.current);
        loadingInterval.current = null;
      }
    };
  }, [isLoading]);

  function handleSubmit() {
    setForm(formState);
    submit({ questionData: formState });
  }

  function handleRemoveFilter(id: string, value?: string) {
    setFormState((prev: any) => {
      if (!prev) return prev;
      const q = (QUESTIONS_DICTIONARY as Record<string, any>)[id];
      if (!q) return prev;
      if (q.type === "multiple" && value) {
        return { ...prev, [id]: (prev[id] || []).filter((v: string) => v !== value) };
      } else {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      }
    });
  }

  function handleClearAllFilters() {
    setFormState((prev: any) => {
      if (!prev) return prev;
      // Only keep location and vibes
      const { location, vibes } = prev;
      return { location, vibes };
    });
  }

  if (!hasMounted) return null;

  return (
    <main className="max-w-6xl mx-auto px-2 sm:px-4 pb-8 py-4">
      <h1 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-pink-500 via-red-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-sm tracking-tight">Find Your Perfect Date Idea</h1>
      <section className="mb-8 rounded-2xl border border-gray-200 bg-white px-2 sm:px-6 pt-6 pb-4 flex flex-col gap-0.5">
        <div className="pb-2">
          <FilterRow formState={formState} setFormState={setFormState} openModal={() => setModalOpen(true)} onApply={handleSubmit} isLoading={isLoading} />
        </div>
        <SelectedFiltersRow formState={formState} onRemove={handleRemoveFilter} onClearAll={handleClearAllFilters} />
      </section>
      <FilterModal open={modalOpen} onOpenChange={setModalOpen} formState={formState} setFormState={setFormState} onSubmit={handleSubmit} isLoading={isLoading} />
      {!hasResults && !isLoading && (
        <div className="text-center text-gray-500 text-lg py-16">
          {form && Object.keys(form).length > 0 ? (
            <p>Apply filters to view results.</p>
          ) : (
            <p>Get started by selecting your search criteria above to view date ideas!</p>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {isLoading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-8 border-b-4 border-b-pink-100 border-pink-500 mx-auto" aria-label="Loading spinner" />
            <p className="text-2xl font-bold bg-gradient-to-r from-pink-200 via-pink-100 to-red-100 bg-clip-text text-transparent mt-4">
              Loading date ideas...
            </p>
            <p className="text-center text-sm text-gray-400 mt-2" aria-live="polite">
              {loadingTime} second{loadingTime === 1 ? "" : "s"} elapsed
            </p>
          </div>
        ) : (
          dateIdeas.filter(Boolean).map((idea, idx) => (
            <DateCard key={idea?.id ?? idx} idea={idea as DateIdea} />
          ))
        )}
      </div>
    </main>
  );
}
