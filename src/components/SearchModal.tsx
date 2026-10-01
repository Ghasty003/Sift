import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Page } from "../types";
import { ApiBookmark, ApiCollection, ApiTag } from "../types/api";
import { fetchBookmarksPage } from "../api/bookmarks";
import { MOTION, prefersReducedMotion } from "../lib/motion";
import {
  SearchIcon,
  XIcon,
  BookmarkIcon,
  FolderIcon,
  TagIcon,
  UserIcon,
  ClockIcon,
} from "../icons";

interface SearchModalProps {
  collections: ApiCollection[];
  allTags: ApiTag[];
  onClose: () => void;
  onNavigate: (
    page: Page,
    params?: { collectionId?: string; tag?: string },
  ) => void;
  onSearchAll: (query: string) => void;
}

type RowType =
  | "recent"
  | "bookmark"
  | "author"
  | "collection"
  | "tag"
  | "viewAll";

interface Row {
  id: string;
  type: RowType;
  section: string;
  title: string;
  subtitle?: string;
  onSelect: () => void;
}

const RECENT_KEY = "sift:recent-searches";
const MAX_RECENT = 5;

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed
          .filter((s): s is string => typeof s === "string")
          .slice(0, MAX_RECENT)
      : [];
  } catch {
    return [];
  }
}

function persistRecent(list: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    // Storage can be unavailable (private mode, quota) — recents are a
    // convenience, so failing silently is the right behavior.
  }
}

function highlight(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary/20 text-primary rounded-sm">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

const ROW_ICONS: Record<RowType, React.ReactNode> = {
  recent: <ClockIcon size={14} />,
  bookmark: <BookmarkIcon size={14} />,
  author: <UserIcon size={14} />,
  collection: <FolderIcon size={14} />,
  tag: <TagIcon size={14} />,
  viewAll: <SearchIcon size={14} />,
};

export default function SearchModal({
  collections,
  allTags,
  onClose,
  onNavigate,
  onSearchAll,
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [bookmarkResults, setBookmarkResults] = useState<ApiBookmark[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [recent, setRecent] = useState<string[]>(loadRecent);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestIdRef = useRef(0);
  const reduceMotion = prefersReducedMotion();

  useEffect(() => {
    inputRef.current?.focus();
    // Hand focus back to whatever opened the modal (the top bar button, or
    // the page body for ⌘K) once it closes.
    const previouslyFocused = document.activeElement as HTMLElement | null;
    return () => previouslyFocused?.focus?.();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const q = query.trim().toLowerCase();

  // Debounced backend search. Collections/tags are matched client-side
  // below since both lists are always fetched in full.
  useEffect(() => {
    if (!q) {
      setBookmarkResults([]);
      setIsSearching(false);
      setSearchError(false);
      return;
    }

    setIsSearching(true);
    setSearchError(false);
    const requestId = ++requestIdRef.current;

    const timeout = setTimeout(async () => {
      try {
        const page = await fetchBookmarksPage({ search: q, limit: 8 });
        if (requestId === requestIdRef.current) setBookmarkResults(page.items);
      } catch {
        if (requestId === requestIdRef.current) {
          setBookmarkResults([]);
          setSearchError(true);
        }
      } finally {
        if (requestId === requestIdRef.current) setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [q]);

  function saveRecent(text: string) {
    const next = [
      text,
      ...recent.filter((r) => r.toLowerCase() !== text.toLowerCase()),
    ].slice(0, MAX_RECENT);
    setRecent(next);
    persistRecent(next);
  }

  function clearRecent() {
    setRecent([]);
    persistRecent([]);
  }

  /* ---------- build one flat, keyboard-navigable row list ---------- */

  const rows: Row[] = [];

  if (!q) {
    recent.forEach((r) =>
      rows.push({
        id: `recent-${r}`,
        type: "recent",
        section: "Recent",
        title: r,
        onSelect: () => {
          setQuery(r);
          setActiveIdx(0);
          inputRef.current?.focus();
        },
      }),
    );

    collections.slice(0, 4).forEach((c) =>
      rows.push({
        id: `jump-collection-${c.id}`,
        type: "collection",
        section: "Jump to collection",
        title: c.name,
        subtitle: `${c.bookmarkCount} bookmark${c.bookmarkCount !== 1 ? "s" : ""}`,
        onSelect: () => onNavigate("collection-detail", { collectionId: c.id }),
      }),
    );

    [...allTags]
      .sort((a, b) => b.bookmarkCount - a.bookmarkCount)
      .slice(0, 5)
      .forEach((t) =>
        rows.push({
          id: `jump-tag-${t.id}`,
          type: "tag",
          section: "Popular tags",
          title: `#${t.name}`,
          subtitle: `${t.bookmarkCount} bookmark${t.bookmarkCount !== 1 ? "s" : ""}`,
          onSelect: () => onNavigate("tag-detail", { tag: t.id }),
        }),
      );
  } else {
    bookmarkResults.forEach((b) =>
      rows.push({
        id: `bookmark-${b.id}`,
        type: "bookmark",
        section: "Bookmarks",
        title: b.tweet.authorName,
        subtitle:
          b.tweet.text.slice(0, 80) + (b.tweet.text.length > 80 ? "…" : ""),
        onSelect: () => onSearchAll(query.trim()),
      }),
    );

    // Authors are derived from the bookmark results above — there's no
    // dedicated author index, so this only surfaces authors that appear in
    // the top matches. Selecting one searches by their username, which the
    // backend search already matches against.
    const seenAuthors = new Set<string>();
    bookmarkResults.forEach((b) => {
      const username = b.tweet.authorUsername;
      if (seenAuthors.size >= 2 || seenAuthors.has(username)) return;
      seenAuthors.add(username);
      rows.push({
        id: `author-${username}`,
        type: "author",
        section: "Authors",
        title: b.tweet.authorName,
        subtitle: `@${username}`,
        onSelect: () => onSearchAll(username),
      });
    });

    collections
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q),
      )
      .slice(0, 3)
      .forEach((c) =>
        rows.push({
          id: `collection-${c.id}`,
          type: "collection",
          section: "Collections",
          title: c.name,
          subtitle: c.description || undefined,
          onSelect: () =>
            onNavigate("collection-detail", { collectionId: c.id }),
        }),
      );

    allTags
      .filter((t) => t.name.toLowerCase().includes(q))
      .slice(0, 5)
      .forEach((t) =>
        rows.push({
          id: `tag-${t.id}`,
          type: "tag",
          section: "Tags",
          title: `#${t.name}`,
          onSelect: () => onNavigate("tag-detail", { tag: t.id }),
        }),
      );

    if (rows.length > 0) {
      rows.push({
        id: "view-all",
        type: "viewAll",
        section: "",
        title: `View all results for “${query.trim()}”`,
        onSelect: () => onSearchAll(query.trim()),
      });
    }
  }

  // Async results can shrink the list under the cursor — clamp rather than
  // point at a row that no longer exists.
  const safeActive =
    rows.length === 0 ? -1 : Math.min(activeIdx, rows.length - 1);

  useEffect(() => {
    if (safeActive < 0) return;
    document
      .getElementById(`search-row-${safeActive}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [safeActive]);

  function select(row: Row) {
    if (q) saveRecent(query.trim());
    row.onSelect();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx(
        rows.length === 0 ? 0 : Math.min(safeActive + 1, rows.length - 1),
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx(Math.max(safeActive - 1, 0));
    } else if (e.key === "Enter" && safeActive >= 0) {
      e.preventDefault();
      select(rows[safeActive]);
    }
  }

  const nothingFound = q && !isSearching && !searchError && rows.length === 0;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={MOTION.ui}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Search your library"
        className="bg-card rounded-xl border border-border shadow-2xl w-full max-w-xl mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        initial={reduceMotion ? undefined : { opacity: 0, scale: 0.97, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={
          reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -8 }
        }
        transition={MOTION.ui}
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <SearchIcon size={16} className="text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded={rows.length > 0}
            aria-controls="search-listbox"
            aria-activedescendant={
              safeActive >= 0 ? `search-row-${safeActive}` : undefined
            }
            aria-autocomplete="list"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIdx(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search your library..."
            className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <XIcon size={15} />
            </button>
          )}
          <kbd className="text-xs text-muted-foreground border border-border rounded px-1.5 py-0.5 font-mono">
            Esc
          </kbd>
        </div>

        <div
          id="search-listbox"
          role="listbox"
          className="max-h-80 overflow-y-auto"
        >
          {q && isSearching && bookmarkResults.length === 0 && (
            <p className="px-4 pt-3 pb-1 text-xs text-muted-foreground">
              Searching bookmarks…
            </p>
          )}

          {q && searchError && (
            <p className="px-4 pt-3 pb-1 text-xs text-red-600">
              Couldn&apos;t search bookmarks. Check your connection and try
              again.
            </p>
          )}

          {nothingFound && (
            <div className="py-12 text-center">
              <p className="text-sm text-foreground">
                No results for &ldquo;{query.trim()}&rdquo;
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try a different word, or check the spelling.
              </p>
            </div>
          )}

          {!q && rows.length === 0 && (
            <div className="py-12 text-center">
              <SearchIcon
                size={24}
                className="text-muted-foreground mx-auto mb-3"
              />
              <p className="text-sm text-muted-foreground">
                Search across everything you&apos;ve saved
              </p>
            </div>
          )}

          {rows.map((row, idx) => {
            const showHeader =
              row.section &&
              (idx === 0 || rows[idx - 1].section !== row.section);
            return (
              <div key={row.id}>
                {showHeader && (
                  <div className="flex items-center justify-between px-4 pt-3 pb-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {row.section}
                    </p>
                    {row.section === "Recent" && (
                      <button
                        onClick={clearRecent}
                        className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                )}
                <div
                  id={`search-row-${idx}`}
                  role="option"
                  aria-selected={idx === safeActive}
                  onClick={() => select(row)}
                  onMouseEnter={() => setActiveIdx(idx)}
                  className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors duration-100 ${
                    row.type === "viewAll" ? "border-t border-border mt-1" : ""
                  } ${idx === safeActive ? "bg-muted" : ""}`}
                >
                  <span className="text-muted-foreground shrink-0">
                    {ROW_ICONS[row.type]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm truncate ${
                        row.type === "viewAll"
                          ? "text-primary font-medium"
                          : "text-foreground font-medium"
                      }`}
                    >
                      {row.type === "viewAll" || row.type === "recent"
                        ? row.title
                        : highlight(row.title, query.trim())}
                    </p>
                    {row.subtitle && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {row.type === "bookmark"
                          ? highlight(row.subtitle, query.trim())
                          : row.subtitle}
                      </p>
                    )}
                  </div>
                  {row.type === "viewAll" && (
                    <span className="text-muted-foreground text-sm shrink-0">
                      →
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border bg-muted/30">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <kbd className="border border-border rounded px-1 py-0.5 font-mono bg-background">
              ↑↓
            </kbd>
            navigate
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <kbd className="border border-border rounded px-1 py-0.5 font-mono bg-background">
              ↵
            </kbd>
            select
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <kbd className="border border-border rounded px-1 py-0.5 font-mono bg-background">
              Esc
            </kbd>
            close
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
