export interface Tool {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  votesCount: number;
  thumbnail: {
    url: string;
  };
  website: string;
  createdAt: string;
  topics: {
    edges: {
      node: {
        name: string;
      };
    }[];
  };
}

export interface GithubTool {
  id: number;
  name: string;
  description: string;
  stars: number;
  url: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  language: string;
}

export const CATEGORIES = [
  { name: "All", icon: "LayoutGrid" },
  { name: "Writing", icon: "PenTool" },
  { name: "Coding", icon: "Code" },
  { name: "Design", icon: "Palette" },
  { name: "Marketing", icon: "Megaphone" },
  { name: "Productivity", icon: "Zap" },
  { name: "Automation", icon: "Cpu" },
  { name: "Agents", icon: "Bot" },
  { name: "Data", icon: "BarChart" },
];
