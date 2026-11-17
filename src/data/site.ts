/**
 * Single source of truth for editable copy and destinations.
 *
 * Copy is transcribed from design-reference/homepage-reference.png.
 * Anything that could NOT be read from the reference is `null` and is
 * listed in ASSET-CHECKLIST.md. Nothing here is invented.
 */

export type Unconfirmed<T> = T | null

export interface NavLink {
  label: string
  /** in-page anchor, or null when the destination is not yet supplied */
  href: Unconfirmed<string>
  kind: 'anchor' | 'file'
}

export interface Project {
  id: string
  /** URL segment for the internal case study at /work/<slug> */
  slug: string
  /** Accessible name. Read from the artwork in the reference. */
  title: string
  /** Verified project title as published on Behance. */
  behanceTitle: string
  /** The full project, verified reachable. */
  behanceUrl: string
  /** Tools and topics, taken from the project's own Behance tags. */
  tags: readonly string[]
  image: string
  alt: string
  /** true when `image` is a stand-in, not the real artwork */
  placeholder?: boolean
}

export interface ExperienceRow {
  id: string
  company: string
  role: string
  timeline: string
  contribution: string
  /** Existing internal case study this row previews, or null when none exists. */
  caseStudySlug: Unconfirmed<string>
  /** Preview artwork. Reused from Selected Work — nothing new is invented. */
  previewImage: Unconfirmed<string>
  previewAlt: string
  /** true when `previewImage` is a stand-in, not the real artwork */
  previewIsPlaceholder?: boolean
  /**
   * Left edge of the desktop hover preview, measured from that row's own
   * hover reference and expressed as a fraction of the table width.
   */
  previewLeft: string
}

export interface FaqItem {
  n: string
  q: string
  a: string
}

export interface SocialLink {
  id: string
  label: string
  /** null = not yet verified; rendered disabled rather than guessed. */
  href: Unconfirmed<string>
}

export const site = {
  name: 'Anwurii',
  monogram: 'AA',
  role: 'Product Designer',
  /** Used for <title> and meta description. */
  meta: {
    title: 'Anwurii — Product Designer',
    description:
      'An experienced product designer with over 5 years of experience. I help businesses and individuals turn ideas into digital experiences that feel easy.',
  },

  /**
   * Contact address — confirmed by the owner, and matching both the Behance
   * profile and the design reference footer. One 'g' in "amazingrace".
   *
   * This is the single place it is defined. The nav compose icon, both
   * "PUT ME TO WORK" buttons, "Write me here", the footer chip and its copy
   * control, and the schema.org Person all read from here.
   */
  email: 'alabiamazingrace3@gmail.com' as Unconfirmed<string>,

  /** No resume file was supplied. See ASSET-CHECKLIST.md. */
  resumeUrl: null as Unconfirmed<string>,

  nav: [
    { label: 'About', href: '#intro', kind: 'anchor' },
    { label: 'Projects', href: '#work', kind: 'anchor' },
    { label: 'Resume', href: null, kind: 'file' },
  ] satisfies NavLink[],

  hero: {
    /** The six oversized words, in reading order. */
    lines: [
      { left: 'i’m', right: 'anwurii' },
      { left: 'and i', right: 'make' },
      { left: 'ideas', right: 'work' },
    ],
    eyebrow: 'an experienced\nproduct designer',
    experience: 'with over 5 years of\nexperience',
    leftCopy:
      'I’ve helped businesses/individuals turn ideas into digital experiences that feels easy.',
    toolsLabel: 'I currently work more with',
    rightCopy:
      'I care about how a product looks, how it works, and what happens when real people use it.',
    cta: 'PUT ME TO WORK',
    portraitAlt: 'Anwurii, a product designer, looking straight at the camera',
  },

  ticker: ['PRODUCT THINKING', 'BUILDING', 'MOBILE DESIGN', 'WEBSITE DESIGN'],

  work: {
    heading: 'SELECTED WORK',
    /*
     * Matched one-to-one against the publicly listed projects at
     * behance.net/anwurii. Titles, URLs and tags are copied from there;
     * nothing is paraphrased or invented. The Behance projects carry no
     * written description — see ASSET-CHECKLIST.md.
     */
    projects: [
      {
        id: 'senta-web',
        slug: 'senta-website',
        title: 'Senta Web Design',
        behanceTitle: 'SENTA: FINTECH WEBSITE',
        behanceUrl: 'https://www.behance.net/gallery/235350297/SENTA-FINTECH-WEBSITE',
        tags: ['Figma', 'Photoshop', 'Product Design', 'UI/UX', 'Web Design', 'Fintech', 'Landing page'],
        image: '/images/work/senta-web-design.jpg',
        alt: 'Senta web design — a board of light website screens and components',
      },
      {
        id: 'senta-app',
        slug: 'senta-app',
        title: 'Senta',
        behanceTitle: 'SENTA: FINTECH BANK MOBILE APP & BRANDING',
        behanceUrl:
          'https://www.behance.net/gallery/230178337/SENTA-FINTECH-BANK-MOBILE-APP-BRANDING',
        tags: ['Figma', 'Photoshop', 'Illustrator', 'Branding', 'Product Design', 'UI/UX', 'Fintech', 'Mobile app'],
        image: '/images/work/senta-app.jpg',
        alt: 'Senta mobile app — a hand holding a phone showing a balance screen on a purple backdrop',
      },
      {
        id: 'eventro',
        slug: 'eventro',
        title: 'Eventro',
        behanceTitle: 'EVENTRO: EVENT MOBILE APP DESIGN',
        behanceUrl: 'https://www.behance.net/gallery/231055455/EVENTRO-EVENT-MOBILE-APP-DESIGN',
        tags: ['Figma', 'Photoshop', 'Branding', 'Product Design', 'UI/UX', 'Mobile app', 'Booking'],
        image: '/images/work/eventro.jpg',
        alt: 'Eventro — a hand holding a phone showing an events app over the Eventro wordmark',
      },
      {
        id: 'kariiya',
        slug: 'kariiya',
        title: 'Kariiya',
        behanceTitle: 'KARIIYA: AI SAAS WEBSITE DESIGN',
        behanceUrl: 'https://www.behance.net/gallery/242830513/KARIIYA-AI-SAAS-WEBSITE-DESIGN',
        tags: ['Figma', 'Product Design', 'UI/UX', 'Web Design', 'SaaS', 'Landing page'],
        image: '/images/work/kariya-placeholder.svg',
        alt: 'Placeholder — Kariiya artwork has not been supplied yet',
        placeholder: true,
      },
    ] satisfies Project[],
  },

  /*
   * Selected experience.
   *
   * Transcribed from the supplied experience reference (default + two hover
   * states). Dates are the ones given with that design and deliberately
   * override anything earlier. Only the two confirmed rows are listed.
   *
   * Each row previews an existing Selected Work case study; the slugs and
   * artwork below are the same ones `work.projects` uses, so no route or
   * image here is new.
   */
  experience: {
    label: 'Selected experience',
    resumeLabel: 'View full resume here',
    /** Two lines, as the reference sets it. */
    heading: ['A TRACK RECORD', 'OF EXPERIENCE'],
    columns: ['COMPANY', 'ROLE', 'TIMELINE', 'CONTRIBUTION'],
    /** Shown beside the preview where there is no hover (touch). */
    previewCta: 'View case study',
    rows: [
      {
        id: 'senta',
        company: 'Senta Finance',
        role: 'Senior Product Designer',
        timeline: 'May 2025 - Present',
        contribution:
          'Redesigned multi-market onboarding and KYC to improve clarity and trust.',
        caseStudySlug: 'senta-app',
        previewImage: '/images/work/senta-app.jpg',
        previewAlt: 'Senta — a hand holding a phone showing a balance screen on a purple backdrop',
        previewLeft: '62.5%',
      },
      {
        id: 'kariiya',
        /* "Kariiya" is the spelling used by the project itself, by the
           Behance gallery and by the experience reference. */
        company: 'Kariiya',
        role: 'Product Designer',
        timeline: 'Oct 2025',
        contribution:
          'Designed the zero-to-one UX for an AI job-search agent, defining the core interaction model and prototypes.',
        caseStudySlug: 'kariiya',
        /* The real Kariiya artwork has still not been supplied, so this is
           the same stand-in the Selected Work tile uses. See
           ASSET-CHECKLIST.md. */
        previewImage: '/images/work/kariya-placeholder.svg',
        previewAlt: 'Placeholder — Kariiya artwork has not been supplied yet',
        previewIsPlaceholder: true,
        previewLeft: '68.85%',
      },
    ] satisfies ExperienceRow[],
  },

  quote: {
    text: '“DESIGN IS HOW IT WORKS.”',
    attribution: '~ Steve Jobs',
  },

  faq: {
    heading: ['BEFORE', 'YOU', 'ASK…'],
    cta: 'PUT ME TO WORK',
    items: [
      {
        n: '01',
        q: 'SO, WHAT DO YOU ACTUALLY DO?',
        a: 'I turn “we have an idea” into “this makes sense.” That means figuring out the experience, designing the interface, and paying attention to all the little things people notice when they go wrong.',
      },
      {
        n: '02',
        q: 'HOW SOON ARE YOU READY TO START?',
        a: 'Yesterday',
      },
      {
        n: '03',
        q: 'HOW DO WE GET YOUR BEST WORK?',
        a: 'Give me context, honest feedback, and a clear goal. Tell me what feels off and why, I enjoy working through the answer together.',
      },
      {
        n: '04',
        q: 'WHAT IF WE DISAGREE ON A DESIGN?',
        a: 'Let’s put both ideas on the table. I’ll explain my reasoning, listen to yours, and help us find out what works.',
      },
      {
        n: '05',
        q: 'HOW DO WE START?',
        a: 'Tell me what you have in mind and when you need it. We’ll figure out the scope, timing, and whether we’re a good fit.',
      },
    ] satisfies FaqItem[],
  },

  closing: {
    heading: ['BETTER PRODUCTS BUILT', 'WITH ANWURII'],
    moreLabel: 'More of Anwurii here…',
    contactLabel: 'Write me here',
  },

  /** Supplied by the owner and confirmed reachable. */
  socials: [
    { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/anwurii-productdesigner/' },
    { id: 'twitter', label: 'X (Twitter)', href: 'https://x.com/Anwuriii' },
    { id: 'github', label: 'GitHub', href: 'https://github.com/Anwurii' },
    { id: 'behance', label: 'Behance', href: 'https://www.behance.net/anwurii' },
  ] satisfies SocialLink[],

  footer: {
    /** Supplied wording, kept verbatim for this draft. */
    credit: 'Built with brain 🧠, heart 🫀 and claude 🤖',
    copyright: '© 2026 Anwurii, all rights reserved.',
  },

  images: {
    portrait: '/images/portrait.jpg',
    portraitIsPlaceholder: false,
  },
} as const
