import React from "react";

interface SiftLoaderProps {
  label?: string;
  fullScreen?: boolean;
}

export default function SiftLoader({
  label = "Sifting through your bookmarks…",
  fullScreen = false,
}: SiftLoaderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${
        fullScreen ? "h-screen" : "py-20"
      }`}
    >
      <div className="sift-loader-mark" aria-hidden="true">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 6h16M4 12h8m-8 6h6"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-border"
          />
        </svg>
        <span className="sift-loader-dot sift-loader-dot-1" />
        <span className="sift-loader-dot sift-loader-dot-2" />
        <span className="sift-loader-dot sift-loader-dot-3" />
      </div>

      {label && <p className="text-sm text-muted-foreground">{label}</p>}

      <style>{`
        .sift-loader-mark {
          position: relative;
          width: 36px;
          height: 36px;
        }
        .sift-loader-dot {
          position: absolute;
          top: 2px;
          width: 4px;
          height: 4px;
          border-radius: 9999px;
          background: var(--primary, #0F6B5C);
          opacity: 0;
          animation: sift-loader-fall 1.5s ease-in infinite;
        }
        .sift-loader-dot-1 { left: 9px; animation-delay: 0s; }
        .sift-loader-dot-2 { left: 17px; animation-delay: 0.5s; }
        .sift-loader-dot-3 { left: 13px; animation-delay: 1s; }

        @keyframes sift-loader-fall {
          0% { top: 2px; opacity: 0; }
          12% { opacity: 1; }
          60% { top: 26px; opacity: 1; }
          75% { opacity: 0; }
          100% { top: 26px; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
