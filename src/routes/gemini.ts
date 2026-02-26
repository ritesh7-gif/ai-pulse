import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';

const router = Router();

router.post('/clean-description', async (req, res) => {
  const { description } = req.body;
  if (!description) return res.status(400).json({ error: 'Description required' });

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: `Clean and summarize this AI tool description into a concise, professional, and engaging 2-sentence pitch for a startup discovery website: "${description}"`,
    });
    res.json({ cleaned: response.text });
  } catch (error: any) {
    console.error('Gemini error:', error);
    res.status(500).json({ error: 'Failed to clean description' });
  }
});

export default router;
