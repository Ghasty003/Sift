import {
  createBrowserRouter,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom";
import { useAppStore } from "@/store/appStore";
import { pageToPath } from "@/lib/legacyNav";

import AppLayout from "@/layouts/AppLayout";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Inbox from "@/pages/Inbox";
import AllBookmarks from "@/pages/AllBookmarks";
import Collections from "@/pages/Collections";
import CollectionDetail from "@/pages/CollectionDetail";
import Tags from "@/pages/Tags";
import TagDetail from "@/pages/TagDetail";
import Favorites from "@/pages/Favorites";
import Unread from "@/pages/Unread";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import { useMemo } from "react";

function DashboardRoute() {
  const bookmarks = useAppStore((s) => s.bookmarks);
  const collections = useAppStore((s) => s.collections);
  const navigate = useNavigate();
  return (
    <Dashboard
      bookmarks={bookmarks}
      collections={collections}
      onNavigate={(page, params) => navigate(pageToPath(page, params))}
    />
  );
}

function InboxRoute() {
  const bookmarks = useAppStore((s) => s.bookmarks);
  const collections = useAppStore((s) => s.collections);
  const dispatch = useAppStore((s) => s.dispatch);
  const inboxBookmarks = useMemo(
    () => bookmarks.filter((b) => b.collectionId === "inbox"),
    [bookmarks],
  );
  return (
    <Inbox
      bookmarks={inboxBookmarks}
      collections={collections}
      dispatch={dispatch}
    />
  );
}

function AllBookmarksRoute() {
  const bookmarks = useAppStore((s) => s.bookmarks);
  const collections = useAppStore((s) => s.collections);
  const dispatch = useAppStore((s) => s.dispatch);
  const allTags = useMemo(
    () => [...new Set(bookmarks.flatMap((b) => b.tags))].sort(),
    [bookmarks],
  );
  return (
    <AllBookmarks
      bookmarks={bookmarks}
      collections={collections}
      allTags={allTags}
      dispatch={dispatch}
    />
  );
}

function CollectionsRoute() {
  const bookmarks = useAppStore((s) => s.bookmarks);
  const collections = useAppStore((s) => s.collections);
  const dispatch = useAppStore((s) => s.dispatch);
  const navigate = useNavigate();
  return (
    <Collections
      bookmarks={bookmarks}
      collections={collections}
      dispatch={dispatch}
      onSelectCollection={(id) => navigate(`/collections/${id}`)}
    />
  );
}

function CollectionDetailRoute() {
  const { collectionId } = useParams();
  const bookmarks = useAppStore((s) => s.bookmarks);
  const collections = useAppStore((s) => s.collections);
  const dispatch = useAppStore((s) => s.dispatch);
  const navigate = useNavigate();

  const col =
    collectionId === "inbox"
      ? {
          id: "inbox" as const,
          name: "Inbox",
          description: "Unsorted bookmarks",
        }
      : collections.find((c) => c.id === collectionId);

  if (!col) return <Navigate to="/collections" replace />;

  return (
    <CollectionDetail
      bookmarks={bookmarks.filter((b) => b.collectionId === collectionId)}
      collection={col}
      allCollections={collections}
      dispatch={dispatch}
      onBack={() => navigate("/collections")}
    />
  );
}

function TagsRoute() {
  const bookmarks = useAppStore((s) => s.bookmarks);
  const dispatch = useAppStore((s) => s.dispatch);
  const allTags = useMemo(
    () => [...new Set(bookmarks.flatMap((b) => b.tags))].sort(),
    [bookmarks],
  );
  const navigate = useNavigate();
  return (
    <Tags
      bookmarks={bookmarks}
      allTags={allTags}
      onSelectTag={(tag) => navigate(`/tags/${encodeURIComponent(tag)}`)}
      dispatch={dispatch}
    />
  );
}

function TagDetailRoute() {
  const { tag } = useParams();
  const bookmarks = useAppStore((s) => s.bookmarks);
  const collections = useAppStore((s) => s.collections);
  const dispatch = useAppStore((s) => s.dispatch);
  const navigate = useNavigate();

  if (!tag) return <Navigate to="/tags" replace />;
  const decodedTag = decodeURIComponent(tag);

  return (
    <TagDetail
      bookmarks={bookmarks.filter((b) => b.tags.includes(decodedTag))}
      tag={decodedTag}
      collections={collections}
      dispatch={dispatch}
      onBack={() => navigate("/tags")}
    />
  );
}

function FavoritesRoute() {
  const bookmarks = useAppStore((s) => s.bookmarks);
  const collections = useAppStore((s) => s.collections);
  const dispatch = useAppStore((s) => s.dispatch);
  const favorites = useMemo(
    () => bookmarks.filter((b) => b.isFavorite),
    [bookmarks],
  );
  return (
    <Favorites
      bookmarks={favorites}
      collections={collections}
      dispatch={dispatch}
    />
  );
}

function UnreadRoute() {
  const bookmarks = useAppStore((s) => s.bookmarks);
  const collections = useAppStore((s) => s.collections);
  const dispatch = useAppStore((s) => s.dispatch);
  const unread = useMemo(() => bookmarks.filter((b) => !b.isRead), [bookmarks]);
  return (
    <Unread bookmarks={unread} collections={collections} dispatch={dispatch} />
  );
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login onLogin={() => {}} onGoSignup={() => {}} />,
  },
  {
    path: "/signup",
    element: <Signup onSignup={() => {}} onGoLogin={() => {}} />,
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <DashboardRoute /> },
      { path: "inbox", element: <InboxRoute /> },
      { path: "all-bookmarks", element: <AllBookmarksRoute /> },
      { path: "collections", element: <CollectionsRoute /> },
      { path: "collections/:collectionId", element: <CollectionDetailRoute /> },
      { path: "tags", element: <TagsRoute /> },
      { path: "tags/:tag", element: <TagDetailRoute /> },
      { path: "favorites", element: <FavoritesRoute /> },
      { path: "unread", element: <UnreadRoute /> },
      { path: "settings", element: <Settings /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
