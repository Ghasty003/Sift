import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ApiCollection } from "../types/api";
import { FolderIcon, TrashIcon, CheckCircleIcon, XIcon } from "../icons";
import { MOTION, prefersReducedMotion } from "../lib/motion";
import { useBulkDelete, useBulkMove } from "../hooks/useBookmarks";
import { useToast } from "./Toast";

interface BulkActionBarProps {
  selectedIds: string[];
  collections: ApiCollection[];
  onClear: () => void;
}

export default function BulkActionBar({
  selectedIds,
  collections,
  onClear,
}: BulkActionBarProps) {
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const bulkDelete = useBulkDelete();
  const bulkMove = useBulkMove();
  const toast = useToast();
  const reduceMotion = prefersReducedMotion();

  const count = selectedIds.length;

  function handleDelete() {
    bulkDelete.mutate(selectedIds, {
      onSuccess: () => {
        toast.show(`Deleted ${count} bookmark${count !== 1 ? "s" : ""}`);
        onClear();
      },
    });
  }

  function handleMove(collectionId: string, collectionName: string) {
    bulkMove.mutate(
      { bookmarkIds: selectedIds, collectionId },
      {
        onSuccess: () => {
          toast.show(
            `Moved ${count} bookmark${count !== 1 ? "s" : ""} to ${collectionName}`,
          );
          onClear();
        },
      },
    );
    setShowMoveMenu(false);
  }

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          transition={MOTION.ui}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-foreground text-background rounded-xl pl-4 pr-2 py-2 shadow-lg"
        >
          <span className="text-sm font-medium">{count} selected</span>
          <div className="w-px h-4 bg-background/20" />

          <div className="relative">
            <button
              onClick={() => setShowMoveMenu((v) => !v)}
              disabled={collections.length === 0 || bulkMove.isPending}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm rounded-lg hover:bg-background/10 transition-colors disabled:opacity-40"
            >
              <FolderIcon size={14} />
              Move
            </button>
            <AnimatePresence>
              {showMoveMenu && (
                <motion.div
                  initial={
                    reduceMotion ? undefined : { opacity: 0, scale: 0.96, y: 4 }
                  }
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={
                    reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.96, y: 4 }
                  }
                  transition={MOTION.ui}
                  className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-lg shadow-lg py-1 min-w-44 text-foreground origin-bottom-left"
                >
                  {collections.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleMove(c.id, c.name)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted transition-colors"
                    >
                      {c.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleDelete}
            disabled={bulkDelete.isPending}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm rounded-lg text-red-300 hover:bg-background/10 transition-colors disabled:opacity-40"
          >
            <TrashIcon size={14} />
            {bulkDelete.isPending ? "Deleting…" : "Delete"}
          </button>

          <div className="w-px h-4 bg-background/20" />

          <button
            onClick={onClear}
            title="Clear selection"
            className="p-1.5 rounded-lg hover:bg-background/10 transition-colors"
          >
            <XIcon size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
