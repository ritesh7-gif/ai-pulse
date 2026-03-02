import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

// ─── Zod Schemas (inlined from src/lib/schemas.ts) ─────────────────────────

const GithubRepoSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable(),
    stargazers_count: z.number(),
    html_url: z.string().url(),
    owner: z.object({
        login: z.string(),
        avatar_url: z.string().url(),
    }),
    language: z.string().nullable(),
});

const GithubAPIResponseSchema = z.object({
    items: z.array(GithubRepoSchema),
});

// ─── In-memory cache (persists across warm invocations) ─────────────────────

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

const memCache = new Map<string, CacheEntry<unknown>>();

const cache = {
    get: <T>(key: string): CacheEntry<T> | null => {
        const entry = memCache.get(key);
        return entry ? (entry as CacheEntry<T>) : null;
    },
    set: <T>(key: string, data: T): void => {
        memCache.set(key, { data, timestamp: Date.now() });
    },
};

// ─── Constants ───────────────────────────────────────────────────────────────

const GITHUB_CACHE_TTL = 30 * 60 * 1000; // 30 minutes

const PLATFORM_MESSAGE = "New tools are being updated. Please check back shortly.";

const MOCK_GITHUB_TOOLS = [
    {
        id: 1,
        name: "AutoGPT",
        description: "An experimental open-source attempt to make GPT-4 fully autonomous.",
        stars: 162000,
        url: "https://github.com/Significant-Gravitas/Auto-GPT",
        owner: { login: "Significant-Gravitas", avatar_url: "https://avatars.githubusercontent.com/u/130987975?v=4" },
        language: "Python"
    },
    {
        id: 2,
        name: "LangChain",
        description: "Building applications with LLMs through composability.",
        stars: 85000,
        url: "https://github.com/langchain-ai/langchain",
        owner: { login: "langchain-ai", avatar_url: "https://avatars.githubusercontent.com/u/126733545?v=4" },
        language: "Python"
    }
];

// ─── Fetch logic (unchanged from original route) ─────────────────────────────

async function fetchAndCacheGithub(page: number) {
    try {
        const headers: Record<string, string> = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "AI-Pulse-App"
        };

        if (process.env.GITHUB_TOKEN) {
            headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
        }

        const response = await fetch(`https://api.github.com/search/repositories?q=ai+tools&sort=stars&order=desc&per_page=20&page=${page}`, {
            headers
        });

        if (!response.ok) {
            throw new Error(`GitHub API failed with status ${response.status}`);
        }

        const rawData = await response.json();
        const validatedData = GithubAPIResponseSchema.parse(rawData);

        const tools = validatedData.items.map((repo: any) => ({
            id: repo.id,
            name: repo.name,
            description: repo.description,
            stars: repo.stargazers_count,
            url: repo.html_url,
            owner: {
                login: repo.owner.login,
                avatar_url: repo.owner.avatar_url
            },
            language: repo.language
        }));

        cache.set(`github_tools_page_${page}`, tools);
        return tools;
    } catch (error) {
        console.error(`Error background fetching GitHub tools for page ${page}:`, error);
        return null;
    }
}

// ─── Vercel Serverless Handler ───────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const page = parseInt(req.query.page as string) || 1;
    const cacheKey = `github_tools_page_${page}`;

    try {
        const cachedEntry = cache.get<any[]>(cacheKey);

        if (cachedEntry) {
            // If cache is stale, refresh in background
            if (Date.now() - cachedEntry.timestamp > GITHUB_CACHE_TTL) {
                console.log(`GitHub Cache stale for page ${page}, refreshing in background...`);
                fetchAndCacheGithub(page);
            }
            return res.json(cachedEntry.data);
        }

        // No cache exists, fetch immediately
        const freshData = await fetchAndCacheGithub(page);
        if (freshData) {
            return res.json(freshData);
        }

        // If both fetch and cache fail, show mock data or platform message
        console.log("Serving mock GitHub data due to complete failure");
        res.json(MOCK_GITHUB_TOOLS);
    } catch (error: any) {
        console.error('Error in GitHub route:', error);
        res.status(500).json({ error: PLATFORM_MESSAGE });
    }
}
