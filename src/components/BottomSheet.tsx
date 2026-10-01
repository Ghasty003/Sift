import type { ReactNode } from "react";
import { motion } from "motion/react";
import { MOTION, prefersReducedMotion } from "../lib/motion";

interface BottomSheetProps {
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export default function BottomSheet({
  onClose,
  children,
  title,
}: BottomSheetProps) {
  const reduceMotion = prefersReducedMotion();

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/30"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={MOTION.ui}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-lg bg-card rounded-t-2xl border-t border-x border-border shadow-2xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        initial={reduceMotion ? undefined : { y: "100%" }}
        animate={{ y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { y: "100%" }}
        transition={MOTION.layout}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.4 }}
        onDragEnd={(_, info) => {
          // A real downward flick or drag past 100px dismisses — this is the
          // one genuinely useful swipe interaction the brief calls for.
          if (info.offset.y > 100 || info.velocity.y > 500) onClose();
        }}
      >
        <div className="flex justify-center pt-2.5 pb-1">
          <span className="w-9 h-1 rounded-full bg-border" />
        </div>
        {title && (
          <div className="px-5 pb-3 pt-1">
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          </div>
        )}
        <div className="pb-[env(safe-area-inset-bottom,16px)]">{children}</div>
      </motion.div>
    </motion.div>
  );
}
