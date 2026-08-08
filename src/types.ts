export type PortfolioFile = {
  id: string
  name: string
  path: string
  language: 'markdown' | 'typescript' | 'json' | 'pdf'
  group: 'root' | 'about' | 'projects' | 'skills'
  accent: string
}

export type DesktopPlatform = 'windows' | 'macos'

export type BootChoice = DesktopPlatform | 'safe' | 'easter'

export type AppPhase = 'boot' | 'loading' | 'desktop' | 'ide' | 'safe' | 'easter'
