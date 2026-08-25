import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/appStore";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import SearchModal from "@/components/SearchModal";
import { pageToPath } from "@/lib/legacyNav";
import { Page } from "@/types";

export default function AppLayout() {
  const bookmarks = useAppStore((s) => s.bookmarks);
  const collections = useAppStore((s) => s.collections);
  const dispatch = useAppStore((s) => s.dispatch);
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const allTags = [...new Set(bookmarks.flatMap((b) => b.tags))].sort();

  function legacyNavigate(
    page: Page,
    params?: { collectionId?: string; tag?: string },
  ) {
    navigate(pageToPath(page, params));
    setSidebarOpen(false);
  }

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
        dispatch={dispatch}
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
}
