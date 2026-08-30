import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import SearchModal from "../components/SearchModal";
import QueryGate from "../components/QueryGate";
import { pageToPath } from "../lib/legacyNav";
import { Page } from "../types";
import { useBookmarks } from "../hooks/useBookmarks";
import { useCollections } from "../hooks/useCollections";
import TopBar from "@/components/TopBar";

export default function AppLayout() {
  const bookmarksQuery = useBookmarks();
  const collectionsQuery = useCollections();

  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function legacyNavigate(
    page: Page,
    params?: { collectionId?: string; tag?: string },
  ) {
    navigate(pageToPath(page, params));
    setSidebarOpen(false);
  }

  return (
    <QueryGate queries={[bookmarksQuery, collectionsQuery]}>
      {() => {
        const bookmarks = bookmarksQuery.data ?? [];
        const collections = collectionsQuery.data ?? [];

        // Tags are derived from bookmarks (no dedicated "all tags with
        // counts" endpoint needed — see integration notes), deduped by id.
        const allTags = Array.from(
          new Map(
            bookmarks.flatMap((b) => b.tags).map((t) => [t.id, t]),
          ).values(),
        );

        return (
          <div className="flex h-screen bg-background text-foreground overflow-hidden">
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            <Sidebar
              onNavigate={legacyNavigate}
              collections={collections}
              bookmarks={bookmarks}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0 h-full">
              <TopBar
                onSearchOpen={() => setSearchOpen(true)}
                onMenuOpen={() => setSidebarOpen(true)}
              />
              <main className="flex-1 overflow-y-auto">
                <Outlet />
              </main>
            </div>

            {searchOpen && (
              <SearchModal
                bookmarks={bookmarks}
                collections={collections}
                allTags={allTags}
                onClose={() => setSearchOpen(false)}
                onNavigate={(page, params) => {
                  legacyNavigate(page, params);
                  setSearchOpen(false);
                }}
              />
            )}
          </div>
        );
      }}
    </QueryGate>
  );
}
