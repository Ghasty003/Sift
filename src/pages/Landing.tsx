import { useState } from "react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { motion, animate } from "motion/react";
import { getAvatarColor, getInitials } from "../data";
import {
  BookmarkIcon,
  TagIcon,
  FolderIcon,
  SearchIcon,
  ChromeIcon,
  SmartphoneIcon,
  StarIcon,
  EditIcon,
  InboxIcon,
} from "../icons";

/* ---------- shared: scroll reveal ---------- */

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: delay / 1000, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- shared: count-up number ---------- */

function Counter({ value, delay = 0 }: { value: number; delay?: number }) {
  const [display, setDisplay] = useState(0);
  return (
    <motion.span
      viewport={{ once: true, amount: 0.6 }}
      onViewportEnter={() => {
        const controls = animate(0, value, {
          duration: 1,
          delay: delay / 1000,
          ease: "easeOut",
          onUpdate: (v) => setDisplay(Math.round(v)),
        });
        return () => controls.stop();
      }}
    >
      {display}
    </motion.span>
  );
}

/* ---------- shared: logo ---------- */

function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <div
      className="rounded-lg bg-primary flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.55}
        height={size * 0.55}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 6h16M4 12h8m-8 6h6" />
      </svg>
    </div>
  );
}

/* ---------- nav ---------- */

function Nav() {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <LogoMark />
          <span className="text-base font-bold tracking-tight text-foreground">
            Sift
          </span>
        </div>
        <nav className="hidden sm:flex items-center gap-6">
          <a
            href="#how-it-works"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            How it works
          </a>
          <a
            href="#features"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
        </nav>
        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            to="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="group flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Get started
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ---------- hero product preview ---------- */

function AppPreview() {
  const bookmarks = [
    {
      name: "Dan Abramov",
      handle: "@dan_abramov",
      text: "TIL you can use structuredClone() instead of JSON.parse(JSON.stringify()). No weird edge cases with dates or undefined.",
      tags: ["javascript", "til"],
      favorite: true,
      hasNote: false,
    },
    {
      name: "Rauno Freiberg",
      handle: "@raunofreiberg",
      text: "This thread on optical alignment vs. mathematical centering finally made spacing click for me.",
      tags: ["design", "ui"],
      favorite: false,
      hasNote: true,
    },
    {
      name: "Lenny Rachitsky",
      handle: "@lennysan",
      text: "Best breakdown of usage-based pricing psychology I've read. Bookmarking for the next pricing meeting.",
      tags: ["startups", "pricing"],
      favorite: false,
      hasNote: false,
    },
  ];

  const collections = [
    { name: "Engineering", count: 124 },
    { name: "Design Inspo", count: 87 },
    { name: "Startup Ideas", count: 41 },
  ];

  return (
    <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
      <motion.div
        className="min-w-170 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-secondary/40">
          <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-300" />
          <span className="ml-3 text-xs text-muted-foreground font-mono">
            sift.app/inbox
          </span>
        </div>

        <div className="flex h-100">
          {/* sidebar */}
          <div className="w-48 shrink-0 border-r border-border bg-secondary/20 p-3 space-y-4">
            <div className="flex items-center gap-2 px-1 mb-2">
              <LogoMark size={18} />
              <span className="text-xs font-bold text-foreground">Sift</span>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                <InboxIcon size={13} />
                Inbox
                <span className="ml-auto text-[10px] bg-primary/20 px-1.5 rounded-full">
                  12
                </span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-muted-foreground text-xs">
                <StarIcon size={13} />
                Favorites
              </div>
            </div>
            <div>
              <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Collections
              </p>
              <div className="space-y-0.5">
                {collections.map((c) => (
                  <div
                    key={c.name}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-muted-foreground text-xs"
                  >
                    <FolderIcon size={12} />
                    <span className="truncate flex-1">{c.name}</span>
                    <span className="text-[10px] text-muted-foreground/70 font-mono">
                      {c.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* main pane */}
          <div className="flex-1 p-4 overflow-hidden bg-background">
            <div className="flex items-center gap-2 px-3 py-2 mb-4 border border-border rounded-lg bg-card text-xs text-muted-foreground">
              <SearchIcon size={13} />
              pricing psychology
              <kbd className="ml-auto text-[10px] border border-border rounded px-1 font-mono">
                ⌘K
              </kbd>
            </div>

            <div className="space-y-3">
              {bookmarks.map((b, i) => (
                <motion.div
                  key={i}
                  className="bg-card border border-border rounded-lg p-3 shadow-sm"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] text-white font-semibold shrink-0"
                      style={{ backgroundColor: getAvatarColor(b.handle) }}
                    >
                      {getInitials(b.name)}
                    </div>
                    <span className="text-xs font-medium text-foreground">
                      {b.name}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {b.handle}
                    </span>
                    {b.favorite && (
                      <StarIcon
                        size={11}
                        filled
                        className="ml-auto text-amber-400"
                      />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                    {b.text}
                  </p>
                  <div className="flex items-center gap-1.5">
                    {b.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-full"
                      >
                        #{t}
                      </span>
                    ))}
                    {b.hasNote && (
                      <span className="ml-auto flex items-center gap-1 text-[10px] text-primary">
                        <EditIcon size={10} />
                        note
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------- transformation: before -> after ---------- */

function BeforePile() {
  const rows = [
    "started a thread about...",
    "this is so useful, saving for...",
    "wait what was this about again",
    "someone posted a great...",
    "need to find this later",
    "bookmarked 3 weeks ago",
    "that one thread about css",
    "can't remember why I saved this",
    "will read this eventually",
    "important?? maybe",
  ];
  return (
    <div className="relative h-72 bg-secondary/30 border border-border rounded-2xl p-5 overflow-hidden">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        847 saved posts
      </p>
      <div className="space-y-2 opacity-70">
        {rows.map((r, i) => (
          <motion.div
            key={i}
            className="text-xs text-muted-foreground bg-card border border-border rounded-md px-2.5 py-1.5 truncate"
            initial={{ opacity: 0 }}
            whileInView={{
              opacity: 1,
              rotate: (i % 2 === 0 ? -0.6 : 0.6) * ((i % 3) + 1),
            }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
          >
            {r}
          </motion.div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-secondary/30 to-transparent" />
    </div>
  );
}

function AfterSequence() {
  const collections = [
    { label: "Engineering", count: 124 },
    { label: "Design", count: 87 },
    { label: "AI", count: 53 },
  ];

  return (
    <div className="h-72 bg-card border border-border rounded-2xl p-5 flex flex-col">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Organized &amp; searchable
      </p>

      <div className="space-y-1.5 mb-3">
        {collections.map((c, i) => (
          <motion.div
            key={c.label}
            className="flex items-center gap-2.5 px-3 py-2 bg-secondary/40 rounded-lg text-sm"
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.12 }}
          >
            <FolderIcon size={13} className="text-primary" />
            <span className="text-foreground">{c.label}</span>
            <span className="ml-auto text-xs text-muted-foreground font-mono">
              {c.count}
            </span>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-xs text-muted-foreground mb-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <SearchIcon size={13} />
        that css thread
      </motion.div>

      <motion.div
        className="flex items-center gap-2 bg-secondary/40 rounded-lg p-2.5"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: 0.75, ease: "backOut" }}
      >
        <BookmarkIcon size={13} className="text-primary shrink-0" />
        <div className="min-w-0">
          <p className="text-xs text-foreground truncate">
            Container queries finally make sense
          </p>
          <p className="text-[10px] text-muted-foreground truncate">
            #css · Design
          </p>
        </div>
      </motion.div>

      <div className="flex gap-1.5 mt-auto pt-3">
        {["css", "design-systems", "pricing"].map((t) => (
          <span
            key={t}
            className="text-[10px] font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-full"
          >
            #{t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- library showcase (signup motivation) ---------- */

function LibraryPanel({ compact = false }: { compact?: boolean }) {
  const collections = [
    { name: "Engineering", count: 124 },
    { name: "Design", count: 87 },
    { name: "AI", count: 53 },
    { name: "Startup Ideas", count: 41 },
    { name: "Reading List", count: 76 },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl shadow-xl p-6 max-w-sm w-full">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Your library
      </p>
      <div className="space-y-1 mb-5">
        {collections.map((c, i) => (
          <Reveal key={c.name} delay={i * 70}>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-2.5">
                <FolderIcon size={13} className="text-primary" />
                <span className="text-sm text-foreground">{c.name}</span>
              </div>
              <span className="text-sm font-mono text-muted-foreground tabular-nums">
                <Counter value={c.count} delay={i * 70 + 150} />
              </span>
            </div>
          </Reveal>
        ))}
      </div>
      {!compact && (
        <div className="flex items-center gap-2.5 px-3 py-2.5 border border-border rounded-lg text-sm text-muted-foreground bg-background">
          <SearchIcon size={14} />
          Search your bookmarks...
        </div>
      )}
    </div>
  );
}

function LibraryShowcase() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20 sm:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
            Your library
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4">
            Stop saving things
            <br />
            you'll never find again.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mb-8">
            Every post you've ever saved, sorted into a library you actually
            want to open — not another list that keeps growing until you give up
            on it.
          </p>
          <Link
            to="/signup"
            className="group inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Get started free
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </Reveal>
        <Reveal delay={120}>
          <LibraryPanel />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- feature row + visuals ---------- */

function FeatureRow({
  eyebrow,
  title,
  description,
  visual,
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  visual: ReactNode;
  reverse?: boolean;
}) {
  return (
    <Reveal>
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${
          reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            {eyebrow}
          </p>
          <h3 className="text-2xl font-bold text-foreground mb-3">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            {description}
          </p>
        </div>
        <div>{visual}</div>
      </div>
    </Reveal>
  );
}

function OrganizeVisual() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 max-w-sm shadow-sm">
      <motion.div
        className="flex items-center gap-2 mb-2 bg-secondary/40 rounded-lg px-2.5 py-2"
        initial={{ opacity: 0, y: -8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <BookmarkIcon size={12} className="text-muted-foreground shrink-0" />
        <span className="text-xs text-muted-foreground truncate">
          Untitled thread on React Server Components
        </span>
      </motion.div>
      <motion.div
        className="flex justify-center my-1 text-muted-foreground text-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        ↓
      </motion.div>
      <motion.div
        className="flex items-center gap-2 px-2.5 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-medium w-fit mx-auto mb-3"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.35, ease: "backOut" }}
      >
        <FolderIcon size={12} />
        Engineering
      </motion.div>
      <div className="flex gap-1.5 justify-center">
        <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-full">
          #react
        </span>
        <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-full">
          #architecture
        </span>
      </div>
    </div>
  );
}

function FindVisual() {
  const results = [
    {
      icon: <BookmarkIcon size={13} />,
      label: "Optical alignment vs centering",
      sub: "Rauno Freiberg",
    },
    { icon: <TagIcon size={13} />, label: "#design" },
    { icon: <FolderIcon size={13} />, label: "Design Inspo" },
  ];
  return (
    <div className="bg-card border border-border rounded-xl shadow-sm max-w-sm overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <SearchIcon size={14} className="text-muted-foreground shrink-0" />
        <motion.span
          className="text-sm text-foreground inline-block overflow-hidden whitespace-nowrap"
          initial={{ width: 0 }}
          whileInView={{ width: "auto" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          alignment
        </motion.span>
      </div>
      {results.map((r, i) => (
        <motion.div
          key={i}
          className={`flex items-center gap-3 px-4 py-2.5 text-sm ${
            i < results.length - 1 ? "border-b border-border" : ""
          }`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 + i * 0.12, duration: 0.3 }}
        >
          <span className="text-muted-foreground shrink-0">{r.icon}</span>
          <div className="min-w-0">
            <p className="text-foreground truncate">{r.label}</p>
            {r.sub && (
              <p className="text-xs text-muted-foreground truncate">{r.sub}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function RememberVisual() {
  return (
    <motion.div
      className="bg-card border border-border rounded-xl p-4 max-w-sm shadow-sm"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] text-white font-semibold shrink-0"
          style={{ backgroundColor: getAvatarColor("@rauchg") }}
        >
          GR
        </div>
        <span className="text-xs font-medium text-foreground">
          Guillermo Rauch
        </span>
        <span className="text-xs text-muted-foreground font-mono">@rauchg</span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3">
        Streaming SSR is underrated. Most apps ship way more JS than they need
        to.
      </p>
      <div className="flex gap-2 items-start bg-secondary/40 rounded-lg p-2.5">
        <EditIcon size={13} className="text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-foreground leading-relaxed">
          Relevant for the dashboard rewrite — revisit before sprint planning.
        </p>
      </div>
    </motion.div>
  );
}

function CaptureVisual() {
  return (
    <div className="grid grid-cols-2 gap-3 max-w-sm">
      <motion.div
        className="bg-card border border-border rounded-xl p-4 shadow-sm"
        whileHover={{ y: -2 }}
      >
        <ChromeIcon size={18} className="text-muted-foreground mb-2" />
        <p className="text-xs font-medium text-foreground mb-1">
          Browser extension
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          One click, straight from X.
        </p>
      </motion.div>
      <motion.div
        className="bg-card border border-border rounded-xl p-4 shadow-sm"
        whileHover={{ y: -2 }}
      >
        <SmartphoneIcon size={18} className="text-muted-foreground mb-2" />
        <p className="text-xs font-medium text-foreground mb-1">Share Sheet</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Save from the X app on iPhone.
        </p>
      </motion.div>
    </div>
  );
}

/* ---------- use cases ---------- */

function UseCaseCard({
  title,
  description,
  delay,
}: {
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <motion.div
        className="bg-card border border-border rounded-xl p-5 h-full"
        whileHover={{ y: -2 }}
      >
        <p className="text-sm font-semibold text-foreground mb-1.5">{title}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </motion.div>
    </Reveal>
  );
}

/* ---------- page ---------- */

export default function Landing() {
  const useCases = [
    {
      title: "Developers",
      description: "Save that debugging trick you know you'll need again.",
    },
    {
      title: "Designers",
      description:
        "Keep references, UI inspiration, and design threads organized.",
    },
    {
      title: "Researchers",
      description: "Build a searchable library of useful threads and ideas.",
    },
    {
      title: "Students",
      description:
        "Turn useful explanations into a personal reference library.",
    },
    {
      title: "Founders",
      description:
        "Keep market research, product ideas, and useful threads in one place.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-16 sm:pt-24 pb-14 text-center">
        <Reveal>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground leading-[1.05] mb-6">
            Your X bookmarks
            <br />
            deserve better.
          </h1>
        </Reveal>
        <Reveal delay={80}>
          <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto mb-9 leading-relaxed">
            You saved it for a reason. Sift turns your endless pile of bookmarks
            into a personal library you can actually search, organize, and
            revisit.
          </p>
        </Reveal>
        <Reveal delay={160}>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/signup"
              className="px-5 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Get started free
            </Link>
            <a
              href="#how-it-works"
              className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              See how it works
            </a>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Free to get started · Organize your first bookmark in under a
            minute.
          </p>
        </Reveal>
      </section>

      {/* Product preview */}
      <section className="max-w-4xl mx-auto px-6 pb-24 sm:pb-28">
        <AppPreview />
      </section>

      {/* Problem -> transformation */}
      <section className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
        <Reveal>
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              You saved it. You just can't find it.
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              X's bookmarks are one long list that only grows. Sift turns that
              pile into something you can actually navigate.
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
          <BeforePile />
          <AfterSequence />
        </div>
      </section>

      {/* Library showcase — the signup-motivation moment */}
      <LibraryShowcase />

      {/* How it works */}
      <section
        id="how-it-works"
        className="max-w-3xl mx-auto px-6 py-16 sm:py-24"
      >
        <Reveal>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-14">
            How it works
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {[
            {
              icon: <BookmarkIcon size={18} />,
              title: "See a post worth keeping",
              description: "Click the Sift button under any post on X.",
            },
            {
              icon: <InboxIcon size={18} />,
              title: "It lands in your Inbox",
              description:
                "Nothing gets lost — every save starts in one place.",
            },
            {
              icon: <TagIcon size={18} />,
              title: "File it, tag it, note it",
              description: "A few seconds now saves you from a search later.",
            },
          ].map((step, i) => (
            <Reveal key={step.title} delay={i * 100}>
              <div className="text-center">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1.5">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-55 mx-auto">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Core features */}
      <section
        id="features"
        className="max-w-4xl mx-auto px-6 py-16 sm:py-24 space-y-20 sm:space-y-28"
      >
        <FeatureRow
          eyebrow="Organize"
          title="Turn bookmarks into collections"
          description="Group related saves the way you actually think about them — by project, topic, or whatever makes sense to you."
          visual={<OrganizeVisual />}
        />
        <FeatureRow
          eyebrow="Find"
          title="Search through everything you've saved"
          description="One search bar covers bookmarks, tags, and collections. Press ⌘K from anywhere in Sift."
          visual={<FindVisual />}
          reverse
        />
        <FeatureRow
          eyebrow="Remember"
          title="Add context before you forget it"
          description="A quick note on why you saved something is worth more than the bookmark itself, six months from now."
          visual={<RememberVisual />}
        />
        <FeatureRow
          eyebrow="Capture"
          title="Save from wherever you're scrolling"
          description="The browser extension saves posts from X in one click. The Share Sheet does the same from your phone."
          visual={<CaptureVisual />}
          reverse
        />
      </section>

      {/* Use cases */}
      <section className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-3">
            For people who save a lot
          </h2>
          <p className="text-sm text-muted-foreground text-center max-w-md mx-auto mb-12">
            If your bookmarks are already a mess, Sift was built for you.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {useCases.map((uc, i) => (
            <UseCaseCard key={uc.title} {...uc} delay={i * 60} />
          ))}
        </div>
      </section>

      {/* Final CTA — a destination, not a repeat of the hero */}
      <section className="max-w-4xl mx-auto px-6 py-20 sm:py-28">
        <div className="bg-secondary/30 border border-border rounded-3xl p-8 sm:p-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center overflow-hidden">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 leading-tight">
              Your bookmarks are already full of good ideas.
            </h2>
            <p className="text-base text-muted-foreground mb-8">
              Give them somewhere to live.
            </p>
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Get started free
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </Reveal>
          <Reveal delay={120}>
            <LibraryPanel compact />
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogoMark size={20} />
            <span className="text-sm font-semibold text-foreground">Sift</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Sift.
          </p>
        </div>
      </footer>
    </div>
  );
}
