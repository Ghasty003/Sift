import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ApiBookmark, ApiCollection } from "../types/api";
import {
  StarIcon,
  EyeIcon,
  EyeOffIcon,
  EditIcon,
  FolderIcon,
  TagIcon,
  ExternalLinkIcon,
  TrashIcon,
  XIcon,
  CheckIcon,
  MoreHorizontalIcon,
} from "../icons";
import {
  formatDate,
  formatRelative,
  getAvatarColor,
  getInitials,
} from "../data";
import {
  useToggleFavorite,
  useToggleRead,
  useDeleteBookmark,
  useAddBookmarkToCollection,
  useUpsertBookmarkNote,
  useAddTagToBookmark,
  useRemoveTagFromBookmark,
} from "../hooks/useBookmarks";
import { useTags, useCreateTag } from "../hooks/useTags";
import { useToast } from "./Toast";
import { MOTION, prefersReducedMotion } from "../lib/motion";

interface BookmarkCardProps {
  bookmark: ApiBookmark;
  collections: ApiCollection[];
  compact?: boolean;
}

function Avatar({
  displayName,
  username,
  size = 32,
}: {
  displayName: string;
  username: string;
  size?: number;
}) {
  const bg = getAvatarColor(username);
  const initials = getInitials(displayName);
  return (
    <div
      className="flex items-center justify-center rounded-full text-white font-semibold shrink-0 select-none"
      style={{
        width: size,
        height: size,
        backgroundColor: bg,
        fontSize: size * 0.36,
      }}
    >
      {initials}
    </div>
  );
}

function Tag({
  label,
  onRemove,
  removing,
}: {
  label: string;
  onRemove?: () => void;
  removing?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-mono ${removing ? "opacity-50" : ""}`}
    >
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          disabled={removing}
          className="hover:text-foreground transition-colors ml-0.5 disabled:cursor-wait"
        >
          <XIcon size={10} />
        </button>
      )}
    </span>
  );
}

/* ---------- inline note editor ---------- */

function InlineNote({
  bookmarkId,
  initial,
  onCollapse,
}: {
  bookmarkId: string;
  initial: string;
  onCollapse: () => void;
}) {
  const [value, setValue] = useState(initial);
  const [justSaved, setJustSaved] = useState(false);
  const upsertNote = useUpsertBookmarkNote();
  const ref = useRef<HTMLTextAreaElement>(null);
  const savedTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null!);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null!);
  const lastSavedRef = useRef(initial);

  useEffect(() => {
    ref.current?.focus();
    ref.current?.setSelectionRange(
      ref.current.value.length,
      ref.current.value.length,
    );
    return () => {
      clearTimeout(savedTimeoutRef.current);
      clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  function scheduleAutosave(next: string) {
    clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      const trimmed = next.trim();
      if (trimmed === lastSavedRef.current.trim()) return;
      if (trimmed.length === 0) return;
      upsertNote.mutate(
        { bookmarkId, content: trimmed },
        {
          onSuccess: () => {
            lastSavedRef.current = trimmed;
            flashSaved();
          },
        },
      );
    }, 800);
  }

  function flashSaved() {
    setJustSaved(true);
    clearTimeout(savedTimeoutRef.current);
    savedTimeoutRef.current = setTimeout(() => setJustSaved(false), 1500);
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value);
    scheduleAutosave(e.target.value);
  }

  function handleSaveAndClose() {
    const trimmed = value.trim();
    clearTimeout(saveTimeoutRef.current); // supersede any pending autosave

    if (trimmed.length === 0) {
      onCollapse();
      return;
    }
    if (trimmed === lastSavedRef.current.trim()) {
      onCollapse(); // nothing changed since last autosave — just close
      return;
    }

    upsertNote.mutate(
      { bookmarkId, content: trimmed },
      {
        onSuccess: () => {
          lastSavedRef.current = trimmed;
          onCollapse();
        },
      },
    );
  }

  return (
    <div className="rounded-lg bg-secondary/40 p-2.5">
      <textarea
        ref={ref}
        value={value}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Escape") onCollapse();
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter")
            handleSaveAndClose();
        }}
        placeholder="Why did you save this?"
        rows={2}
        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none leading-relaxed"
      />
      <div className="flex items-center justify-between mt-1.5">
        <AnimatePresence mode="wait">
          {upsertNote.isPending ? (
            <motion.span
              key="saving"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={MOTION.micro}
              className="text-[11px] text-muted-foreground"
            >
              Saving…
            </motion.span>
          ) : justSaved ? (
            <motion.span
              key="saved"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={MOTION.micro}
              className="flex items-center gap-1 text-[11px] text-primary"
            >
              <CheckIcon size={11} />
              Saved
            </motion.span>
          ) : (
            <span />
          )}
        </AnimatePresence>
        <div className="flex items-center gap-2">
          <button
            onClick={onCollapse}
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAndClose}
            disabled={upsertNote.isPending}
            className="px-2.5 py-1 text-[11px] font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function MoveMenu({
  currentCollectionId,
  collections,
  onMove,
  onClose,
  moving,
}: {
  currentCollectionId: string | null;
  collections: ApiCollection[];
  onMove: (id: string) => void;
  onClose: () => void;
  moving: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.96, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 4 }}
      transition={MOTION.ui}
      className="absolute bottom-full right-0 mb-2 z-30 bg-card border border-border rounded-lg shadow-lg py-1 min-w-52 origin-bottom-right"
    >
      <p className="px-3 py-1.5 text-xs text-muted-foreground font-medium uppercase tracking-wider">
        Move to
      </p>
      <button
        disabled
        title="Not supported yet — removing a bookmark from a collection currently requires deleting the whole collection"
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-muted-foreground/50 cursor-not-allowed"
      >
        <span className="w-3.25" />
        Inbox
      </button>
      {collections.map((c) => (
        <button
          key={c.id}
          onClick={() => onMove(c.id)}
          disabled={moving}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted transition-colors disabled:cursor-wait ${
            c.id === currentCollectionId
              ? "text-primary font-medium"
              : "text-foreground"
          }`}
        >
          {c.id === currentCollectionId ? (
            <CheckIcon size={13} />
          ) : (
            <span className="w-3.25" />
          )}
          {c.name}
        </button>
      ))}
    </motion.div>
  );
}

function TagInput({
  onAdd,
  onClose,
  adding,
}: {
  onAdd: (name: string) => void;
  onClose: () => void;
  adding: boolean;
}) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  function submit() {
    const name = value.trim().replace(/^#/, "");
    if (name.length > 0) {
      onAdd(name);
      setValue("");
    }
  }

  return (
    <motion.div
      className="flex items-center gap-1"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={MOTION.micro}
    >
      <input
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") onClose();
        }}
        disabled={adding}
        placeholder="tag"
        className="w-24 px-2 py-0.5 text-xs font-mono border border-border rounded-full focus:outline-none focus:ring-1 focus:ring-ring bg-background disabled:opacity-60"
      />
      <button
        onClick={submit}
        disabled={adding}
        className="p-0.5 text-primary hover:opacity-70 transition-opacity disabled:cursor-wait"
      >
        <CheckIcon size={13} />
      </button>
      <button
        onClick={onClose}
        className="p-0.5 text-muted-foreground hover:text-foreground transition-colors"
      >
        <XIcon size={13} />
      </button>
    </motion.div>
  );
}

function MoreMenu({
  onTag,
  onMove,
  onNote,
  onOpen,
  onDelete,
  hasNote,
}: {
  onTag: () => void;
  onMove: () => void;
  onNote: () => void;
  onOpen: () => void;
  onDelete: () => void;
  hasNote: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const items = [
    { label: "Add tag", icon: <TagIcon size={13} />, onClick: onTag },
    {
      label: "Move to collection",
      icon: <FolderIcon size={13} />,
      onClick: onMove,
    },
    {
      label: hasNote ? "Edit note" : "Add note",
      icon: <EditIcon size={13} />,
      onClick: onNote,
    },
    {
      label: "Open on X",
      icon: <ExternalLinkIcon size={13} />,
      onClick: onOpen,
    },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        title="More actions"
        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <MoreHorizontalIcon size={15} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={MOTION.ui}
            className="absolute bottom-full right-0 mb-2 z-30 bg-card border border-border rounded-lg shadow-lg py-1 min-w-44 origin-bottom-right"
          >
            {items.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  item.onClick();
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left text-foreground hover:bg-muted transition-colors"
              >
                <span className="text-muted-foreground">{item.icon}</span>
                {item.label}
              </button>
            ))}
            <div className="my-1 border-t border-border" />
            <button
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50 transition-colors"
            >
              <TrashIcon size={13} />
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BookmarkCard({
  bookmark,
  collections,
}: BookmarkCardProps) {
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [editingNote, setEditingNote] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const toggleFavorite = useToggleFavorite();
  const toggleRead = useToggleRead();
  const deleteBookmark = useDeleteBookmark();
  const addToCollection = useAddBookmarkToCollection();
  const addTagToBookmark = useAddTagToBookmark();
  const removeTagFromBookmark = useRemoveTagFromBookmark();
  const { data: allTags } = useTags();
  const createTag = useCreateTag();
  const toast = useToast();

  const { tweet } = bookmark;
  const collectionName = bookmark.collection?.name ?? "Inbox";
  const noteContent = bookmark.note?.content ?? "";
  const reduceMotion = prefersReducedMotion();

  async function handleAddTag(name: string) {
    const existing = allTags?.find(
      (t) => t.name.toLowerCase() === name.toLowerCase(),
    );
    const tagId = existing
      ? existing.id
      : (await createTag.mutateAsync(name)).id;
    addTagToBookmark.mutate({ bookmarkId: bookmark.id, tagId });
    setShowTagInput(false);
  }

  function handleDelete() {
    setIsRemoving(true);
    const timeout = setTimeout(() => {
      deleteBookmark.mutate(bookmark.id);
    }, 4500);

    toast.show(`Removed "${tweet.authorName}"'s post`, {
      actionLabel: "Undo",
      onAction: () => {
        clearTimeout(timeout);
        setIsRemoving(false);
      },
    });
  }

  return (
    <AnimatePresence mode="popLayout">
      {!isRemoving && (
        <motion.article
          layout
          initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={
            reduceMotion
              ? { opacity: 0 }
              : {
                  opacity: 0,
                  height: 0,
                  marginBottom: 0,
                  transition: MOTION.layout,
                }
          }
          transition={MOTION.ui}
          className="group bg-card border border-border rounded-xl overflow-visible hover:border-foreground/20 hover:shadow-sm transition-[border-color,box-shadow] duration-150"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4">
            <div className="flex items-start gap-3 min-w-0">
              <Avatar
                displayName={tweet.authorName}
                username={tweet.authorUsername}
                size={34}
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground leading-tight">
                  {tweet.authorName}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  @{tweet.authorUsername}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {!bookmark.isRead && (
                <span
                  className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"
                  title="Unread"
                />
              )}
              <time className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDate(tweet.createdAt)}
              </time>
            </div>
          </div>

          {/* Tweet content */}
          <div className="mx-5 px-4 py-3 bg-secondary/60 border-l-2 border-primary/30 rounded-r-lg text-sm text-foreground leading-relaxed">
            {tweet.text}
          </div>

          {/* Metadata */}
          <div className="px-5 pt-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <FolderIcon size={12} />
                <span>{collectionName}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatRelative(bookmark.savedAt)}
              </span>
            </div>

            {(bookmark.tags.length > 0 || showTagInput) && (
              <div className="flex flex-wrap items-center gap-1.5">
                <AnimatePresence mode="popLayout">
                  {bookmark.tags.map((tag) => (
                    <motion.div
                      key={tag.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={MOTION.micro}
                    >
                      <Tag
                        label={`#${tag.name}`}
                        removing={
                          removeTagFromBookmark.isPending &&
                          removeTagFromBookmark.variables?.tagId === tag.id
                        }
                        onRemove={() =>
                          removeTagFromBookmark.mutate({
                            bookmarkId: bookmark.id,
                            tagId: tag.id,
                          })
                        }
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
                <AnimatePresence>
                  {showTagInput && (
                    <TagInput
                      onAdd={handleAddTag}
                      onClose={() => setShowTagInput(false)}
                      adding={createTag.isPending || addTagToBookmark.isPending}
                    />
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Note — inline, attached to the bookmark, never a modal */}
            <AnimatePresence mode="wait" initial={false}>
              {editingNote ? (
                <motion.div
                  key="editing"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={MOTION.ui}
                  className="overflow-hidden"
                >
                  <InlineNote
                    bookmarkId={bookmark.id}
                    initial={noteContent}
                    onCollapse={() => setEditingNote(false)}
                  />
                </motion.div>
              ) : noteContent ? (
                <motion.button
                  key="preview"
                  onClick={() => setEditingNote(true)}
                  className="flex gap-2 text-xs text-muted-foreground italic w-full text-left hover:text-foreground transition-colors"
                >
                  <EditIcon size={12} className="shrink-0 mt-0.5 not-italic" />
                  <span className="line-clamp-2">{noteContent}</span>
                </motion.button>
              ) : null}
            </AnimatePresence>
          </div>

          {/* Action bar — favorite/read always visible; everything else lives
              behind the "more" menu, revealed on hover/focus so the resting
              card stays calm. */}
          <div className="flex items-center justify-between px-5 py-3 mt-3 border-t border-border/60">
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => toggleFavorite.mutate(bookmark.id)}
                disabled={toggleFavorite.isPending}
                title={bookmark.isFavorite ? "Unfavorite" : "Favorite"}
                className="p-1.5 rounded-md hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-wait"
              >
                <motion.span
                  className="block"
                  animate={
                    reduceMotion
                      ? undefined
                      : bookmark.isFavorite
                        ? { scale: [1, 1.3, 1] }
                        : { scale: 1 }
                  }
                  transition={MOTION.micro}
                >
                  <StarIcon
                    size={15}
                    filled={bookmark.isFavorite}
                    className={
                      bookmark.isFavorite
                        ? "text-amber-500"
                        : "text-muted-foreground"
                    }
                  />
                </motion.span>
              </button>

              <button
                onClick={() => toggleRead.mutate(bookmark.id)}
                disabled={toggleRead.isPending}
                title={bookmark.isRead ? "Mark unread" : "Mark read"}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-wait"
              >
                {bookmark.isRead ? (
                  <EyeIcon size={15} />
                ) : (
                  <EyeOffIcon size={15} />
                )}
              </button>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150">
              <div className="relative">
                <MoreMenu
                  hasNote={!!noteContent}
                  onTag={() => setShowTagInput(true)}
                  onMove={() => setShowMoveMenu(true)}
                  onNote={() => setEditingNote(true)}
                  onOpen={() => window.open(tweet.url, "_blank")}
                  onDelete={handleDelete}
                />
                <AnimatePresence>
                  {showMoveMenu && (
                    <MoveMenu
                      currentCollectionId={bookmark.collection?.id ?? null}
                      collections={collections}
                      moving={addToCollection.isPending}
                      onMove={(id) => {
                        addToCollection.mutate({
                          bookmarkId: bookmark.id,
                          collectionId: id,
                        });
                        setShowMoveMenu(false);
                      }}
                      onClose={() => setShowMoveMenu(false)}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.article>
      )}
    </AnimatePresence>
  );
}
