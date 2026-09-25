import { Code2, Globe, PenLine, Play } from 'lucide-react'
import type { SVGProps } from 'react'
import type { SocialId } from '../data'
import { GitHubIcon, InstagramIcon, LinkedInIcon, XIcon } from './icons'

const map: Record<SocialId, (p: SVGProps<SVGSVGElement>) => React.ReactNode> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  x: XIcon,
  instagram: InstagramIcon,
  leetcode: (p) => <Code2 {...p} />,
  medium: (p) => <PenLine {...p} />,
  devto: (p) => <PenLine {...p} />,
  blog: (p) => <PenLine {...p} />,
  youtube: (p) => <Play {...p} />,
  website: (p) => <Globe {...p} />,
}

export function SocialIcon({ id, ...props }: { id: SocialId } & SVGProps<SVGSVGElement>) {
  const Icon = map[id] ?? map.website
  return <Icon aria-hidden {...props} />
}

/** "https://www.linkedin.com/in/x" -> "linkedin.com/in/x" */
export const prettyUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
