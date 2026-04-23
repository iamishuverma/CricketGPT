# 🏏 CricketGPT

An AI-powered chatbot that answers all your Cricket questions — from the basics of the game to the latest tournament results.

## What is it?

CricketGPT combines the power of GPT-4.1 nano with a Retrieval Augmented Generation (RAG) pipeline to answer Cricket questions accurately, even beyond the model's knowledge cutoff. It scrapes Cricket-related Wikipedia pages, stores them as vector embeddings in AstraDB, and retrieves the most relevant context for every question asked.

## Tech Stack

- **Next.js** — frontend and API routes
- **AI SDK v6** — streaming chat with `useChat`
- **OpenAI GPT-4.1 nano** — language model
- **AstraDB** — vector database for storing embeddings
- **Puppeteer** — web scraping Wikipedia pages
- **LangChain** — text splitting and document loading

## Getting Started

1. Clone the repository
2. Install dependencies
```bash
npm install
```
3. Set up your `.env` file
```env
OPENAI_API_KEY=
ASTRA_DB_API_ENDPOINT=
ASTRA_DB_APPLICATION_TOKEN=
ASTRA_DB_NAMESPACE=
ASTRA_DB_COLLECTION=
```
4. Seed the database
```bash
npm run seed
```
5. Run the development server
```bash
npm run dev
```

## How it works

1. Cricket-related Wikipedia pages are scraped and split into chunks
2. Each chunk is embedded using `text-embedding-3-small` and stored in AstraDB
3. When a user asks a question, the question is embedded and the top 10 most relevant chunks are retrieved
4. The chunks are injected into the prompt as context for GPT-4.1 nano to answer accurately
