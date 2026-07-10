# AI-Powered Blogging Platform

This project is a minimal AI-Powered Blogging Platform built as a student internship submission. It uses the MERN stack with React Server-Side Rendering (SSR) via Next.js. 

## Architecture

- **Backend:** Express.js API interacting with an in-memory MongoDB database (`mongodb-memory-server`) to make setup and grading as easy as possible without needing local MongoDB installation. It includes a simulated OpenAI endpoint to avoid requiring real API keys.
- **Frontend:** Next.js (App Router) to fulfill the React SSR requirements. Data is fetched server-side for SEO optimization, and Markdown content is rendered safely using `react-markdown`.

## Features
- **SSR Blog Listing:** View all blogs fetched server-side with SEO scores.
- **Article Pages & Paywall:** Read individual markdown blogs. Premium blogs show a mock paywall.
- **AI Editor:** A client-side markdown editor featuring a mock "Ask AI for Suggestions" button to demonstrate generative capabilities.

## Getting Started

You will need two separate terminal windows to run both the backend and frontend simultaneously.

### 1. Start the Backend

Open a new terminal and run:

```bash
cd ai-blog-platform/backend
npm install
node server.js
```

The backend server will start on `http://localhost:5000` and seed the in-memory database with two dummy posts (one free, one premium).

### 2. Start the Frontend

Open another terminal and run:

```bash
cd ai-blog-platform/frontend
npm install
npm run dev
```

The Next.js frontend will start on `http://localhost:3000`. 
Open this URL in your browser to view the application!
