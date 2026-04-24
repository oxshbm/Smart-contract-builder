# MultiversX Contract Builder

## Overview

This project is a Next.js application for generating starter smart contracts for the MultiversX ecosystem.

It has two main flows:

1. Visual builder: drag and drop predefined MultiversX modules and compose Rust contract code locally in the browser.
2. AI builder: describe the contract in natural language and generate Rust code through the app's server API.

The visual builder already works as a local code composer. The AI builder is now wired to the Google Gemini API so it can generate contracts once you add a valid API key.

## What Works Today

- Visual contract builder UI
- AI contract generation through `/api/generate-contract`
- Contract export and local editing
- Next.js production build

## Current Limitations

- The deployment flow in the UI is still mostly mocked and does not perform a real wallet-backed on-chain deployment yet.
- The compile API route expects a local MultiversX toolchain such as `mxpy` in the runtime environment.
- Generated contracts are starting points and still need review, testing, and likely manual fixes before real deployment.

## Quick Start

### Prerequisites

- Node.js 18+
- npm
- A free Google AI Studio API key

### Installation

```bash
git clone https://github.com/SHUBHAM1737/MultiversX-Contract-Builder.git
cd MultiversX-Contract-Builder
npm install
cp .env.example .env.local
```

Set your environment variables in `.env.local`:

```bash
GEMINI_API_KEY=your_google_ai_studio_api_key_here
GEMINI_MODEL=gemini-2.5-flash-lite
```

Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

```bash
GEMINI_API_KEY=your_google_ai_studio_api_key_here
GEMINI_MODEL=gemini-2.5-flash-lite
```

<<<<<<< HEAD
Create a `.env` file in the project root with the following key configurations:

bash
# OpenAI API Configuration
# Optional: required only for AI Contract Generator page
OPENAI_API_KEY=your_openai_api_key_here
# MultiversX Blockchain Configuration
MULTIVERSX_RPC_ENDPOINT=https://api.multiversx.com
=======
Notes:

- `GEMINI_API_KEY` is required for the AI builder.
- `GEMINI_MODEL` is optional.
- If `GEMINI_MODEL` is omitted, the app defaults to `gemini-2.5-flash-lite`.
- `.env*` files are already ignored by git in this repo.
>>>>>>> 05417ba (ai generator fixes)

## Project Structure

- `app/builder/page.tsx`: visual builder entry page
- `app/ai-contract-generator/page.tsx`: AI builder entry page
- `app/api/generate-contract/route.ts`: server route for AI generation
- `app/api/compile-contract/route.ts`: server route for Rust-to-WASM compilation
- `app/services/deployment.service.ts`: current deployment service, still mocked

<<<<<<< HEAD
*Important:*
- Never commit the .env file to version control
- Add .env to your .gitignore
- Visual Builder works without `OPENAI_API_KEY`
- AI Contract Generator shows "API key needed" when key is missing
- Keep your sensitive information confidential
=======
## Technology Stack
>>>>>>> 05417ba (ai generator fixes)

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- React DnD
- MultiversX SDK packages
- Google Gemini API

## Recommended Free API

Use Google AI Studio and generate a Gemini API key. That gives you a practical free path for this app without adding another paid dependency.

Once the key is set in `.env.local`, the AI builder page should work without further code changes.
