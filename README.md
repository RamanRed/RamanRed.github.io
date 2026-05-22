# 🤗 HuggingPortfolio — Next.js Developer Portfolio

> A dark-themed developer portfolio inspired by Hugging Face's UI, built with Next.js 14 (App Router), Tailwind CSS, and Framer Motion.

---

## 📁 Project Structure

```
portfolio/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── fonts/
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Models.tsx           ← GitHub repos & projects
│   ├── Datasets.tsx         ← About / Personal Info
│   ├── Spaces.tsx           ← Live deployments
│   ├── TokenModal.tsx       ← Contact / "Create Token" modal
│   ├── ResumeButton.tsx     ← Resume download
│   ├── PlatformLinks.tsx    ← All social/platform links
│   └── Footer.tsx
├── public/
│   └── resume.pdf           ← Place your resume here
├── lib/
│   └── data.ts              ← All your personal data lives here
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## 🎨 Theme — Dark Hugging Face

The color system mimics Hugging Face's dark interface with amber/yellow accents.

### `app/globals.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --hf-bg:          #0f0f0f;
  --hf-surface:     #161616;
  --hf-surface-2:   #1e1e1e;
  --hf-border:      #2a2a2a;
  --hf-accent:      #ff9d00;        /* HF amber */
  --hf-accent-soft: rgba(255,157,0,0.12);
  --hf-text:        #e8e8e8;
  --hf-muted:       #8a8a8a;
  --hf-tag-bg:      #1f2937;
  --hf-tag-text:    #93c5fd;
  --hf-green:       #22c55e;
  --hf-red:         #ef4444;
}

body {
  background-color: var(--hf-bg);
  color: var(--hf-text);
  font-family: 'DM Sans', sans-serif;
}

code, pre, .mono {
  font-family: 'Source Code Pro', monospace;
}

/* HF-style card */
.hf-card {
  background: var(--hf-surface);
  border: 1px solid var(--hf-border);
  border-radius: 12px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.hf-card:hover {
  border-color: var(--hf-accent);
  box-shadow: 0 0 0 1px var(--hf-accent), 0 8px 32px rgba(255,157,0,0.08);
}

/* HF pill tag */
.hf-tag {
  background: var(--hf-tag-bg);
  color: var(--hf-tag-text);
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 9999px;
  letter-spacing: 0.02em;
}

/* Amber button */
.hf-btn {
  background: var(--hf-accent);
  color: #000;
  font-weight: 700;
  border-radius: 8px;
  padding: 8px 18px;
  transition: opacity 0.15s;
}
.hf-btn:hover { opacity: 0.85; }
```

---

## ⚙️ Configuration Files

### `tailwind.config.ts`

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        hf: {
          bg:       '#0f0f0f',
          surface:  '#161616',
          surface2: '#1e1e1e',
          border:   '#2a2a2a',
          accent:   '#ff9d00',
          muted:    '#8a8a8a',
          green:    '#22c55e',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['Source Code Pro', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
```

### `next.config.ts`

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'github.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
}

export default nextConfig
```

---

## 🗂️ Data Layer

### `lib/data.ts`

> **Replace everything in this file with your real information.**

```ts
// ============================================================
//  YOUR PERSONAL DATA — edit everything here
// ============================================================

export const profile = {
  name:       "Your Name",
  username:   "yourusername",
  title:      "ML Engineer · Full Stack Dev",
  bio:        "Building intelligent systems at the intersection of data and deployment. Open to collaboration.",
  avatar:     "/avatar.jpg",       // put your photo in /public
  location:   "Earth, Milky Way",
  resumeUrl:  "/resume.pdf",       // put your resume in /public
}

// ── MODELS tab ── GitHub repos & personal projects ──────────
export const models = [
  {
    id:          "my-cool-model",
    name:        "awesome-transformer",
    description: "Fine-tuned LLM for code generation with RLHF.",
    tags:        ["NLP", "PyTorch", "LLM"],
    stars:       124,
    language:    "Python",
    url:         "https://github.com/yourusername/awesome-transformer",
    updatedAt:   "2 days ago",
    isPrivate:   false,
  },
  {
    id:          "nextjs-saas",
    name:        "nextjs-saas-starter",
    description: "Production-ready SaaS boilerplate with auth, billing, and teams.",
    tags:        ["Next.js", "TypeScript", "Stripe"],
    stars:       87,
    language:    "TypeScript",
    url:         "https://github.com/yourusername/nextjs-saas-starter",
    updatedAt:   "1 week ago",
    isPrivate:   false,
  },
  // add more projects...
]

// ── DATASETS tab ── About you / personal info ────────────────
export const dataset = {
  name:        profile.name,
  description: "A human dataset — curated experiences, skills, and knowledge.",
  license:     "MIT (Open to Work)",
  size:        "∞ tokens",
  modalities:  ["Code", "Writing", "Design", "Research"],
  education: [
    { degree: "B.Sc. Computer Science", school: "Your University", year: "2022" },
  ],
  experience: [
    {
      role:    "Senior ML Engineer",
      company: "Some Company",
      period:  "2023 – Present",
      desc:    "Built and deployed NLP pipelines serving 10M+ requests/day.",
    },
    {
      role:    "Full Stack Developer",
      company: "Another Place",
      period:  "2021 – 2023",
      desc:    "Led frontend migration from CRA to Next.js, improving LCP by 60%.",
    },
  ],
  skills: {
    "Languages":   ["Python", "TypeScript", "Go", "Rust"],
    "ML / AI":     ["PyTorch", "HuggingFace", "LangChain", "ONNX"],
    "Web":         ["Next.js", "React", "Node.js", "tRPC"],
    "Infra":       ["Docker", "Kubernetes", "AWS", "Vercel"],
    "Databases":   ["PostgreSQL", "Redis", "Pinecone", "MongoDB"],
  },
}

// ── SPACES tab ── Live deployments ──────────────────────────
export const spaces = [
  {
    id:       "portfolio-live",
    name:     "portfolio-v2",
    desc:     "This portfolio — deployed on Vercel.",
    url:      "https://yourportfolio.vercel.app",
    status:   "running",   // "running" | "paused" | "building"
    runtime:  "Next.js · Vercel",
    emoji:    "🌐",
  },
  {
    id:       "ml-api",
    name:     "inference-api",
    desc:     "FastAPI inference server for my transformer models.",
    url:      "https://api.yourdomain.com",
    status:   "running",
    runtime:  "FastAPI · Railway",
    emoji:    "⚡",
  },
  {
    id:       "chatbot-demo",
    name:     "llm-chat-demo",
    desc:     "Interactive demo of my fine-tuned chat model.",
    url:      "https://chat.yourdomain.com",
    status:   "building",
    runtime:  "Gradio · HuggingFace Spaces",
    emoji:    "🤖",
  },
  // add more deployments...
]

// ── CONTACT ─ "Create Token" links ──────────────────────────
export const contactTokens = [
  { label: "Email",    value: "you@example.com",                    href: "mailto:you@example.com",             icon: "✉️" },
  { label: "Calendar", value: "Book a 30-min call",                 href: "https://cal.com/yourusername",        icon: "📅" },
  { label: "Twitter",  value: "@yourusername",                      href: "https://twitter.com/yourusername",   icon: "🐦" },
]

// ── PLATFORM LINKS ───────────────────────────────────────────
export const platforms = [
  { name: "GitHub",       url: "https://github.com/yourusername",                   icon: "github"   },
  { name: "LinkedIn",     url: "https://linkedin.com/in/yourusername",              icon: "linkedin" },
  { name: "HuggingFace",  url: "https://huggingface.co/yourusername",               icon: "hf"       },
  { name: "Twitter / X",  url: "https://twitter.com/yourusername",                  icon: "twitter"  },
  { name: "Kaggle",       url: "https://kaggle.com/yourusername",                   icon: "kaggle"   },
  { name: "Dev.to",       url: "https://dev.to/yourusername",                       icon: "devto"    },
  { name: "Medium",       url: "https://medium.com/@yourusername",                  icon: "medium"   },
  { name: "YouTube",      url: "https://youtube.com/@yourusername",                 icon: "youtube"  },
  { name: "Discord",      url: "https://discord.com/users/yoursnowflakeid",         icon: "discord"  },
]
```

---

## 🧩 Components

### `components/Navbar.tsx`

```tsx
"use client"
import { useState } from "react"
import Link from "next/link"
import { profile } from "@/lib/data"

const tabs = ["Models", "Datasets", "Spaces", "Community"]

export default function Navbar() {
  const [active, setActive] = useState("Models")

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--hf-border)] bg-[var(--hf-bg)]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-mono font-bold text-[var(--hf-accent)] text-lg">
          🤗 {profile.username}
        </Link>

        {/* HF-style tabs */}
        <div className="hidden md:flex items-center gap-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                active === tab
                  ? "bg-[var(--hf-accent-soft)] text-[var(--hf-accent)] border border-[var(--hf-accent)]/30"
                  : "text-[var(--hf-muted)] hover:text-[var(--hf-text)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* CTA */}
        <a href={profile.resumeUrl} download className="hf-btn text-sm hidden md:block">
          ↓ Resume
        </a>
      </div>
    </nav>
  )
}
```

---

### `components/Hero.tsx`

```tsx
import Image from "next/image"
import { profile } from "@/lib/data"
import PlatformLinks from "./PlatformLinks"
import TokenModal from "./TokenModal"

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16 flex flex-col md:flex-row gap-10 items-start">

      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-[var(--hf-accent)] shadow-lg shadow-[var(--hf-accent)]/20">
          <Image src={profile.avatar} alt={profile.name} width={112} height={112} className="object-cover" />
        </div>
        {/* online indicator */}
        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--hf-green)] rounded-full border-2 border-[var(--hf-bg)]" />
      </div>

      {/* Info */}
      <div className="flex-1 space-y-4">
        <div>
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="font-mono text-[var(--hf-accent)] text-sm mt-0.5">@{profile.username}</p>
        </div>

        <p className="text-[var(--hf-muted)] text-sm leading-relaxed max-w-xl">{profile.bio}</p>

        <div className="flex items-center gap-2 text-xs text-[var(--hf-muted)]">
          <span>📍 {profile.location}</span>
          <span>·</span>
          <span className="text-[var(--hf-green)]">● Open to work</span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-2">
          <TokenModal />
          <a href={profile.resumeUrl} download className="hf-btn text-sm">
            ↓ Download Resume
          </a>
        </div>

        {/* Platform links */}
        <PlatformLinks />
      </div>
    </section>
  )
}
```

---

### `components/Models.tsx`

```tsx
import Link from "next/link"
import { models } from "@/lib/data"

export default function Models() {
  return (
    <section className="max-w-6xl mx-auto px-4 pb-20">
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <span className="text-[var(--hf-accent)]">⬡</span> Models
        <span className="ml-auto text-xs text-[var(--hf-muted)] font-normal">{models.length} repositories</span>
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {models.map(m => (
          <Link key={m.id} href={m.url} target="_blank" rel="noopener"
            className="hf-card p-5 block group">

            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="font-mono font-semibold text-sm group-hover:text-[var(--hf-accent)] transition-colors">
                {m.isPrivate ? "🔒" : "📦"} {m.name}
              </span>
              <span className="flex items-center gap-1 text-xs text-[var(--hf-muted)]">
                ⭐ {m.stars}
              </span>
            </div>

            <p className="text-xs text-[var(--hf-muted)] leading-relaxed mb-3">{m.description}</p>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {m.tags.map(t => <span key={t} className="hf-tag">{t}</span>)}
            </div>

            <div className="flex items-center justify-between text-[10px] text-[var(--hf-muted)]">
              <span>● {m.language}</span>
              <span>Updated {m.updatedAt}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
```

---

### `components/Datasets.tsx`

```tsx
import { dataset } from "@/lib/data"

export default function Datasets() {
  return (
    <section className="max-w-6xl mx-auto px-4 pb-20">
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <span className="text-[var(--hf-accent)]">🗄</span> Datasets
        <span className="ml-2 hf-tag">About Me</span>
      </h2>

      {/* Dataset card header */}
      <div className="hf-card p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-start justify-between">
          <div>
            <h3 className="font-mono font-bold text-[var(--hf-accent)]">{dataset.name}/personal-dataset</h3>
            <p className="text-sm text-[var(--hf-muted)] mt-1">{dataset.description}</p>
          </div>
          <div className="text-xs text-[var(--hf-muted)] space-y-1 text-right">
            <div>License: <span className="text-[var(--hf-green)]">{dataset.license}</span></div>
            <div>Size: <span className="text-[var(--hf-text)]">{dataset.size}</span></div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-4">
          {dataset.modalities.map(m => <span key={m} className="hf-tag">{m}</span>)}
        </div>
      </div>

      {/* Skills */}
      <div className="hf-card p-6 mb-6">
        <h3 className="text-sm font-semibold mb-4 text-[var(--hf-accent)]">## Skills</h3>
        <div className="space-y-3">
          {Object.entries(dataset.skills).map(([cat, items]) => (
            <div key={cat} className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-[var(--hf-muted)] w-24 shrink-0">{cat}</span>
              <div className="flex flex-wrap gap-1.5">
                {items.map(s => <span key={s} className="hf-tag">{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="hf-card p-6 mb-6">
        <h3 className="text-sm font-semibold mb-4 text-[var(--hf-accent)]">## Experience</h3>
        <div className="space-y-5">
          {dataset.experience.map((e, i) => (
            <div key={i} className="border-l-2 border-[var(--hf-border)] pl-4">
              <div className="font-semibold text-sm">{e.role}</div>
              <div className="text-xs text-[var(--hf-accent)] mb-1">{e.company} · {e.period}</div>
              <p className="text-xs text-[var(--hf-muted)]">{e.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="hf-card p-6">
        <h3 className="text-sm font-semibold mb-4 text-[var(--hf-accent)]">## Education</h3>
        {dataset.education.map((e, i) => (
          <div key={i} className="text-sm">
            <span className="font-semibold">{e.degree}</span>
            <span className="text-[var(--hf-muted)]"> — {e.school} · {e.year}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
```

---

### `components/Spaces.tsx`

```tsx
import Link from "next/link"
import { spaces } from "@/lib/data"

const statusColor = {
  running:  "var(--hf-green)",
  paused:   "var(--hf-muted)",
  building: "#f59e0b",
}

export default function Spaces() {
  return (
    <section className="max-w-6xl mx-auto px-4 pb-20">
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <span className="text-[var(--hf-accent)]">🚀</span> Spaces
        <span className="ml-2 hf-tag">Live Deployments</span>
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        {spaces.map(s => (
          <Link key={s.id} href={s.url} target="_blank" rel="noopener"
            className="hf-card p-5 block group">

            <div className="text-3xl mb-3">{s.emoji}</div>
            <h3 className="font-mono font-semibold text-sm group-hover:text-[var(--hf-accent)] transition-colors mb-1">
              {s.name}
            </h3>
            <p className="text-xs text-[var(--hf-muted)] mb-4 leading-relaxed">{s.desc}</p>

            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[var(--hf-muted)]">{s.runtime}</span>
              <span className="flex items-center gap-1" style={{ color: statusColor[s.status] }}>
                ● {s.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
```

---

### `components/TokenModal.tsx`

```tsx
"use client"
import { useState } from "react"
import { contactTokens } from "@/lib/data"

export default function TokenModal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)} className="hf-btn text-sm">
        🔑 Create Token (Contact Me)
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div className="relative hf-card p-7 w-full max-w-md z-10"
            onClick={e => e.stopPropagation()}>

            <h2 className="font-mono font-bold text-[var(--hf-accent)] mb-1">New access token</h2>
            <p className="text-xs text-[var(--hf-muted)] mb-6">
              Select a channel to generate a communication token.
            </p>

            <div className="space-y-3">
              {contactTokens.map(t => (
                <a key={t.label} href={t.href} target="_blank" rel="noopener"
                  className="flex items-center gap-4 p-3 rounded-lg border border-[var(--hf-border)]
                             hover:border-[var(--hf-accent)] hover:bg-[var(--hf-accent-soft)] transition-all group">
                  <span className="text-xl">{t.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-[var(--hf-muted)]">{t.label}</div>
                    <div className="font-mono text-sm text-[var(--hf-text)] truncate group-hover:text-[var(--hf-accent)]">
                      {t.value}
                    </div>
                  </div>
                  <span className="text-[var(--hf-muted)] group-hover:text-[var(--hf-accent)]">↗</span>
                </a>
              ))}
            </div>

            <button onClick={() => setOpen(false)}
              className="mt-6 w-full py-2 rounded-lg border border-[var(--hf-border)]
                         text-sm text-[var(--hf-muted)] hover:text-[var(--hf-text)] transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}
```

---

### `components/PlatformLinks.tsx`

```tsx
import { platforms } from "@/lib/data"

const iconMap: Record<string, string> = {
  github:   "⬡",
  linkedin: "in",
  hf:       "🤗",
  twitter:  "𝕏",
  kaggle:   "🏆",
  devto:    "DEV",
  medium:   "M",
  youtube:  "▶",
  discord:  "💬",
}

export default function PlatformLinks() {
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {platforms.map(p => (
        <a key={p.name} href={p.url} target="_blank" rel="noopener"
          title={p.name}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                     border border-[var(--hf-border)] text-xs text-[var(--hf-muted)]
                     hover:border-[var(--hf-accent)] hover:text-[var(--hf-accent)]
                     transition-all font-mono">
          <span>{iconMap[p.icon] ?? "🔗"}</span>
          <span>{p.name}</span>
        </a>
      ))}
    </div>
  )
}
```

---

### `components/Footer.tsx`

```tsx
import { profile } from "@/lib/data"

export default function Footer() {
  return (
    <footer className="border-t border-[var(--hf-border)] py-8 text-center">
      <p className="text-xs text-[var(--hf-muted)] font-mono">
        © {new Date().getFullYear()} {profile.name} ·{" "}
        <span className="text-[var(--hf-accent)]">Built with 🤗 spirit</span>
      </p>
    </footer>
  )
}
```

---

## 🏠 App Entry Points

### `app/layout.tsx`

```tsx
import type { Metadata } from "next"
import "./globals.css"
import { profile } from "@/lib/data"

export const metadata: Metadata = {
  title:       `${profile.name} — Portfolio`,
  description: profile.bio,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
```

### `app/page.tsx`

```tsx
import Navbar   from "@/components/Navbar"
import Hero     from "@/components/Hero"
import Models   from "@/components/Models"
import Datasets from "@/components/Datasets"
import Spaces   from "@/components/Spaces"
import Footer   from "@/components/Footer"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Models />
        <Datasets />
        <Spaces />
      </main>
      <Footer />
    </>
  )
}
```

---

## 📦 Installation

```bash
# 1. Create project
npx create-next-app@latest portfolio --typescript --tailwind --app --src-dir=no --import-alias="@/*"
cd portfolio

# 2. Install dependencies
npm install framer-motion

# 3. Copy all files above into their respective paths

# 4. Add your assets
#    public/avatar.jpg   ← your photo
#    public/resume.pdf   ← your resume

# 5. Edit lib/data.ts with your real info

# 6. Run
npm run dev
```

---

## 🚀 Deploy to Vercel

```bash
# One-click deploy
npx vercel

# Or push to GitHub → import at vercel.com
```

---

## ✅ Feature Checklist

| Section | HF Equivalent | What it shows |
|---|---|---|
| **Navbar** | Top nav + tabs | Site navigation |
| **Hero** | Profile header | Name, bio, avatar, status |
| **Models** | Models tab | GitHub repos & projects |
| **Datasets** | Datasets tab | About you, skills, experience |
| **Spaces** | Spaces tab | Live deployments |
| **Token Modal** | "New token" dialog | Contact links |
| **Resume button** | Download button | PDF resume download |
| **Platform Links** | Social row | All your profile links |
| **Footer** | Footer | Copyright |

---

> **Tip:** Add `framer-motion` page transitions by wrapping each section in `<motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} />` for a polished feel.