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
import Landing from "../pages/Landing";

import { useCollections } from "../hooks/useCollections";
import { useTags } from "../hooks/useTags";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  return <>{children}</>;
}

function DashboardRoute() {
  const navigate = useNavigate();
  // Dashboard now fetches its own summary internally via useDashboardSummary —
  // no props to gate here.
  return (
    <Dashboard
      onNavigate={(page, params) => navigate(pageToPath(page, params))}
    />
  );
}

function InboxRoute() {
  const collectionsQuery = useCollections();

  return (
    <QueryGate queries={[collectionsQuery]}>
      {() => <Inbox collections={collectionsQuery.data!} />}
    </QueryGate>
  );
}

function AllBookmarksRoute() {
  const collectionsQuery = useCollections();
  const tagsQuery = useTags();

  return (
    <QueryGate queries={[collectionsQuery, tagsQuery]}>
      {() => (
        <AllBookmarks
          collections={collectionsQuery.data!}
          allTags={tagsQuery.data!}
        />
      )}
    </QueryGate>
  );
}

function CollectionsRoute() {
  const collectionsQuery = useCollections();
  const navigate = useNavigate();

  return (
    <QueryGate queries={[collectionsQuery]}>
      {() => (
        <Collections
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

  return (
    <QueryGate queries={[collectionsQuery]}>
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
  const tagsQuery = useTags();
  const navigate = useNavigate();

  return (
    <QueryGate queries={[tagsQuery]}>
      {() => (
        <Tags
          tags={tagsQuery.data!}
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
  const tagsQuery = useTags();
  const collectionsQuery = useCollections();
  const navigate = useNavigate();

  return (
    <QueryGate queries={[tagsQuery, collectionsQuery]}>
      {() => {
        const tag = tagsQuery.data!.find((t) => t.id === tagId);
        if (!tagId || !tag) return <Navigate to="/tags" replace />;

        return (
          <TagDetail
            tag={{ id: tag.id, name: tag.name }}
            collections={collectionsQuery.data!}
            onBack={() => navigate("/tags")}
          />
        );
      }}
    </QueryGate>
  );
}

function FavoritesRoute() {
  const collectionsQuery = useCollections();

  return (
    <QueryGate queries={[collectionsQuery]}>
      {() => <Favorites collections={collectionsQuery.data!} />}
    </QueryGate>
  );
}

function UnreadRoute() {
  const collectionsQuery = useCollections();

  return (
    <QueryGate queries={[collectionsQuery]}>
      {() => <Unread collections={collectionsQuery.data!} />}
    </QueryGate>
  );
}

function LandingRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Landing />;
}

export const router = createBrowserRouter([
  { path: "/", element: <LandingRoute /> },
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
