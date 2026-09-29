import { useEffect, useRef } from "react";
import { useGoogleScriptLoaded } from "../hooks/useGoogleScript";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: Record<string, unknown>,
          ) => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as
  | string
  | undefined;

interface GoogleSignInButtonProps {
  onCredential: (idToken: string) => void;
  disabled?: boolean;
}

export default function GoogleSignInButton({
  onCredential,
  disabled,
}: GoogleSignInButtonProps) {
  const scriptLoaded = useGoogleScriptLoaded();
  const containerRef = useRef<HTMLDivElement>(null);
  // Keeps the latest callback available without re-initializing Google's
  // button every render (a new inline arrow function each render would
  // otherwise be treated as a dependency change).
  const onCredentialRef = useRef(onCredential);
  onCredentialRef.current = onCredential;

  useEffect(() => {
    if (!scriptLoaded || !window.google || !containerRef.current) return;
    if (!GOOGLE_CLIENT_ID) {
      console.error("VITE_GOOGLE_CLIENT_ID is not set");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => onCredentialRef.current(response.credential),
    });

    window.google.accounts.id.renderButton(containerRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      width: 340,
      text: "continue_with",
      shape: "rectangular",
      logo_alignment: "center",
    });
  }, [scriptLoaded]);

  return (
    <div
      ref={containerRef}
      className={disabled ? "pointer-events-none opacity-50" : ""}
    />
  );
}
