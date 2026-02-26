/**
 * Utility for persistent storage of AI tools.
 * Ensures tools are merged and duplicates are removed.
 */

const STORAGE_KEY_PREFIX = "aipulse_tools_";

export function mergeTools<T extends { id?: string | number; name: string }>(
  oldTools: T[],
  newTools: T[]
): T[] {
  const map = new Map<string | number, T>();

  // Add old tools first
  oldTools.forEach((tool) => {
    const key = tool.id || tool.name;
    map.set(key, tool);
  });

  // Add new tools, overwriting old ones if ID/name matches (to get latest stats)
  newTools.forEach((tool) => {
    const key = tool.id || tool.name;
    map.set(key, tool);
  });

  return Array.from(map.values());
}

export function saveToolsToStorage<T extends { id?: string | number; name: string }>(
  key: string,
  tools: T[],
  maxItems: number = 5000
) {
  try {
    // Keep only the most recent tools if we exceed maxItems
    const toolsToSave = tools.slice(-maxItems);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, JSON.stringify(toolsToSave));
  } catch (e) {
    console.error("Failed to save tools to storage", e);
  }
}

export function loadToolsFromStorage<T>(key: string): T[] {
  try {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Failed to load tools from storage", e);
    return [];
  }
}
