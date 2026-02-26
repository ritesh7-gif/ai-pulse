import { z } from 'zod';

// Schema for individual GitHub repository
export const GithubRepoSchema = z.object({
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

// Schema for the GitHub API response
export const GithubAPIResponseSchema = z.object({
  items: z.array(GithubRepoSchema),
});

// Schema for a Product Hunt tool's thumbnail
export const ProductHuntThumbnailSchema = z.object({
  url: z.string().url(),
});

// Schema for a Product Hunt tool's topic node
export const ProductHuntTopicNodeSchema = z.object({
  name: z.string(),
});

// Schema for a Product Hunt tool's topic edge
export const ProductHuntTopicEdgeSchema = z.object({
  node: ProductHuntTopicNodeSchema,
});

// Schema for a Product Hunt tool's topics
export const ProductHuntTopicsSchema = z.object({
  edges: z.array(ProductHuntTopicEdgeSchema),
});

// Schema for an individual Product Hunt tool
export const ProductHuntToolSchema = z.object({
  id: z.string(),
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  url: z.string().url(),
  votesCount: z.number(),
  thumbnail: ProductHuntThumbnailSchema,
  website: z.string().url(),
  createdAt: z.string(),
  topics: ProductHuntTopicsSchema,
});

// Schema for the Product Hunt API response
export const ProductHuntAPIResponseSchema = z.object({
  data: z.object({
    posts: z.object({
      pageInfo: z.object({
        hasNextPage: z.boolean(),
        endCursor: z.string().nullable(),
      }),
      edges: z.array(z.object({ node: ProductHuntToolSchema })),
    }),
  }),
});
