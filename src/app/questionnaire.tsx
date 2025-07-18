// "use client";

// import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
// import { useState } from "react";

// const questions = [
//   {
//     id: "location",
//     title: "Where are you located?",
//     subtitle: "We'll find the perfect spots near you",
//     type: "text",
//     placeholder: "Enter your city or location...",
//     icon: "📍",
//   },
//   {
//     id: "vibes",
//     title: "What's your ideal vibe?",
//     subtitle: "Pick all that apply - we love variety!",
//     type: "multiple",
//     options: [
//       { id: "romantic", label: "Romantic", icon: "💕" },
//       { id: "adventurous", label: "Adventurous", icon: "🏔️" },
//       { id: "chill", label: "Chill", icon: "😌" },
//       { id: "luxe", label: "Luxe", icon: "✨" },
//       { id: "nature", label: "Nature", icon: "🌿" },
//       { id: "artsy", label: "Artsy", icon: "🎨" },
//       { id: "goofy", label: "Goofy", icon: "🤪" },
//     ],
//   },
//   {
//     id: "dietary",
//     title: "Any dietary preferences?",
//     subtitle: "We'll make sure you have delicious options",
//     type: "text",
//     placeholder: "e.g., vegetarian, gluten-free, no restrictions...",
//     icon: "🍽️",
//   },
//   {
//     id: "budget",
//     title: "What's your budget?",
//     subtitle: "Great dates happen at every price point",
//     type: "single",
//     options: [
//       { id: "free", label: "Free", icon: "💝", desc: "No cost activities" },
//       { id: "low", label: "$", icon: "💰", desc: "Under $50 total" },
//       { id: "medium", label: "$$", icon: "💰💰", desc: "Under $100 total" },
//       { id: "high", label: "$$$", icon: "💳", desc: "Under $200 total" },
//     ],
//   },
//   {
//     id: "timeframe",
//     title: "When are you planning this?",
//     subtitle: "We'll suggest options based on timing",
//     type: "single",
//     options: [
//       {
//         id: "tonight",
//         label: "Tonight",
//         icon: "🌙",
//         desc: "Last-minute magic",
//       },
//       {
//         id: "weekend",
//         label: "This Weekend",
//         icon: "🗓️",
//         desc: "Weekend vibes",
//       },
//       { id: "next-week", label: "Next Week", icon: "📅", desc: "Plan ahead" },
//       {
//         id: "future",
//         label: "Plan Ahead",
//         icon: "🔮",
//         desc: "Future planning",
//       },
//     ],
//   },
//   {
//     id: "duration",
//     title: "How much time do you have?",
//     subtitle: "We'll match activities to your schedule",
//     type: "single",
//     options: [
//       { id: "quick", label: "Quick Hour", icon: "⏰", desc: "1-2 hours" },
//       { id: "evening", label: "Evening Out", icon: "🌆", desc: "3-5 hours" },
//       { id: "full-day", label: "Full Day", icon: "☀️", desc: "6+ hours" },
//     ],
//   },
//   {
//     id: "celebration",
//     title: "Celebrating something special?",
//     subtitle: "We'll add extra magic to your suggestions",
//     type: "text",
//     placeholder: "e.g., anniversary, birthday, or just because...",
//     icon: "🎉",
//   },
//   {
//     id: "involvement",
//     title: "Planning preference?",
//     subtitle: "How involved do you want to be?",
//     type: "single",
//     options: [
//       {
//         id: "surprise",
//         label: "Surprise Me!",
//         icon: "🎁",
//         desc: "Full surprise planning",
//       },
//       {
//         id: "collaborate",
//         label: "Let's Plan Together",
//         icon: "🤝",
//         desc: "Collaborative planning",
//       },
//       {
//         id: "control",
//         label: "I Want Control",
//         icon: "🎯",
//         desc: "Detailed planning",
//       },
//     ],
//   },
//   {
//     id: "dislikes",
//     title: "What dates do you NOT enjoy?",
//     subtitle: "We'll steer clear of these completely",
//     type: "text",
//     placeholder: "e.g., crowded places, loud music, heights...",
//     icon: "🚫",
//   },
//   {
//     id: "activityLevel",
//     title: "How active do you want to be?",
//     subtitle: "Match the energy to your mood",
//     type: "single",
//     options: [
//       {
//         id: "relaxed",
//         label: "Relaxed",
//         icon: "🧘‍♀️",
//         desc: "Calm and peaceful",
//       },
//       { id: "medium", label: "Medium", icon: "🧗", desc: "Some movement" },
//       {
//         id: "energetic",
//         label: "Energetic",
//         icon: "🕺",
//         desc: "High energy fun",
//       },
//     ],
//   },
// ];

// export function Questionnaire() {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [questionnaireData, setQuestionnaireData] = useState({
//     location: "",
//     vibes: [],
//     dietary: "",
//     budget: "",
//     timeframe: "",
//     duration: "",
//     celebration: "",
//     involvement: "",
//     dislikes: "",
//     activityLevel: "",
//   });
//   const [_, setIsAnimating] = useState(false);

//   const handleQuestionnaireUpdate = (questionId, value) => {
//     if (questionId === "vibes") {
//       setQuestionnaireData((prev) => ({
//         ...prev,
//         vibes: prev.vibes.includes(value)
//           ? prev.vibes.filter((v) => v !== value)
//           : [...prev.vibes, value],
//       }));
//     } else {
//       setQuestionnaireData((prev) => ({
//         ...prev,
//         [questionId]: value,
//       }));
//     }
//   };

//   const nextStep = () => {
//     if (currentStep < questions.length - 1) {
//       setIsAnimating(true);
//       setTimeout(() => {
//         setCurrentStep((prev) => prev + 1);
//         setIsAnimating(false);
//       }, 300);
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 0) {
//       setIsAnimating(true);
//       setTimeout(() => {
//         setCurrentStep((prev) => prev - 1);
//         setIsAnimating(false);
//       }, 300);
//     }
//   };

//   const startQuestionnaire = () => {
//     setCurrentStep(0);
//   };

//   const finishQuestionnaire = () => {
//     setCurrentStep(0);
//     // Here you would typically process the data and show results
//     console.log("Questionnaire completed:", questionnaireData);
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         {/* Progress Bar */}
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex items-center justify-between mb-4">
//             <h1 className="text-2xl font-bold text-gray-800">
//               Find Your Perfect Date
//             </h1>
//             <button
//               onClick={() => setShowQuestionnaire(false)}
//               className="text-gray-500 hover:text-gray-700 text-2xl"
//             >
//               ×
//             </button>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div
//               className="bg-gradient-to-r from-pink-500 to-red-500 h-2 rounded-full transition-all duration-500"
//               style={{
//                 width: `${((currentStep + 1) / questions.length) * 100}%`,
//               }}
//             />
//           </div>
//           <div className="text-sm text-gray-600 mt-2">
//             Step {currentStep + 1} of {questions.length}
//           </div>
//         </div>

//         {/* Question Content */}
//         <div className="p-8">
//           {/* <QuestionnaireStep
//                 question={questions[currentStep]}
//                 value={questionnaireData[questions[currentStep].id]}
//                 onChange={handleQuestionnaireUpdate}
//               /> */}
//         </div>

//         {/* Navigation */}
//         <div className="p-6 border-t border-gray-200 flex justify-between">
//           <button
//             onClick={prevStep}
//             disabled={currentStep === 0}
//             className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
//               currentStep === 0
//                 ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                 : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//             }`}
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Previous
//           </button>

//           <button
//             onClick={
//               currentStep === questions.length - 1
//                 ? finishQuestionnaire
//                 : nextStep
//             }
//             className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl font-medium hover:from-pink-600 hover:to-red-600 transition-all"
//           >
//             {currentStep === questions.length - 1 ? (
//               <>
//                 <Sparkles className="w-4 h-4" />
//                 Get My Suggestions
//               </>
//             ) : (
//               <>
//                 Next
//                 <ArrowRight className="w-4 h-4" />
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
