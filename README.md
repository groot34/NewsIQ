# NewsIQ 📰✨

**NewsIQ** is an advanced, AI-powered newsletter generation platform designed to streamline the process of curating and creating professional newsletters. By leveraging RSS feeds and cutting-edge AI, NewsIQ automatically aggregates content, summarizes articles, and generates formatted newsletters tailored to your brand's voice.

![NewsIQ Dashboard](https://placehold.co/1200x600/1e1e2e/ffffff?text=NewsIQ+Dashboard+Preview)

## 🚀 Key Features

### 🤖 AI-Powered Generation
*   **Smart Aggregation**: Automatically fetches articles from your selected RSS feeds within a specified date range.
*   **Content Curaton**: Analyzes article content to identify top announcements and key stories.
*   **Context Aware**: Accepts user input for specific focus, tone, or additional context (e.g., "Focus on security updates").
*   **Structured Output**: Generates a complete newsletter structure including:
    *   **5 Suggested Titles** (Catchy and relevant)
    *   **5 Email Subject Lines** (Optimized for open rates)
    *   **Top 5 Announcements** (Quick bullet points)
    *   **Full Body Content** (Markdown formatted with sections, headings, and summaries)

### 📊 Comprehensive Dashboard
*   **RSS Feed Manager**: Easily add, manage, and delete RSS feed sources. Supports validation and auto-discovery.
*   **Newsletter History**: Archive of all generated newsletters. View, delete, or re-access past generations.
*   **Settings & Personalization**: Configure global defaults for:
    *   Target Audience
    *   Brand Voice & Tone
    *   Company Details
    *   Custom Footers & Disclaimers

### 🎨 Premium User Interface
*   **Modern Dark Theme**: A sleek, professional dark interface designed for readability and aesthetics.
*   **Glassmorphism Effects**: Modern UI elements with translucent backgrounds and ambient lighting.
*   **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.
*   **Interactive Elements**: Smooth transitions, loading skeletons, and interactive feedback (toasts).

### 🔒 Security & Performance
*   **Authentication**: Secure user management powered by **Clerk**.
*   **Database**: Robust data persistence using **PostgreSQL** and **Prisma ORM**.
*   **Streaming Responses**: Real-time AI generation feedback using Vercel AI SDK streaming.

---

## 🛠️ Technology Stack

NewsIQ is built with a modern, type-safe stack ensuring performance, scalability, and developer experience.

### Core Framework
*   **[Next.js 16](https://nextjs.org/)**: The React Framework for the Web (App Router architecture).
*   **[React 19](https://react.dev/)**: The latest version of the UI library.
*   **[TypeScript](https://www.typescriptlang.org/)**: Static type definitions for robust code.

### UI & Styling
*   **[Tailwind CSS v4](https://tailwindcss.com/)**: Utility-first CSS framework for rapid styling.
*   **[Shadcn UI](https://ui.shadcn.com/)**: Reusable components built with Radix UI and Tailwind.
*   **[Lucide React](https://lucide.dev/)**: Beautiful, consistent icons.
*   **[Sonner](https://sonner.emilkowal.ski/)**: An opinionated toast component for React.
*   **Glassmorphism**: Custom CSS utility classes for premium visual effects.

### AI & Data
*   **[Vercel AI SDK](https://sdk.vercel.ai/docs)**: The standard library for building AI-powered applications.
*   **[OpenAI API](https://openai.com/)**: Powering the intelligence behind summarization and generation.
*   **[RSS Parser](https://www.npmjs.com/package/rss-parser)**: Robust RSS feed fetching and parsing.

### Backend & Database
*   **[Prisma](https://www.prisma.io/)**: Next-generation Node.js and TypeScript ORM.
*   **[PostgreSQL](https://www.postgresql.org/)**: Advanced open-source relational database.
*   **[Clerk](https://clerk.com/)**: Complete user management and authentication.

### Dev Tooling
*   **[Biome](https://biomejs.dev/)**: Fast formatter and linter.
*   **[pnpm](https://pnpm.io/)**: Fast, disk space efficient package manager.

> 🏗️ **Deep Dive**: For a detailed explanation of how components interact, data flows, and internal workflows, check out our [System Architecture & Component Workflows](ARCHITECTURE.md).

---

## 📂 Project Structure

```bash
newsiq/
├── actions/              # Server Actions (Data mutations & fetches)
│   ├── newsletter.ts     # CRUD for newsletters
│   ├── rss-feed.ts       # RSS feed management
│   └── user-settings.ts  # User preference handling
├── app/                  # Next.js App Router
│   ├── api/              # API Routes (Streaming endpoints)
│   ├── dashboard/        # Protected application routes
│   │   ├── account/      # User profile
│   │   ├── generate/     # Newsletter generation flow
│   │   ├── history/      # Archives
│   │   └── settings/     # App configuration
│   └── page.tsx          # Landing page
├── components/           # React Components
│   ├── dashboard/        # Dashboard-specific widgets
│   ├── landing/          # Landing page sections
│   └── ui/               # Reusable primitives (buttons, cards, etc.)
├── lib/                  # Utilities and Configuration
│   ├── db.ts             # Database connection
│   └── utils.ts          # Helper functions
├── prisma/               # Database Schema
│   └── schema.prisma     # Data models
└── public/               # Static assets
```

---

## ⚡ Getting Started

### Prerequisites
*   Node.js (v18+ recommended)
*   pnpm
*   MOngoDB database (local or cloud)
*   OpenAI API Key(Groq For Free)
*   Clerk Account keys

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/newsiq.git
    cd newsiq
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root:
    ```env
    # Database
    DATABASE_URL="postgresql://..."

    # Auth (Clerk)
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
    CLERK_SECRET_KEY="sk_test_..."

    # AI (OpenAI)
    OPENAI_API_KEY="sk-..."
    ```

4.  **Initialize Database:**
    ```bash
    pnpm prisma generate
    pnpm prisma db push
    ```

5.  **Run Development Server:**
    ```bash
    pnpm dev
    ```

6.  **Open browser:**
    Navigate to `http://localhost:3000`

---

## 📖 Working Pages Overview

### 1. Landing Page (`/`)
A high-conversion landing page featuring:
*   **Hero Section**: Value proposition and CTA.
*   **How it Works**: Step-by-step guide.
*   **Features**: Highlights of the platform Capabilities.
*   **Authentication**: "Get Started" redirects to Clerk sign-up/login.

### 2. Dashboard (`/dashboard`)
The command center.
*   **RSS Feed Manager**: Add URLs (e.g., `https://news.ycombinator.com/rss`).
*   **Quick Actions**: Jump to generation or history.
*   **Stats**: View feed count.

### 3. Generate (`/dashboard/generate`)
The core workspace.
*   **Configuration**: Select Date Range, Choose Feeds, Add User Input.
*   **Streaming UI**: Real-time visualization of the AI "thinking" and writing.
*   **Result Display**: 3-column layout showing Titles, Body, and Announcements.
*   **Actions**: Copy to clipboard, Download as TXT, Save to History.

### 4. History (`/dashboard/history`)
Your archive.
*   **Grid View**: Cards showing past newsletters with date ranges.
*   **Detail View**: Full read-only view of any generated newsletter.
*   **Delete**: Remove old records.

### 5. Settings (`/dashboard/settings`)
Global configuration.
*   **Brand**: Set Company Name, Industry.
*   **Content**: Define default Tone and Target Audience.
*   **Footer**: Set a custom signature for all emails.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for review.

## 📄 License

This project is licensed under the MIT License.
