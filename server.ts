import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import githubRouter from './src/routes/github';
import productHuntRouter from './src/routes/producthunt';
import geminiRouter from './src/routes/gemini';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());



  // In-memory cache for GitHub data


  // Mock Data for Fallback




  // API Routes
  app.use('/api', githubRouter);
  app.use('/api', productHuntRouter);
  app.use('/api', geminiRouter);







  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
