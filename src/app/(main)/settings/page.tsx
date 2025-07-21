export default function Settings() {
  return <div>settings</div>;
}
// "use client";
// import { useState } from "react";
// import {
//   User,
//   Bell,
//   Settings,
//   Heart,
//   Shield,
//   Palette,
//   Globe,
//   Moon,
//   Sun,
//   Volume2,
//   Smartphone,
//   Mail,
//   MessageCircle,
//   MapPin,
//   Clock,
//   Eye,
// } from "lucide-react";

// const SettingsPage = () => {
//   const [activePanel, setActivePanel] = useState("profile");
//   const [settings, setSettings] = useState({
//     pushNotifications: true,
//     emailNotifications: true,
//     smsNotifications: false,
//     darkMode: false,
//     locationServices: true,
//     autoMatch: true,
//     showOnlineStatus: true,
//     soundEffects: true,
//     matchRadius: 25,
//     ageRange: [25, 35],
//     language: "en",
//   });

//   const toggleSetting = (key) => {
//     setSettings((prev) => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };

//   const menuItems = [
//     { id: "profile", label: "Profile", icon: User },
//     { id: "notifications", label: "Notifications", icon: Bell },
//     { id: "preferences", label: "Preferences", icon: Heart },
//     { id: "privacy", label: "Privacy", icon: Shield },
//     { id: "appearance", label: "Appearance", icon: Palette },
//     { id: "general", label: "General", icon: Settings },
//   ];

//   const Toggle = ({ checked, onChange }) => (
//     <div
//       className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${
//         checked ? "bg-gradient-to-r from-pink-500 to-red-500" : "bg-gray-300"
//       }`}
//       onClick={onChange}
//     >
//       <div
//         className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
//           checked ? "translate-x-6" : "translate-x-0.5"
//         }`}
//       />
//     </div>
//   );

//   const SettingItem = ({ label, description, children, icon: Icon }) => (
//     <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
//       <div className="flex items-start gap-3 flex-1">
//         {Icon && <Icon className="w-5 h-5 text-gray-400 mt-1" />}
//         <div>
//           <div className="font-medium text-gray-900">{label}</div>
//           {description && (
//             <div className="text-sm text-gray-500 mt-1">{description}</div>
//           )}
//         </div>
//       </div>
//       <div className="ml-4">{children}</div>
//     </div>
//   );

//   const renderPanel = () => {
//     switch (activePanel) {
//       case "profile":
//         return (
//           <div className="space-y-6">
//             <div className="text-center">
//               <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
//                 A
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900">
//                 Alex Johnson
//               </h3>
//               <p className="text-gray-500">alex.johnson@email.com</p>
//             </div>

//             <div className="space-y-4">
//               <SettingItem
//                 label="Profile Visibility"
//                 description="Control who can see your profile"
//                 icon={Eye}
//               >
//                 <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
//                   <option>Everyone</option>
//                   <option>Matches Only</option>
//                   <option>Private</option>
//                 </select>
//               </SettingItem>

//               <SettingItem
//                 label="Auto-Match"
//                 description="Automatically match with compatible profiles"
//                 icon={Heart}
//               >
//                 <Toggle
//                   checked={settings.autoMatch}
//                   onChange={() => toggleSetting("autoMatch")}
//                 />
//               </SettingItem>

//               <SettingItem
//                 label="Show Online Status"
//                 description="Let others see when you're online"
//                 icon={Globe}
//               >
//                 <Toggle
//                   checked={settings.showOnlineStatus}
//                   onChange={() => toggleSetting("showOnlineStatus")}
//                 />
//               </SettingItem>
//             </div>
//           </div>
//         );

//       case "notifications":
//         return (
//           <div className="space-y-6">
//             <div className="space-y-4">
//               <SettingItem
//                 label="Push Notifications"
//                 description="Receive notifications on your device"
//                 icon={Smartphone}
//               >
//                 <Toggle
//                   checked={settings.pushNotifications}
//                   onChange={() => toggleSetting("pushNotifications")}
//                 />
//               </SettingItem>

//               <SettingItem
//                 label="Email Notifications"
//                 description="Get updates via email"
//                 icon={Mail}
//               >
//                 <Toggle
//                   checked={settings.emailNotifications}
//                   onChange={() => toggleSetting("emailNotifications")}
//                 />
//               </SettingItem>

//               <SettingItem
//                 label="SMS Notifications"
//                 description="Receive text messages for important updates"
//                 icon={MessageCircle}
//               >
//                 <Toggle
//                   checked={settings.smsNotifications}
//                   onChange={() => toggleSetting("smsNotifications")}
//                 />
//               </SettingItem>

//               <SettingItem
//                 label="Sound Effects"
//                 description="Play sounds for matches and messages"
//                 icon={Volume2}
//               >
//                 <Toggle
//                   checked={settings.soundEffects}
//                   onChange={() => toggleSetting("soundEffects")}
//                 />
//               </SettingItem>
//             </div>
//           </div>
//         );

//       case "preferences":
//         return (
//           <div className="space-y-6">
//             <div className="space-y-4">
//               <SettingItem
//                 label="Match Radius"
//                 description="Maximum distance for potential matches"
//                 icon={MapPin}
//               >
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="range"
//                     min="5"
//                     max="100"
//                     value={settings.matchRadius}
//                     className="w-20"
//                     onChange={(e) =>
//                       setSettings((prev) => ({
//                         ...prev,
//                         matchRadius: parseInt(e.target.value),
//                       }))
//                     }
//                   />
//                   <span className="text-sm text-gray-600 min-w-0">
//                     {settings.matchRadius}km
//                   </span>
//                 </div>
//               </SettingItem>

//               <SettingItem
//                 label="Age Range"
//                 description="Preferred age range for matches"
//                 icon={Clock}
//               >
//                 <div className="text-sm text-gray-600">
//                   {settings.ageRange[0]} - {settings.ageRange[1]} years
//                 </div>
//               </SettingItem>

//               <SettingItem
//                 label="Location Services"
//                 description="Use your location to find nearby matches"
//                 icon={MapPin}
//               >
//                 <Toggle
//                   checked={settings.locationServices}
//                   onChange={() => toggleSetting("locationServices")}
//                 />
//               </SettingItem>
//             </div>
//           </div>
//         );

//       case "privacy":
//         return (
//           <div className="space-y-6">
//             <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
//               <div className="flex items-center gap-2 text-amber-800 mb-2">
//                 <Shield className="w-5 h-5" />
//                 <span className="font-medium">Privacy Controls</span>
//               </div>
//               <p className="text-sm text-amber-700">
//                 Your privacy is important to us. Control what information you
//                 share and who can see it.
//               </p>
//             </div>

//             <div className="space-y-4">
//               <SettingItem
//                 label="Profile Photos"
//                 description="Who can see your photos"
//               >
//                 <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
//                   <option>Everyone</option>
//                   <option>Matches Only</option>
//                   <option>After Message</option>
//                 </select>
//               </SettingItem>

//               <SettingItem
//                 label="Last Seen"
//                 description="Show when you were last active"
//               >
//                 <Toggle
//                   checked={settings.showOnlineStatus}
//                   onChange={() => toggleSetting("showOnlineStatus")}
//                 />
//               </SettingItem>

//               <SettingItem
//                 label="Data Usage"
//                 description="How we use your data"
//               >
//                 <button className="text-pink-600 hover:text-pink-700 text-sm font-medium">
//                   Learn More
//                 </button>
//               </SettingItem>
//             </div>
//           </div>
//         );

//       case "appearance":
//         return (
//           <div className="space-y-6">
//             <div className="space-y-4">
//               <SettingItem
//                 label="Dark Mode"
//                 description="Switch to dark theme"
//                 icon={settings.darkMode ? Moon : Sun}
//               >
//                 <Toggle
//                   checked={settings.darkMode}
//                   onChange={() => toggleSetting("darkMode")}
//                 />
//               </SettingItem>

//               <SettingItem
//                 label="Theme Color"
//                 description="Choose your preferred accent color"
//                 icon={Palette}
//               >
//                 <div className="flex gap-2">
//                   {[
//                     "bg-pink-500",
//                     "bg-pink-500",
//                     "bg-red-500",
//                     "bg-green-500",
//                   ].map((color, i) => (
//                     <div
//                       key={i}
//                       className={`w-6 h-6 rounded-full cursor-pointer ${color} ${
//                         i === 0 ? "ring-2 ring-offset-2 ring-pink-500" : ""
//                       }`}
//                     />
//                   ))}
//                 </div>
//               </SettingItem>

//               <SettingItem
//                 label="Language"
//                 description="Choose your preferred language"
//                 icon={Globe}
//               >
//                 <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
//                   <option value="en">English</option>
//                   <option value="es">Español</option>
//                   <option value="fr">Français</option>
//                   <option value="de">Deutsch</option>
//                 </select>
//               </SettingItem>
//             </div>
//           </div>
//         );

//       case "general":
//         return (
//           <div className="space-y-6">
//             <div className="space-y-4">
//               <SettingItem
//                 label="App Version"
//                 description="Current version of the app"
//               >
//                 <span className="text-sm text-gray-600">v2.1.4</span>
//               </SettingItem>

//               <SettingItem label="Support" description="Get help with the app">
//                 <button className="text-pink-600 hover:text-pink-700 text-sm font-medium">
//                   Contact Us
//                 </button>
//               </SettingItem>

//               <SettingItem
//                 label="Terms of Service"
//                 description="Read our terms and conditions"
//               >
//                 <button className="text-pink-600 hover:text-pink-700 text-sm font-medium">
//                   View Terms
//                 </button>
//               </SettingItem>

//               <div className="pt-4 border-t border-gray-200">
//                 <button className="w-full bg-red-50 hover:bg-red-100 text-red-700 px-4 py-3 rounded-lg font-medium transition-colors">
//                   Delete Account
//                 </button>
//               </div>
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div>
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           {/* Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
//               <h2 className="text-lg font-semibold text-gray-900 mb-6">
//                 Settings
//               </h2>
//               <nav className="space-y-1">
//                 {menuItems.map((item) => {
//                   const Icon = item.icon;
//                   return (
//                     <button
//                       key={item.id}
//                       onClick={() => setActivePanel(item.id)}
//                       className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
//                         activePanel === item.id
//                           ? "bg-pink-100 text-pink-700 font-medium"
//                           : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//                       }`}
//                     >
//                       <Icon className="w-5 h-5" />
//                       {item.label}
//                     </button>
//                   );
//                 })}
//               </nav>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="lg:col-span-3">
//             <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
//               <div className="mb-6">
//                 <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                   {menuItems.find((item) => item.id === activePanel)?.label}
//                 </h2>
//                 <p className="text-gray-600">
//                   {activePanel === "profile" &&
//                     "Manage your profile information and visibility settings"}
//                   {activePanel === "notifications" &&
//                     "Control how and when you receive notifications"}
//                   {activePanel === "preferences" &&
//                     "Customize your matching preferences and criteria"}
//                   {activePanel === "privacy" &&
//                     "Control your privacy and data sharing settings"}
//                   {activePanel === "appearance" &&
//                     "Personalize the look and feel of your app"}
//                   {activePanel === "general" &&
//                     "General app settings and account management"}
//                 </p>
//               </div>

//               {renderPanel()}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SettingsPage;
