# AmmarOS — Developer Portfolio

An immersive developer portfolio for **Muhammad Ammar Asad** that boots into a personalized operating-system-inspired workspace. The site combines an authentic boot sequence, a movable desktop, independent native applications, and a VS Code-style portfolio editor.

## Experience

- GRUB-inspired bootloader with keyboard-selectable Windows and macOS experiences
- Fully tailored Windows desktop with Start menu, taskbar, Explorer, and native window chrome
- Fully tailored macOS desktop with its own wallpaper, menu bar, Dock, Launchpad, Spotlight, Finder, native context menus, traffic-light controls, and zsh terminal
- Platform-specific loading states, shortcut layouts, persistent icon positions, and marquee selection
- Central **Explorer/Finder** that remains open while launching independent applications
- Native Projects, Skill Matrix, Resume, Contact, Terminal, and Profile windows
- VS Code-inspired editor with file navigation, tabs, command palette, and integrated terminal
- Personalized Developer Zone with focus sessions, resilience, noise shielding, and workspace intent
- Searchable Start menu, live clock, calendar, taskbar state, social previews, and context menus
- High-resolution in-app résumé preview with the original PDF available separately
- Lightweight mobile portfolio that avoids forcing the desktop metaphor onto small screens
- Persistent tab, theme, and desktop icon state
- Reduced-motion handling, keyboard support, focus management, and accessible labels

## Technology

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Framer Motion
- Lucide React

## Local development

```bash
npm install
npm run dev
```

Create a production build:

```bash
npm run build
```

Run static checks:

```bash
npm run lint
```

## Project structure

```text
src/
├── components/
│   ├── BootSequence.tsx
│   ├── DesktopShell.tsx
│   ├── DesktopShortcuts.tsx
│   ├── NativeDesktopApps.tsx
│   ├── IDEWorkbench.tsx
│   ├── ContentRenderer.tsx
│   └── MobilePortfolio.tsx
├── data/
│   ├── nativeApps.ts
│   └── portfolio.ts
├── App.tsx
└── index.css
```

## Content

Portfolio data is centralized in `src/data/portfolio.ts`. Native application metadata lives in `src/data/nativeApps.ts`. Résumé files and visual assets are served from `public/`.

## Deployment

The project is configured for Vercel. Every pull request is validated by the included GitHub Actions workflow before merge.
