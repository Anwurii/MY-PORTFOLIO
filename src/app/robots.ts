import type { MetadataRoute } from 'next'
import { SITE_URL, hasRealDomain } from '../lib/seo'

/**
 * robots.txt.
 *
 * AI assistants mostly reach a site through a crawler of their own, and those
 * crawlers are the ones that typically do NOT execute JavaScript — which is
 * why this site is server-rendered. They are named explicitly here so the
 * intent is on the record rather than left to a default.
 *
 * Note: Google-Extended controls use in Gemini and AI Overviews grounding;
 * allowing it is a deliberate choice for discoverability. Remove any agent
 * below to opt out of that one.
 */
const aiAgents = [
  'GPTBot',          // OpenAI — ChatGPT training
  'OAI-SearchBot',   // OpenAI — ChatGPT search results
  'ChatGPT-User',    // OpenAI — user-initiated browsing
  'ClaudeBot',       // Anthropic
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',   // Perplexity
  'Perplexity-User',
  'Google-Extended', // Gemini / AI Overviews grounding
  'Applebot',        // Siri / Spotlight
  'Applebot-Extended',
  'Bingbot',
  'DuckDuckBot',
  'cohere-ai',
  'Meta-ExternalAgent',
]

export default function robots(): MetadataRoute.Robots {
  if (!hasRealDomain) {
    // No production domain configured — keep previews out of the index.
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }

  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...aiAgents.map((userAgent) => ({ userAgent, allow: '/' })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
