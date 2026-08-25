import React, { useState, useRef, useEffect } from 'react';
import { Bookmark, Collection, AppAction } from '../types';
import {
  StarIcon, EyeIcon, EyeOffIcon, EditIcon, FolderIcon,
  TagIcon, ExternalLinkIcon, TrashIcon, XIcon, CheckIcon,
} from '../icons';
import { formatDate, formatRelative, getAvatarColor, getInitials } from '../data';

interface BookmarkCardProps {
  bookmark: Bookmark;
  collections: Collection[];
  dispatch: React.Dispatch<AppAction>;
  compact?: boolean;
}

function Avatar({ displayName, username, size = 32 }: { displayName: string; username: string; size?: number }) {
  const bg = getAvatarColor(username);
  const initials = getInitials(displayName);
  return (
    <div
      className="flex items-center justify-center rounded-full text-white font-semibold flex-shrink-0 select-none"
      style={{ width: size, height: size, backgroundColor: bg, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  );
}

function Tag({ label, onRemove }: { label: string; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-mono">
      {label}
      {onRemove && (
        <button onClick={onRemove} className="hover:text-foreground transition-colors ml-0.5">
          <XIcon size={10} />
        </button>
      )}
    </span>
  );
}

function NoteModal({
  initial,
  onSave,
  onClose,
}: {
  initial: string;
  onSave: (note: string) => void;
  onClose: () => void;
}) {
  const [value, setValue] = useState(initial);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-xl border border-border shadow-xl w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-sm font-semibold text-foreground mb-3">Personal Note</h3>
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add your thoughts, context, or review notes..."
          className="w-full border border-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring bg-background placeholder:text-muted-foreground"
          rows={5}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { onSave(value); onClose(); }}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Save Note
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
}: {
  currentCollectionId: string;
  collections: Collection[];
  onMove: (id: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const allCollections = [
    { id: 'inbox', name: 'Inbox' },
    ...collections,
  ];

  return (
    <div
      ref={ref}
      className="absolute bottom-full left-0 mb-2 z-30 bg-card border border-border rounded-lg shadow-lg py-1 min-w-44"
    >
      <p className="px-3 py-1.5 text-xs text-muted-foreground font-medium uppercase tracking-wider">
        Move to
      </p>
      {allCollections.map((c) => (
        <button
          key={c.id}
          onClick={() => { onMove(c.id); onClose(); }}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted transition-colors ${
            c.id === currentCollectionId ? 'text-primary font-medium' : 'text-foreground'
          }`}
        >
          {c.id === currentCollectionId && <CheckIcon size={13} />}
          {c.id !== currentCollectionId && <span className="w-[13px]" />}
          {c.name}
        </button>
      ))}
    </div>
  );
}

function TagInput({
  onAdd,
  onClose,
}: {
  onAdd: (tag: string) => void;
  onClose: () => void;
}) {
  const [value, setValue] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  function submit() {
    const tag = value.trim().startsWith('#') ? value.trim() : `#${value.trim()}`;
    if (tag.length > 1) {
      onAdd(tag);
      setValue('');
    }
  }

  return (
    <div className="flex items-center gap-1">
      <input
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
          if (e.key === 'Escape') onClose();
        }}
        placeholder="#tag"
        className="w-24 px-2 py-0.5 text-xs font-mono border border-border rounded-full focus:outline-none focus:ring-1 focus:ring-ring bg-background"
      />
      <button
        onClick={submit}
        className="p-0.5 text-primary hover:opacity-70 transition-opacity"
      >
        <CheckIcon size={13} />
      </button>
      <button
        onClick={onClose}
        className="p-0.5 text-muted-foreground hover:text-foreground transition-colors"
      >
        <XIcon size={13} />
      </button>
    </div>
  );
}

export default function BookmarkCard({ bookmark, collections, dispatch, compact = false }: BookmarkCardProps) {
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { tweet } = bookmark;
  const collection = collections.find((c) => c.id === bookmark.collectionId);
  const collectionName = bookmark.collectionId === 'inbox' ? 'Inbox' : collection?.name ?? bookmark.collectionId;

  return (
    <article className="bg-card border border-border rounded-xl overflow-visible group hover:border-foreground/20 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4">
        <div className="flex items-start gap-3 min-w-0">
          <Avatar displayName={tweet.author.displayName} username={tweet.author.username} size={34} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground leading-tight">
              {tweet.author.displayName}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">@{tweet.author.username}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {!bookmark.isRead && (
            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" title="Unread" />
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
        {/* Collection + save date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <FolderIcon size={12} />
            <span>{collectionName}</span>
          </div>
          <span className="text-xs text-muted-foreground">{formatRelative(bookmark.savedAt)}</span>
        </div>

        {/* Tags */}
        {(bookmark.tags.length > 0 || showTagInput) && (
          <div className="flex flex-wrap items-center gap-1.5">
            {bookmark.tags.map((tag) => (
              <Tag
                key={tag}
                label={tag}
                onRemove={() => dispatch({ type: 'REMOVE_TAG', id: bookmark.id, tag })}
              />
            ))}
            {showTagInput && (
              <TagInput
                onAdd={(tag) => dispatch({ type: 'ADD_TAG', id: bookmark.id, tag })}
                onClose={() => setShowTagInput(false)}
              />
            )}
          </div>
        )}

        {/* Note */}
        {bookmark.note && (
          <div className="flex gap-2 text-xs text-muted-foreground italic">
            <EditIcon size={12} className="flex-shrink-0 mt-0.5 not-italic" />
            <span className="line-clamp-2">{bookmark.note}</span>
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between px-5 py-3 mt-3 border-t border-border/60">
        {/* Left actions */}
        <div className="flex items-center gap-0.5">
          <ActionButton
            onClick={() => dispatch({ type: 'TOGGLE_FAVORITE', id: bookmark.id })}
            active={bookmark.isFavorite}
            activeColor="#D97706"
            label={bookmark.isFavorite ? 'Unfavorite' : 'Favorite'}
          >
            <StarIcon size={15} filled={bookmark.isFavorite} />
          </ActionButton>

          <ActionButton
            onClick={() => dispatch({ type: 'TOGGLE_READ', id: bookmark.id })}
            label={bookmark.isRead ? 'Mark unread' : 'Mark read'}
          >
            {bookmark.isRead ? <EyeIcon size={15} /> : <EyeOffIcon size={15} />}
          </ActionButton>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-0.5">
          <ActionButton onClick={() => setShowTagInput((v) => !v)} label="Add tag">
            <TagIcon size={15} />
          </ActionButton>

          <div className="relative">
            <ActionButton onClick={() => setShowMoveMenu((v) => !v)} label="Move to collection">
              <FolderIcon size={15} />
            </ActionButton>
            {showMoveMenu && (
              <MoveMenu
                currentCollectionId={bookmark.collectionId}
                collections={collections}
                onMove={(id) => dispatch({ type: 'MOVE_TO_COLLECTION', id: bookmark.id, collectionId: id })}
                onClose={() => setShowMoveMenu(false)}
              />
            )}
          </div>

          <ActionButton onClick={() => setShowNoteModal(true)} label="Edit note" active={!!bookmark.note}>
            <EditIcon size={15} />
          </ActionButton>

          <ActionButton
            onClick={() => window.open(tweet.url, '_blank')}
            label="Open on X"
          >
            <ExternalLinkIcon size={15} />
          </ActionButton>

          {confirmDelete ? (
            <div className="flex items-center gap-1 ml-1">
              <span className="text-xs text-muted-foreground">Delete?</span>
              <button
                onClick={() => dispatch({ type: 'DELETE_BOOKMARK', id: bookmark.id })}
                className="text-xs text-red-600 font-medium hover:opacity-70 px-1.5 py-0.5 rounded border border-red-200 bg-red-50"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-muted-foreground hover:text-foreground px-1.5 py-0.5"
              >
                No
              </button>
            </div>
          ) : (
            <ActionButton
              onClick={() => setConfirmDelete(true)}
              label="Delete"
              className="hover:text-red-500"
            >
              <TrashIcon size={15} />
            </ActionButton>
          )}
        </div>
      </div>

      {showNoteModal && (
        <NoteModal
          initial={bookmark.note}
          onSave={(note) => dispatch({ type: 'SET_NOTE', id: bookmark.id, note })}
          onClose={() => setShowNoteModal(false)}
        />
      )}
    </article>
  );
}

function ActionButton({
  children,
  onClick,
  label,
  active,
  activeColor,
  className = '',
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  active?: boolean;
  activeColor?: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`p-1.5 rounded-md transition-colors ${
        active
          ? 'text-amber-500'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      } ${className}`}
      style={active && activeColor ? { color: activeColor } : undefined}
    >
      {children}
    </button>
  );
}
