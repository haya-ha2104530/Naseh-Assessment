# NasehAI - Company Policy Assistant

A full-stack web application that collects company information through an assessment wizard and allows users to interact with an AI chatbot to generate company policies.

## Tech Stack

- **Next.js** with TypeScript
- **Tailwind CSS**
- **SQLite** with Drizzle ORM
- **Google Gemini AI** (gemini-2.5-flash)

## Features

- Multi-step company assessment wizard
- AI-powered chatbot using company data as context
- Automatic policy generation and storage
- Markdown policy editor
- Persistent data storage

## Getting Started

### Prerequisites

- Node.js 18+
- A Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/haya-ha2104530/Naseh-Assessment.git
cd Naseh-Assessment
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root with the following:
GEMINI_API_KEY=your_gemini_api_key_here
Get your API key at [aistudio.google.com](https://aistudio.google.com)

4. Set up the database:
```bash
npm run db:push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Usage

1. Complete the company assessment wizard
2. Chat with the AI assistant about your company
3. Ask the AI to generate policies (e.g. "Generate a privacy policy for my company")
4. View, edit, and manage generated policies in the Policies page