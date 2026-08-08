import type { LucideIcon } from 'lucide-react'
import { Braces, CircleUserRound, FileText, FolderGit2, Mail, TerminalSquare } from 'lucide-react'

export type NativeAppId = 'projects' | 'terminal' | 'resume' | 'about' | 'skills' | 'contact'

export const nativeAppMeta: Record<NativeAppId, { label: string; icon: LucideIcon }> = {
  projects: { label: 'Explorer', icon: FolderGit2 },
  terminal: { label: 'Terminal', icon: TerminalSquare },
  resume: { label: 'Resume', icon: FileText },
  about: { label: 'About Ammar', icon: CircleUserRound },
  skills: { label: 'Skill Matrix', icon: Braces },
  contact: { label: 'Contact', icon: Mail },
}
