import React, { useState, useEffect, useRef } from "react";
import { Page } from "../types";
import { ApiBookmark, ApiCollection, ApiTag } from "../types/api";
import { fetchBookmarksPage } from "../api/bookmarks";
import { SearchIcon, XIcon, BookmarkIcon, FolderIcon, TagIcon } from "../icons";

interface SearchModalProps {
  collections: ApiCollection[];
  allTags: ApiTag[];
  onClose: () => void;
  onNavigate: (
    page: Page,
    params?: { collectionId?: string; tag?: string },
  ) => void;
}

type ResultType = "bookmark" | "collection" | "tag";

interface Result {
  type: ResultType;
  id: string;
  title: string;
  subtitle?: string;
  page: Page;
  params?: { collectionId?: string; tag?: string };
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

export default function SearchModal({
  collections,
  allTags,
  onClose,
  onNavigate,
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [bookmarkResults, setBookmarkResults] = useState<ApiBookmark[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const q = query.trim().toLowerCase();

  // Debounced backend search for bookmarks — there's no full in-memory
  // bookmark list to filter anymore now that lists are paginated. Collections
  // and tags stay client-side below since those are always fetched in full.
  useEffect(() => {
    if (!q) {
      setBookmarkResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const requestId = ++requestIdRef.current;

    const timeout = setTimeout(async () => {
      try {
        const page = await fetchBookmarksPage({ search: q, limit: 8 });
        // Ignore results from a stale, superseded request.
        if (requestId === requestIdRef.current) {
          setBookmarkResults(page.items);
        }
      } catch {
        if (requestId === requestIdRef.current) {
          setBookmarkResults([]);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setIsSearching(false);
        }
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [q]);

  const results: Result[] = [];

  if (q) {
    bookmarkResults.forEach((b) => {
      results.push({
        type: "bookmark",
        id: b.id,
        title: b.tweet.authorName,
        subtitle:
          b.tweet.text.slice(0, 80) + (b.tweet.text.length > 80 ? "…" : ""),
        page: "all-bookmarks",
      });
    });

    collections
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q),
      )
      .slice(0, 3)
      .forEach((c) => {
        results.push({
          type: "collection",
          id: c.id,
          title: c.name,
          subtitle: c.description,
          page: "collection-detail",
          params: { collectionId: c.id },
        });
      });

    allTags
      .filter((t) => t.name.toLowerCase().includes(q))
      .slice(0, 5)
      .forEach((t) => {
        results.push({
          type: "tag",
          id: t.id,
          title: `#${t.name}`,
          page: "tag-detail",
          params: { tag: t.id },
        });
      });
  }

  function selectResult(result: Result) {
    onNavigate(result.page, result.params);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIdx]) {
      selectResult(results[activeIdx]);
    }
  }

  const typeIcon = {
    bookmark: <BookmarkIcon size={14} />,
    collection: <FolderIcon size={14} />,
    tag: <TagIcon size={14} />,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-xl border border-border shadow-2xl w-full max-w-xl mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <SearchIcon size={16} className="text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIdx(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search bookmarks, collections, tags..."
            className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <XIcon size={15} />
            </button>
          )}
          <kbd className="text-xs text-muted-foreground border border-border rounded px-1.5 py-0.5 font-mono">
            Esc
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {q && isSearching && results.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">Searching…</p>
            </div>
          )}

          {q && !isSearching && results.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">
                No results for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try a different search term
              </p>
            </div>
          )}

          {!q && (
            <div className="py-12 text-center">
              <SearchIcon
                size={24}
                className="text-muted-foreground mx-auto mb-3"
              />
              <p className="text-sm text-muted-foreground">
                Search across all your bookmarks
              </p>
            </div>
          )}

          {results.map((result, idx) => (
            <button
              key={result.id + result.type}
              onClick={() => selectResult(result)}
              onMouseEnter={() => setActiveIdx(idx)}
              className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                idx === activeIdx ? "bg-muted" : "hover:bg-muted/50"
              }`}
            >
              <span className="text-muted-foreground mt-0.5 shrink-0">
                {typeIcon[result.type]}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {highlight(result.title, query)}
                </p>
                {result.subtitle && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {highlight(result.subtitle, query)}
                  </p>
                )}
              </div>
              <span className="ml-auto text-xs text-muted-foreground shrink-0 mt-0.5 capitalize">
                {result.type}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border bg-muted/30">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <kbd className="border border-border rounded px-1 py-0.5 font-mono bg-background">
              ↑↓
            </kbd>{" "}
            navigate
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <kbd className="border border-border rounded px-1 py-0.5 font-mono bg-background">
              ↵
            </kbd>{" "}
            select
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <kbd className="border border-border rounded px-1 py-0.5 font-mono bg-background">
              Esc
            </kbd>{" "}
            close
          </span>
        </div>
      </div>
    </div>
  );
}
