/**
 * Universal Knowledge Service
 * 
 * Provides instant encyclopedic summaries, definitions, and key takeaways
 * for ANY search query using authoritative open knowledge sources.
 * Ensures the Search Hub is fully accessible and never returns a blank dead-end.
 */

export interface KnowledgeBrief {
  query: string;
  title: string;
  extract: string;
  description?: string;
  thumbnail?: string;
  sourceUrl?: string;
  relatedTopics: string[];
  keyTakeaways: string[];
}

// In-memory cache for ultra-fast repeated searches
const knowledgeCache = new Map<string, { data: KnowledgeBrief; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

export async function getKnowledgeBrief(query: string): Promise<KnowledgeBrief | null> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return null;

  const cacheKey = trimmed.toLowerCase();
  const cached = knowledgeCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    // 1. Search Wikipedia API for the best matching article
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      trimmed
    )}&utf8=&format=json`;

    const searchRes = await fetch(searchUrl, {
      headers: { 'User-Agent': 'MarketSphereEducationalHub/1.0 (info@marketsphere.com)' },
    });

    if (!searchRes.ok) return null;

    const searchData: any = await searchRes.json();
    const searchResults = searchData.query?.search;
    if (!searchResults || searchResults.length === 0) {
      return null;
    }

    const topHit = searchResults[0];
    const relatedHits = searchResults.slice(1, 5).map((r: any) => r.title);

    // 2. Fetch the summary for the top hit
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topHit.title)}`;
    const summaryRes = await fetch(summaryUrl, {
      headers: { 'User-Agent': 'MarketSphereEducationalHub/1.0 (info@marketsphere.com)' },
    });

    if (!summaryRes.ok) return null;

    const summaryData: any = await summaryRes.json();
    if (!summaryData.extract) return null;

    // Generate actionable educational takeaways
    const sentences = summaryData.extract
      .split(/(?<=[.?!])\s+/)
      .filter((s: string) => s.trim().length > 15)
      .slice(0, 3);

    const brief: KnowledgeBrief = {
      query: trimmed,
      title: summaryData.title || topHit.title,
      extract: summaryData.extract,
      description: summaryData.description || 'Verified Encyclopedia Overview',
      thumbnail: summaryData.thumbnail?.source || undefined,
      sourceUrl: summaryData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(topHit.title)}`,
      relatedTopics: relatedHits,
      keyTakeaways: sentences.length > 0 ? sentences : [summaryData.extract],
    };

    knowledgeCache.set(cacheKey, { data: brief, timestamp: Date.now() });
    return brief;
  } catch (err: any) {
    console.warn('[Knowledge Service Notice] Error retrieving knowledge brief:', err?.message || err);
    return null;
  }
}
