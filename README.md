# 💖 Date Night AI Planner

A fun and interactive date night planner project.

---

## ✨ Features

- **AI-Powered Date Ideas**: Generate personalized date suggestions using OpenAI via the Vercel AI SDK.
- **Structured Output**: Uses `generateObject` or `streamObject` for predictable JSON output.
- **User Authentication**: Secure user login and registration with Supabase Auth.
- **Save & Manage Ideas**: Save favorite date ideas to a Supabase PostgreSQL database.

---

## 🚀 Technologies Used

- **Next.js 14+ (App Router)**
- **Vercel AI SDK**
- **OpenAI API**
- **Supabase** (Auth & PostgreSQL)
- **Zod** (for schema validation)

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18.x or later)
- npm or Yarn
- Git
- An **OpenAI API Key**
- A **Supabase Project**

### 1\. Clone the Repository

```bash
git clone https://github.com/thesavvydev/ai-date-planner.git
cd ai-date-planner
```

### 2\. Install Dependencies

```bash
pnpm install
```

### 3\. Environment Variables

Create a `.env.local` file in the project root:

```env
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### 4\. Run the Development Server

```bash
pnpm run dev
```

Open http://localhost:3000
