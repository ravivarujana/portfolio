import data from './portfolio.json'

export type DetailBlock = {
  heading: string
  body?: string
  points?: string[]
  code?: { lang?: string; content: string }
}

export type CaseStudy = {
  id: string
  tag: string
  title: string
  summary: string
  featured?: boolean
  metric?: { value: string; label: string }
  flow: string[]
  stack: string[]
  details: DetailBlock[]
}

export type SocialId = 'github' | 'linkedin' | 'x' | 'instagram' | 'leetcode' | 'medium' | 'devto' | 'youtube' | 'website' | 'blog'

export type Social = {
  id: SocialId
  label: string
  url: string
  /** Also show as a button in the hero */
  hero?: boolean
}

export type Photo = {
  /** Object key relative to photography.baseUrl, or a full URL */
  src: string
  alt: string
  width: number
  height: number
  caption?: string
  location?: string
  camera?: string
}

export type Portfolio = {
  meta: { siteUrl: string; title: string; description: string }
  profile: {
    name: string
    handle: string
    role: string
    rolePrefix: string
    currentTitle: string
    currentCompany: string
    location: string
    timezone: string
    yearsOfExperience: string
    intro: string
    focus: string[]
    openTo: string
    email: string
    phone: string
    resumeUrl: string
  }
  socials: Social[]
  metrics: { label: string; value: string; suffix: string; note: string }[]
  about: { title: string; paragraphs: string[]; focus: { title: string; text: string }[] }
  experience: {
    company: string
    role: string
    start: string
    end: string
    location: string
    current: boolean
    points: string[]
    stack: string[]
  }[]
  caseStudies: CaseStudy[]
  skills: { group: string; items: string[]; key: string[] }[]
  learning: {
    title: string
    intro: string
    tracks: { title: string; text: string; builds_on: string; tags: string[] }[]
  }
  photography: {
    title: string
    intro: string
    /** Public R2 bucket URL or custom domain, e.g. https://photos.example.com */
    baseUrl: string
    /** Use Cloudflare Image Transformations (/cdn-cgi/image/...) for responsive sizes */
    cloudflareResize: boolean
    photos: Photo[]
  }
  contact: { title: string; highlight: string; note: string }
}

export const portfolio = data as Portfolio

/** Social links that have a URL filled in. */
export const socials = portfolio.socials.filter((s) => s.url.trim() !== '')
export const social = (id: SocialId) => socials.find((s) => s.id === id)
