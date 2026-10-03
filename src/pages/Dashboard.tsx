import React, { useState } from "react";
import { Page } from "../types";
import {
  BookmarkIcon,
  StarIcon,
  EyeOffIcon,
  FolderIcon,
  TagIcon,
} from "../icons";
import { formatRelative, getAvatarColor, getInitials } from "../data";
import { useDashboardSummary } from "../hooks/useDashboard";
import { ApiBookmark } from "../types/api";
import SiftLoader from "@/components/SiftLoader";

interface DashboardProps {
  onNavigate: (
    page: Page,
    params?: { collectionId?: string; tag?: string },
  ) => void;
}

function StatCard({
  label,
  value,
  icon,
  onClick,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-card border border-border rounded-xl p-5 text-left hover:border-foreground/20 transition-colors group cursor-pointer"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-2xl font-bold text-foreground tabular-nums">
          {value}
        </span>
      </div>
      <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
        {label}
      </p>
    </button>
  );
}

function MiniAvatar({
  displayName,
  username,
  avatarUrl,
}: {
  displayName: string;
  username: string;
  avatarUrl?: string | null;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  if (avatarUrl && !imgFailed) {
    return (
      <img
        src={avatarUrl}
        alt={displayName}
        onError={() => setImgFailed(true)}
        className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
      />
    );
  }

  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white font-semibold shrink-0 mt-0.5"
      style={{ backgroundColor: getAvatarColor(username) }}
    >
      {getInitials(displayName)}
    </div>
  );
}

function MiniBookmarkCard({ bookmark }: { bookmark: ApiBookmark }) {
  return (
    <div className="flex gap-3 py-3 border-b border-border last:border-0">
      <MiniAvatar
        displayName={bookmark.tweet.authorName}
        username={bookmark.tweet.authorUsername}
        avatarUrl={bookmark.tweet.authorAvatarUrl}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium text-foreground truncate">
            {bookmark.tweet.authorName}
          </p>
          <span className="text-xs text-muted-foreground shrink-0">
            {formatRelative(bookmark.savedAt)}
          </span>
        </div>
        {bookmark.tweet.isReply && (
          <p className="text-xs text-muted-foreground mt-1">
            {bookmark.tweet.replyToUsername
              ? `Replying to @${bookmark.tweet.replyToUsername}`
              : "Reply in thread"}
          </p>
        )}
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
          {bookmark.tweet.text}
        </p>
        {bookmark.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {bookmark.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="text-xs font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-full"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
function QuickLink({
  label,
  badge,
  onClick,
  icon,
}: {
  label: string;
  badge: number;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-2.5 bg-card border border-border rounded-lg hover:border-foreground/20 transition-colors"
    >
      <div className="flex items-center gap-2.5 text-sm text-foreground">
        {icon}
        {label}
      </div>
      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
        {badge}
      </span>
    </button>
  );
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { data, isLoading, isError } = useDashboardSummary();

  if (isLoading) {
    return <SiftLoader label="Loading your dashboard…" />;
  }

  if (isError || !data) {
    return (
      <div className="p-8 text-sm text-red-600">
        Couldn&apos;t load your dashboard. Please try refreshing.
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Overview</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Your saved knowledge at a glance.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
        <StatCard
          label="Total bookmarks"
          value={data.totalBookmarks}
          icon={<BookmarkIcon size={16} />}
          onClick={() => onNavigate("all-bookmarks")}
        />
        <StatCard
          label="Unread"
          value={data.unreadCount}
          icon={<EyeOffIcon size={16} />}
          onClick={() => onNavigate("unread")}
        />
        <StatCard
          label="Favorites"
          value={data.favoriteCount}
          icon={<StarIcon size={16} />}
          onClick={() => onNavigate("favorites")}
        />
        <StatCard
          label="Collections"
          value={data.collectionCount}
          icon={<FolderIcon size={16} />}
          onClick={() => onNavigate("collections")}
        />
        <StatCard
          label="Tags"
          value={data.tagCount}
          icon={<TagIcon size={16} />}
          onClick={() => onNavigate("tags")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">
              Recently Saved
            </h2>
            <button
              onClick={() => onNavigate("all-bookmarks")}
              className="text-xs text-primary hover:opacity-70 transition-opacity font-medium"
            >
              View all
            </button>
          </div>
          <div className="bg-card border border-border rounded-xl px-5">
            {data.recentBookmarks.map((b) => (
              <MiniBookmarkCard key={b.id} bookmark={b} />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">
              Quick Access
            </h2>
            <div className="space-y-2">
              <QuickLink
                label="Inbox"
                badge={data.inboxCount}
                onClick={() => onNavigate("inbox")}
                icon={<span className="text-primary">📥</span>}
              />
              <QuickLink
                label="Favorites"
                badge={data.favoriteCount}
                onClick={() => onNavigate("favorites")}
                icon={<span className="text-amber-500">⭐</span>}
              />
              <QuickLink
                label="Unread"
                badge={data.unreadCount}
                onClick={() => onNavigate("unread")}
                icon={<span className="text-muted-foreground">👁</span>}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">
                Collections
              </h2>
              <button
                onClick={() => onNavigate("collections")}
                className="text-xs text-primary hover:opacity-70 transition-opacity"
              >
                Manage
              </button>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {data.recentCollections.map((c) => (
                <button
                  key={c.id}
                  onClick={() =>
                    onNavigate("collection-detail", { collectionId: c.id })
                  }
                  className="w-full flex items-center justify-between px-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FolderIcon
                      size={13}
                      className="text-muted-foreground shrink-0"
                    />
                    <span className="text-sm text-foreground truncate">
                      {c.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {c.unreadCount > 0 && (
                      <span className="text-xs text-primary font-medium">
                        {c.unreadCount} new
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {c.bookmarkCount}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">
                Popular Tags
              </h2>
              <button
                onClick={() => onNavigate("tags")}
                className="text-xs text-primary hover:opacity-70 transition-opacity"
              >
                View all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.popularTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => onNavigate("tag-detail", { tag: tag.id })}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-card border border-border rounded-full text-xs font-mono text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                >
                  #{tag.name}
                  <span className="text-muted-foreground/60">
                    {tag.bookmarkCount}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
