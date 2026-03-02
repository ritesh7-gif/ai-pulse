import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

// ─── Simple in-memory rate limiter (resets on cold start) ────────────────────
// For higher traffic, replace with Upstash Redis (@upstash/ratelimit).

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_MAX = 10;     // max requests per window per IP
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const timestamps = (rateLimitMap.get(ip) ?? []).filter(t => now - t < RATE_LIMIT_WINDOW);
    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);
    return timestamps.length > RATE_LIMIT_MAX;
}

// ─── Vercel Serverless Handler ───────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // 1. Method guard
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 2. Rate limiting — keyed by IP
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ?? 'unknown';
    if (isRateLimited(clientIp)) {
        return res.status(429).json({ error: 'Too many requests. Please slow down.' });
    }

    // 3. Authentication — verify caller is a logged-in Supabase user
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: missing Authorization header' });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('[clean-description] Supabase env vars missing');
        return res.status(500).json({ error: 'Server misconfiguration' });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
        return res.status(401).json({ error: 'Unauthorized: invalid or expired session' });
    }

    // 4. Input validation — presence + type + max length
    const { description } = req.body ?? {};
    if (!description || typeof description !== 'string') {
        return res.status(400).json({ error: 'Description is required and must be a string' });
    }
    if (description.length > 2000) {
        return res.status(400).json({ error: 'Description must be under 2000 characters' });
    }

    // 5. Call Gemini
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('[clean-description] GEMINI_API_KEY env var missing');
            return res.status(500).json({ error: 'Server misconfiguration' });
        }

        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: `Clean and summarize this AI tool description into a concise, professional, and engaging 2-sentence pitch for a startup discovery website: "${description}"`,
        });
        res.json({ cleaned: response.text });
    } catch (error: any) {
        console.error('[clean-description] Gemini error:', error?.message ?? error);
        res.status(500).json({ error: 'Failed to clean description' });
    }
}
