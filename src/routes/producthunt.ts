import { Router } from 'express';
import { ProductHuntAPIResponseSchema } from '../lib/schemas';
import { cache } from '../lib/cache';

const router = Router();

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

const PLATFORM_MESSAGE = "New tools are being updated. Please check back shortly.";

const MOCK_PRODUCT_TOOLS = [
  {
    id: "mock-1",
    name: "Perplexity AI",
    tagline: "AI-powered search engine.",
    description: "Perplexity AI is an AI-powered search engine and chatbot that uses large language models to provide accurate and informative answers to user queries.",
    url: "https://www.perplexity.ai",
    website: "https://www.perplexity.ai",
    votesCount: 4500,
    thumbnail: { url: "https://picsum.photos/seed/perplexity/200/200" },
    createdAt: new Date().toISOString(),
    topics: { edges: [{ node: { name: "Search" } }, { node: { name: "AI" } }] }
  },
  {
    id: "mock-2",
    name: "Jasper",
    tagline: "AI content platform for enterprise teams.",
    description: "Jasper is the AI content platform that helps enterprise teams create high-quality content faster.",
    url: "https://www.jasper.ai",
    website: "https://www.jasper.ai",
    votesCount: 3800,
    thumbnail: { url: "https://picsum.photos/seed/jasper/200/200" },
    createdAt: new Date().toISOString(),
    topics: { edges: [{ node: { name: "Marketing" } }, { node: { name: "Writing" } }] }
  }
];

async function fetchAndCacheProductHunt(after: string) {
  const phToken = process.env.PRODUCTHUNT_DEVELOPER_TOKEN;
  if (!phToken) {
    console.warn("Product Hunt Developer Token missing.");
    return null;
  }

  try {
    const query = `
      query($topic: String, $after: String) {
        posts(topic: $topic, first: 20, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              name
              tagline
              description
              url
              votesCount
              thumbnail {
                url
              }
              website
              createdAt
              topics {
                edges {
                  node {
                    name
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${phToken}`,
      },
      body: JSON.stringify({
        query,
        variables: {
          topic: "artificial-intelligence",
          after: after === "initial" ? null : after
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Product Hunt API failed with status ${response.status}`);
    }

    const rawData = await response.json();
    const validatedData = ProductHuntAPIResponseSchema.parse(rawData);

    const posts = validatedData.data.posts;
    const tools = posts.edges.map((edge: any) => ({
      ...edge.node,
      // Normalize data if needed, remove ph branding details in the future if any
    }));

    const result = {
      tools,
      pageInfo: posts.pageInfo
    };

    cache.set(`product_hunt_tools_${after}`, result);
    return result;
  } catch (error) {
    console.error(`Error background fetching Product Hunt tools (${after}):`, error);
    return null;
  }
}

router.get('/tools', async (req, res) => {
  const after = (req.query.after as string) || "initial";
  const cacheKey = `product_hunt_tools_${after}`;

  try {
    const cachedEntry = cache.get<any>(cacheKey);

    if (cachedEntry) {
      if (Date.now() - cachedEntry.timestamp > CACHE_TTL) {
        console.log(`Product Hunt Cache stale for ${after}, refreshing in background...`);
        fetchAndCacheProductHunt(after);
      }
      return res.json(cachedEntry.data);
    }

    const freshData = await fetchAndCacheProductHunt(after);
    if (freshData) {
      return res.json(freshData);
    }

    console.log("Serving mock Product Hunt data due to complete failure");
    res.json({ tools: MOCK_PRODUCT_TOOLS, pageInfo: { hasNextPage: false, endCursor: null } });
  } catch (error: any) {
    console.error("Error in Product Hunt route:", error);
    res.status(500).json({ error: PLATFORM_MESSAGE });
  }
});

export default router;
