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
  /**
   * Short caption shown beside the project name. Composed only from that
   * project's own Behance tags — no year, because none is published.
   */
  caption: string
  /**
   * object-position for the preview, chosen per artwork so the consistent
   * container never crops a screen or a wordmark that matters.
   */
  objectPosition: string
  /** true when `image` is a stand-in, not the real artwork */
  placeholder?: boolean
}

export interface ExperienceEntry {
  id: string
  company: string
  /**
   * Full-time · Part-time · Contract · Freelance. Supplied by the owner:
   * the design reference records a job ROLE instead, and no resume exists.
   */
  employment: Unconfirmed<string>
  /** Years only, no months — derived from the timelines in the reference. */
  years: string
  /** One plain sentence, transcribed from the supplied design reference. */
  summary: string
  /** Internal case study, only where a working route exists. */
  caseStudySlug: Unconfirmed<string>
}

export interface ProcessStage {
  n: string
  title: string
  body: string
}

export interface IntroShot {
  src: string
  alt: string
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

  /*
   * Opening intro.
   *
   * The headline is supplied; the beats are its own words, which is how the
   * reference cuts them. The four photographs are the owner's own supplied
   * assets, already black and white, shown full-bleed between the words.
   */
  intro: {
    headline: 'Need money for my Porsche',
    beats: ['NEED', 'MONEY', 'FOR', 'MY', 'PORSCHE'],
    skip: 'Skip intro',
    shots: [
      { src: '/images/intro/porsche-garage.jpg', alt: '' },
      { src: '/images/intro/porsche-road.jpg', alt: '' },
      { src: '/images/intro/porsche-sea.jpg', alt: '' },
      { src: '/images/intro/porsche-passenger.jpg', alt: '' },
    ] satisfies IntroShot[],
  },

  ticker: ['PRODUCT THINKING', 'BUILDING', 'MOBILE DESIGN', 'WEBSITE DESIGN'],

  work: {
    heading: 'SELECTED WORK',
    /** Supplied with the brief, kept verbatim. */
    intro:
      'A few projects that show how I turn ideas and complex problems into clear, usable experiences.',
    /** Shown on the preview on touch and keyboard focus. */
    cta: 'View case study',
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
        caption: 'Fintech · Web design',
        /* keeps the title bar and the hero board; trims the part-cut cards along the bottom */
        objectPosition: '50% 42%',
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
        caption: 'Fintech · Mobile app and branding',
        /* the phone sits dead centre */
        objectPosition: '50% 50%',
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
        caption: 'Booking · Mobile app and branding',
        /* centred so both ends of the Eventro wordmark survive the side crop */
        objectPosition: '50% 50%',
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
        caption: 'AI SaaS · Web design',
        objectPosition: '50% 50%',
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
  /*
   * Selected experience.
   *
   * Every company, sentence and date comes from the supplied design
   * reference (design-reference/experience-section.png). Months are dropped
   * to years, as asked; nothing is paraphrased and nothing is added.
   *
   * The employment types were supplied separately by the owner — they are
   * in neither the reference nor any resume.
   */
  experience: {
    label: 'Selected experience',
    headline:
      '5+ years in product design, transitioned from marketing to product design.',
    cta: 'See more experience',
    resume: {
      title: 'Résumé',
      close: 'Close',
      download: 'Download résumé',
      open: 'Open PDF',
      /** Shown in place of the document until a file is supplied. */
      missing:
        'The résumé file has not been supplied yet. Drop a PDF into public/resume/ and set resumeUrl in src/data/site.ts.',
    },
    entries: [
      {
        id: 'senta',
        company: 'Senta Finance',
        employment: 'Full-time',
        years: '2025–Present',
        summary:
          'Redesigned multi-market onboarding and KYC to improve clarity and trust.',
        caseStudySlug: 'senta-app',
      },
      {
        id: 'jobtech',
        company: 'Jobtech Alliance',
        employment: 'Contract',
        years: '2025–2026',
        summary:
          'Led the visual redesign of Jobtech Alliance’s public website, translating the organization’s mission.',
        caseStudySlug: null,
      },
      {
        id: 'kariiya',
        company: 'Kariiya',
        employment: 'Contract',
        years: '2025',
        summary:
          'Designed the zero-to-one UX for an AI job-search agent, defining the core interaction model and prototypes.',
        caseStudySlug: 'kariiya',
      },
      {
        id: 'ask-gavyn',
        company: 'Ask Gavyn AI',
        employment: 'Part-time',
        years: '2025',
        summary:
          'Turned complex legal research into clear and conversational workflows.',
        caseStudySlug: null,
      },
      {
        id: 'nexumi',
        company: 'Nexumi',
        employment: 'Contract',
        years: '2024–2025',
        summary:
          'Unified multi-channel messaging through research and design systems.',
        caseStudySlug: null,
      },
    ] satisfies ExperienceEntry[],
  },

  /*
   * How I Work. Copy supplied verbatim with the brief; the headline keeps
   * its two-line arrangement, so the break is part of the data.
   */
  process: {
    heading: ['A CLEAR PATH FROM', 'IDEA TO LAUNCH.'],
    intro:
      'I start by understanding what you want to build and who it’s for. Explore ideas, design how it looks and works, and bring it to life.',
    stages: [
      {
        n: '01',
        title: 'Understand the idea',
        body: 'We talk about your goals, the problem you want to solve, and what a successful result would look like.',
      },
      {
        n: '02',
        title: 'Find the best approach',
        body: 'I explore different ways to solve the problem and map out the steps people will take to get things done.',
      },
      {
        n: '03',
        title: 'Design and try it out',
        body: 'I design the screens and create a working preview. People try it, and I use their feedback to make it clearer.',
      },
      {
        n: '04',
        title: 'Help bring it to life',
        body: 'I work with developers to build the designs and make sure everything works as planned.',
      },
    ] satisfies ProcessStage[],
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
