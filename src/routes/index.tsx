import {
  createBrowserRouter,
  Navigate,
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { pageToPath } from "../lib/legacyNav";
import { useAuthStore } from "../store/authStore";
import QueryGate from "../components/QueryGate";

import AppLayout from "../layouts/AppLayout";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ConnectExtension from "../pages/ConnectExtension";
import Dashboard from "../pages/Dashboard";
import Inbox from "../pages/Inbox";
import AllBookmarks from "../pages/AllBookmarks";
import Collections from "../pages/Collections";
import CollectionDetail from "../pages/CollectionDetail";
import Tags from "../pages/Tags";
import TagDetail from "../pages/TagDetail";
import Favorites from "../pages/Favorites";
import Unread from "../pages/Unread";
import Settings from "../pages/Settings";
import NotFound from "../pages/NotFound";

import {
  useBookmarks,
  useInboxBookmarks,
  useFavoriteBookmarks,
  useUnreadBookmarks,
  useCollectionBookmarks,
} from "../hooks/useBookmarks";
import { useCollections } from "../hooks/useCollections";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Preserve where they were headed (e.g. /connect-extension) so Login can
    // send them back after a successful sign-in instead of always landing
    // on /dashboard.
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  return <>{children}</>;
}

function DashboardRoute() {
  const bookmarksQuery = useBookmarks();
  const collectionsQuery = useCollections();
  const navigate = useNavigate();

  return (
    <QueryGate queries={[bookmarksQuery, collectionsQuery]}>
      {() => (
        <Dashboard
          bookmarks={bookmarksQuery.data!}
          collections={collectionsQuery.data!}
          onNavigate={(page, params) => navigate(pageToPath(page, params))}
        />
      )}
    </QueryGate>
  );
}

function InboxRoute() {
  const bookmarksQuery = useInboxBookmarks();
  const collectionsQuery = useCollections();

  return (
    <QueryGate queries={[bookmarksQuery, collectionsQuery]}>
      {() => (
        <Inbox
          bookmarks={bookmarksQuery.data!}
          collections={collectionsQuery.data!}
        />
      )}
    </QueryGate>
  );
}

function AllBookmarksRoute() {
  const bookmarksQuery = useBookmarks();
  const collectionsQuery = useCollections();

  return (
    <QueryGate queries={[bookmarksQuery, collectionsQuery]}>
      {() => {
        const bookmarks = bookmarksQuery.data!;
        const allTags = Array.from(
          new Map(
            bookmarks.flatMap((b) => b.tags).map((t) => [t.id, t]),
          ).values(),
        );
        return (
          <AllBookmarks
            bookmarks={bookmarks}
            collections={collectionsQuery.data!}
            allTags={allTags}
          />
        );
      }}
    </QueryGate>
  );
}

function CollectionsRoute() {
  const bookmarksQuery = useBookmarks();
  const collectionsQuery = useCollections();
  const navigate = useNavigate();

  return (
    <QueryGate queries={[bookmarksQuery, collectionsQuery]}>
      {() => (
        <Collections
          bookmarks={bookmarksQuery.data!}
          collections={collectionsQuery.data!}
          onSelectCollection={(id) => navigate(`/collections/${id}`)}
        />
      )}
    </QueryGate>
  );
}

function CollectionDetailRoute() {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const isInbox = collectionId === "inbox";

  const collectionsQuery = useCollections();
  const inboxQuery = useInboxBookmarks();
  const namedQuery = useCollectionBookmarks(isInbox ? undefined : collectionId);
  const bookmarksQuery = isInbox ? inboxQuery : namedQuery;

  return (
    <QueryGate queries={[collectionsQuery, bookmarksQuery]}>
      {() => {
        const collection = isInbox
          ? {
              id: "inbox" as const,
              name: "Inbox",
              description: "Unsorted bookmarks",
            }
          : collectionsQuery.data!.find((c) => c.id === collectionId);

        if (!collection) return <Navigate to="/collections" replace />;

        return (
          <CollectionDetail
            bookmarks={bookmarksQuery.data ?? []}
            collection={collection}
            allCollections={collectionsQuery.data!}
            onBack={() => navigate("/collections")}
          />
        );
      }}
    </QueryGate>
  );
}

function TagsRoute() {
  const bookmarksQuery = useBookmarks();
  const navigate = useNavigate();

  return (
    <QueryGate queries={[bookmarksQuery]}>
      {() => (
        <Tags
          bookmarks={bookmarksQuery.data!}
          onSelectTag={(tagId) =>
            navigate(`/tags/${encodeURIComponent(tagId)}`)
          }
        />
      )}
    </QueryGate>
  );
}

function TagDetailRoute() {
  const { tagId } = useParams();
  const bookmarksQuery = useBookmarks();
  const collectionsQuery = useCollections();
  const navigate = useNavigate();

  return (
    <QueryGate queries={[bookmarksQuery, collectionsQuery]}>
      {() => {
        const bookmarks = bookmarksQuery.data!;
        const matching = bookmarks.filter((b) =>
          b.tags.some((t) => t.id === tagId),
        );
        const tagName = matching[0]?.tags.find((t) => t.id === tagId)?.name;

        if (!tagId || !tagName) return <Navigate to="/tags" replace />;

        return (
          <TagDetail
            bookmarks={matching}
            tag={{ id: tagId, name: tagName }}
            collections={collectionsQuery.data!}
            onBack={() => navigate("/tags")}
          />
        );
      }}
    </QueryGate>
  );
}

function FavoritesRoute() {
  const bookmarksQuery = useFavoriteBookmarks();
  const collectionsQuery = useCollections();

  return (
    <QueryGate queries={[bookmarksQuery, collectionsQuery]}>
      {() => (
        <Favorites
          bookmarks={bookmarksQuery.data!}
          collections={collectionsQuery.data!}
        />
      )}
    </QueryGate>
  );
}

function UnreadRoute() {
  const bookmarksQuery = useUnreadBookmarks();
  const collectionsQuery = useCollections();

  return (
    <QueryGate queries={[bookmarksQuery, collectionsQuery]}>
      {() => (
        <Unread
          bookmarks={bookmarksQuery.data!}
          collections={collectionsQuery.data!}
        />
      )}
    </QueryGate>
  );
}

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  {
    path: "/connect-extension",
    element: (
      <RequireAuth>
        <ConnectExtension />
      </RequireAuth>
    ),
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <DashboardRoute /> },
      { path: "inbox", element: <InboxRoute /> },
      { path: "all-bookmarks", element: <AllBookmarksRoute /> },
      { path: "collections", element: <CollectionsRoute /> },
      { path: "collections/:collectionId", element: <CollectionDetailRoute /> },
      { path: "tags", element: <TagsRoute /> },
      { path: "tags/:tagId", element: <TagDetailRoute /> },
      { path: "favorites", element: <FavoritesRoute /> },
      { path: "unread", element: <UnreadRoute /> },
      { path: "settings", element: <Settings /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
