import {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { MOTION } from "../lib/motion";
import { CheckIcon, XIcon } from "../icons";

interface ToastItem {
  id: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastContextValue {
  show: (
    message: string,
    opts?: { actionLabel?: string; onAction?: () => void },
  ) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback(
    (
      message: string,
      opts?: { actionLabel?: string; onAction?: () => void },
    ) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, ...opts }]);
      // Auto-dismiss after 5s — long enough to act on Undo without lingering.
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    [],
  );

  function dismiss(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-100 flex flex-col gap-2 items-center">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.12 } }}
              transition={MOTION.ui}
              className="flex items-center gap-3 bg-foreground text-background rounded-lg pl-3 pr-2 py-2 shadow-lg text-sm"
            >
              <CheckIcon size={14} className="shrink-0" />
              <span>{t.message}</span>
              {t.actionLabel && t.onAction && (
                <button
                  onClick={() => {
                    t.onAction?.();
                    dismiss(t.id);
                  }}
                  className="font-medium underline underline-offset-2 hover:opacity-80 transition-opacity shrink-0"
                >
                  {t.actionLabel}
                </button>
              )}
              <button
                onClick={() => dismiss(t.id)}
                className="text-background/60 hover:text-background transition-colors shrink-0"
              >
                <XIcon size={13} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
