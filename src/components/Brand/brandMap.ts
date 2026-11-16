import type { ComponentType } from 'react'
import { Figma, OpenAI, GitHub, Claude, LinkedIn, Twitter, Behance } from './BrandMarks'

/** Lookup used where the mark is chosen by id from the data file. */
export const brandMap: Record<string, ComponentType> = {
  figma: Figma,
  openai: OpenAI,
  github: GitHub,
  claude: Claude,
  linkedin: LinkedIn,
  twitter: Twitter,
  behance: Behance,
}
