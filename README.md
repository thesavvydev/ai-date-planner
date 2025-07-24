> **Note:** This app was partially built with [Cursor](https://www.cursor.so/) and AI-assisted code generation. While much of the code was written and reviewed by humans, AI tools were used throughout the development process to accelerate building an accessible, production-grade web application.

# 💖 Date Night AI Planner

A fun, interactive, and accessible AI-powered date night planner.

---

## ✨ Features

- **AI-Powered Date Ideas**: Get personalized, real-world date suggestions using OpenAI (GPT-4o) via the Vercel AI SDK.
- **Questionnaire Flow**: Answer a series of fun, customizable questions (location, vibe, dietary, budget, etc.) to tailor your date ideas.
- **Chat-Based Suggestions**: Use a chat interface to request date ideas for any location or scenario.
- **User Authentication**: Secure sign up, sign in, and password reset with Supabase Auth.
- **Save & Manage Ideas**: Save your favorite date ideas to your Supabase PostgreSQL database (feature in progress).
- **Location Autocomplete**: Smart location suggestions powered by LocationIQ.
- **Modern UI & Accessibility**: Beautiful, mobile-friendly, and WCAG AA-compliant design.

---

## 🚀 Technologies Used

- **Next.js 15+ (App Router, Server Actions)**
- **Vercel AI SDK**
- **OpenAI API (GPT-4o)**
- **Supabase** (Auth & PostgreSQL)
- **LocationIQ** (for location autocomplete)
- **Zod** (schema validation)
- **shadcn/ui, Tailwind CSS, Lucide Icons**

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18.x or later)
- pnpm (recommended), npm, or Yarn
- Git
- An **OpenAI API Key**
- A **Supabase Project** (with a public URL and anon key)
- A **LocationIQ API Key** (for location autocomplete)

### 1. Clone the Repository

```bash
git clone https://github.com/thesavvydev/ai-date-planner.git
cd ai-date-planner
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the project root:

```env
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
LOCATION_ID_ACCESS_TOKEN=YOUR_LOCATIONIQ_API_KEY
```

- `OPENAI_API_KEY`: Your OpenAI API key for generating date ideas.
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon public key.
- `LOCATION_ID_ACCESS_TOKEN`: Your LocationIQ API key for location autocomplete.

### 4. Run the Development Server

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧑‍💻 Usage & User Flows

### 1. Questionnaire Date Planner
- Start on the homepage and answer questions about your location, vibe, dietary preferences, budget, timing, and more.
- Submit your answers to get a list of unique, AI-generated date ideas tailored to your preferences.

### 2. Chat-Based Suggestions
- Go to the Chat page to ask for date ideas in a conversational way (e.g., "Fun date ideas in Austin for a vegan on a budget").
- Receive structured, real-world suggestions instantly.

### 3. Authentication
- Sign up with your email, name, and (optionally) a profile photo.
- Sign in with your email/username and password.
- Forgot password? Request a reset link via email.

### 4. Save & Manage Ideas
- (Coming soon) Save your favorite date ideas to your Supabase account for later reference.

---

## 📝 Accessibility

- All features are designed to be WCAG AA compliant, including on mobile devices.
- Keyboard navigation, color contrast, and ARIA labels are prioritized throughout the UI.

---

## 📦 Scripts

- `pnpm run dev` — Start the development server
- `pnpm run build` — Build for production
- `pnpm run start` — Start the production server
- `pnpm run lint` — Lint the codebase

---

## 🤝 Contributing

Pull requests and issues are welcome! Please ensure your changes maintain accessibility and code quality.

---

## 📄 License

MIT
