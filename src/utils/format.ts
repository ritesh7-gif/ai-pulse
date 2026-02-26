/**
 * Automatically cleans GitHub repo names or tool names before displaying.
 * Removes common prefixes, replaces separators with spaces, and capitalizes words.
 */
export function formatToolName(name: string): string {
  if (!name) return "";
  
  return name
    .replace(/^(awesome-|ai-|open-|the-)/i, '')
    .replace(/[-_]/g, ' ')
    .trim()
    .split(/\s+/)
    .map(word => {
      if (word.length === 0) return "";
      // If the word is short (like "js", "ui", "ai"), make it all uppercase
      if (word.length <= 2) return word.toUpperCase();
      // Otherwise capitalize the first letter
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .filter(Boolean)
    .join(' ');
}
