import { useState } from 'react';
import { useCreateApiToken } from '../hooks/useApiTokens';

// postMessage target origin is always window.location.origin — the bridge
// content script in the extension only listens on the page's own origin, so
// this never needs to know its own domain explicitly.
export default function ConnectExtension() {
  const createToken = useCreateApiToken();
  const [done, setDone] = useState(false);

  function handleApprove() {
    createToken.mutate(
      { type: 'EXTENSION', name: 'Chrome Extension' },
      {
        onSuccess: (data) => {
          window.postMessage(
            { type: 'SIFT_EXTENSION_TOKEN', token: data.token },
            window.location.origin
          );
          setDone(true);
        },
      }
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm bg-card border border-border rounded-xl p-8 text-center">
        <div className="w-10 h-10 rounded-lg bg-primary mx-auto mb-5 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16M4 12h8m-8 6h6" />
          </svg>
        </div>

        {!done ? (
          <>
            <h1 className="text-lg font-bold text-foreground mb-2">Connect Chrome Extension</h1>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              This lets the Sift Chrome extension save bookmarks to your account.
              You can revoke access anytime from Settings.
            </p>
            <button
              onClick={handleApprove}
              disabled={createToken.isPending}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {createToken.isPending ? 'Connecting…' : 'Approve connection'}
            </button>
            {createToken.isError && (
              <p className="text-xs text-red-600 mt-3">Something went wrong. Please try again.</p>
            )}
          </>
        ) : (
          <>
            <h1 className="text-lg font-bold text-foreground mb-2">Connected!</h1>
            <p className="text-sm text-muted-foreground">
              You can close this tab and return to the extension.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
