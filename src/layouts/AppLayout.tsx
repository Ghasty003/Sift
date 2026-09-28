import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import SearchModal from "../components/SearchModal";
import QueryGate from "../components/QueryGate";
import { pageToPath } from "../lib/legacyNav";
import { Page } from "../types";
import { useCollections } from "../hooks/useCollections";
import { useTags } from "../hooks/useTags";
import TopBar from "@/components/TopBar";

export default function AppLayout() {
  const collectionsQuery = useCollections();
  const tagsQuery = useTags();

  const [searchOpen, setSearchOpen] = useState(false);
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
  }

  return (
    <QueryGate queries={[collectionsQuery, tagsQuery]}>
      {() => {
        const collections = collectionsQuery.data ?? [];
        const allTags = tagsQuery.data ?? [];

        return (
          <div className="flex h-screen bg-background text-foreground overflow-hidden">
            <Sidebar onNavigate={legacyNavigate} collections={collections} />

            <div className="flex-1 flex flex-col min-w-0 h-full">
              <TopBar onSearchOpen={() => setSearchOpen(true)} />
              <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
                <Outlet />
              </main>
              <BottomNav
                collections={collections}
                onNavigate={legacyNavigate}
                onOpenSearch={() => setSearchOpen(true)}
              />
            </div>

            <AnimatePresence>
              {searchOpen && (
                <SearchModal
                  collections={collections}
                  allTags={allTags}
                  onClose={() => setSearchOpen(false)}
                  onNavigate={(page, params) => {
                    legacyNavigate(page, params);
                    setSearchOpen(false);
                  }}
                  onSearchAll={(query) => {
                    navigate(`/all-bookmarks?q=${encodeURIComponent(query)}`);
                    setSearchOpen(false);
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        );
      }}
    </QueryGate>
  );
}
