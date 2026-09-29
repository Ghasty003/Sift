import React, { useEffect, useState } from "react";
import { UserIcon, ChromeIcon, SmartphoneIcon, KeyIcon } from "../icons";
import { getAvatarColor, getInitials, formatRelative } from "../data";
import { useApiTokens, useRevokeApiToken } from "../hooks/useApiTokens";
import {
  useChangePassword,
  useCurrentUser,
  useDeleteAccount,
  useUpdateProfile,
} from "@/hooks/useCurrentUser";

type Section = "account" | "extension" | "mobile";

function getErrorMessage(error: unknown, fallback: string): string {
  const message = (error as { response?: { data?: { message?: string } } })
    ?.response?.data?.message;
  return message ?? fallback;
}

function SectionNav({
  active,
  onSelect,
}: {
  active: Section;
  onSelect: (s: Section) => void;
}) {
  const items: { key: Section; label: string; icon: React.ReactNode }[] = [
    { key: "account", label: "Account", icon: <UserIcon size={15} /> },
    {
      key: "extension",
      label: "Browser Extension",
      icon: <ChromeIcon size={15} />,
    },
    {
      key: "mobile",
      label: "Mobile Shortcut",
      icon: <SmartphoneIcon size={15} />,
    },
  ];

  return (
    <nav className="space-y-0.5">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onSelect(item.key)}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
            active === item.key
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </nav>
  );
}

function AccountSection() {
  const { data: user } = useCurrentUser();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const deleteAccount = useDeleteAccount();

  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [saved, setSaved] = useState(false);

  // Keep the local input in sync once the real user loads/updates —
  // this only overwrites local state when the source of truth changes,
  // not on every render.
  useEffect(() => {
    if (user) setFullName(user.fullName);
  }, [user?.fullName]);

  function handleSaveProfile() {
    updateProfile.mutate(fullName, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      },
    });
  }

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const passwordMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  function handleChangePassword() {
    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword ||
      passwordMismatch
    )
      return;

    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setPasswordSuccess(true);
          setTimeout(() => setPasswordSuccess(false), 2000);
        },
      },
    );
  }

  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground mb-1">
          Profile
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage your account details.
        </p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-lg text-white font-bold"
          style={{
            backgroundColor: user ? getAvatarColor(user.email) : "#D4D4D8",
          }}
        >
          {user ? getInitials(user.fullName) : ""}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            {user?.fullName ?? "Loading…"}
          </p>
          <p className="text-xs text-muted-foreground">{user?.email ?? ""}</p>
        </div>
      </div>

      <div className="space-y-4 max-w-sm">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            Full name
          </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            Email address
          </label>
          <input
            type="email"
            value={user?.email ?? ""}
            disabled
            title="Email address can't be changed"
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
          />
        </div>

        {updateProfile.isError && (
          <p className="text-sm text-red-600">
            {getErrorMessage(updateProfile.error, "Couldn't save changes.")}
          </p>
        )}

        <button
          onClick={handleSaveProfile}
          disabled={updateProfile.isPending || !fullName.trim()}
          className={`px-4 py-2 text-sm rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            saved
              ? "bg-primary/20 text-primary"
              : "bg-primary text-primary-foreground hover:opacity-90"
          }`}
        >
          {updateProfile.isPending
            ? "Saving…"
            : saved
              ? "✓ Saved"
              : "Save changes"}
        </button>
      </div>

      {user?.hasPassword && (
        <div className="border-t border-border pt-6">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Change Password
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Update your password to keep your account secure.
          </p>
          <div className="space-y-3 max-w-sm">
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
            />
            {passwordMismatch && (
              <p className="text-sm text-red-600">Passwords don't match.</p>
            )}
            {changePassword.isError && (
              <p className="text-sm text-red-600">
                {getErrorMessage(
                  changePassword.error,
                  "Couldn't change password.",
                )}
              </p>
            )}
            {passwordSuccess && (
              <p className="text-sm text-primary">✓ Password updated.</p>
            )}
            <button
              onClick={handleChangePassword}
              disabled={
                changePassword.isPending ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword ||
                passwordMismatch
              }
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {changePassword.isPending ? "Updating…" : "Update password"}
            </button>
          </div>
        </div>
      )}

      <div className="border-t border-border pt-6">
        <h3 className="text-sm font-semibold text-red-600 mb-1">
          Delete Account
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Permanently delete your account and all your data. This cannot be
          undone.
        </p>

        {confirmDelete ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Are you sure?</span>
            <button
              onClick={() => deleteAccount.mutate()}
              disabled={deleteAccount.isPending}
              className="px-4 py-2 text-sm text-red-600 font-medium border border-red-200 bg-red-50 rounded-lg hover:opacity-80 disabled:opacity-60"
            >
              {deleteAccount.isPending ? "Deleting…" : "Yes, delete my account"}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="px-4 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            Delete account
          </button>
        )}

        {deleteAccount.isError && (
          <p className="text-sm text-red-600 mt-2">
            {getErrorMessage(deleteAccount.error, "Couldn't delete account.")}
          </p>
        )}
      </div>
    </div>
  );
}

function ExtensionSection() {
  const tokensQuery = useApiTokens();
  const revoke = useRevokeApiToken();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const extensionTokens = (tokensQuery.data ?? [])
    .filter((t) => t.type === "EXTENSION" && t.revokedAt === null)
    .sort((a, b) => {
      const aTime = a.lastUsedAt ? new Date(a.lastUsedAt).getTime() : 0;
      const bTime = b.lastUsedAt ? new Date(b.lastUsedAt).getTime() : 0;
      return bTime - aTime;
    });

  const isConnected = extensionTokens.length > 0;

  function handleRevoke(tokenId: string) {
    revoke.mutate(tokenId, {
      onSettled: () => setConfirmingId(null),
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground mb-1">
          Chrome Extension
        </h2>
        <p className="text-sm text-muted-foreground">
          Save X posts directly from your browser. You can connect it on more
          than one browser or device.
        </p>
      </div>

      {tokensQuery.isLoading && (
        <p className="text-sm text-muted-foreground">Checking…</p>
      )}

      {tokensQuery.isError && (
        <p className="text-sm text-red-600">
          Couldn't load connection status. Please try refreshing.
        </p>
      )}

      {!tokensQuery.isLoading && !tokensQuery.isError && !isConnected && (
        <div className="bg-card border border-border rounded-xl p-5 text-center">
          <ChromeIcon
            size={20}
            className="text-muted-foreground mx-auto mb-2"
          />
          <p className="text-sm text-muted-foreground">
            No browsers connected yet.
          </p>
        </div>
      )}

      {!tokensQuery.isLoading && !tokensQuery.isError && isConnected && (
        <div className="space-y-3">
          {extensionTokens.map((token) => (
            <div
              key={token.tokenId}
              className="bg-card border border-border rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <ChromeIcon size={18} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {token.name || "Chrome Extension"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-green-700 font-medium">
                    Connected
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Connected</span>
                  <span className="text-foreground">
                    {formatRelative(token.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Last active</span>
                  <span className="text-foreground">
                    {token.lastUsedAt ? formatRelative(token.lastUsedAt) : "—"}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                {confirmingId === token.tokenId ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Revoke access?
                    </span>
                    <button
                      onClick={() => handleRevoke(token.tokenId)}
                      disabled={revoke.isPending}
                      className="text-xs text-red-600 font-medium hover:opacity-70 px-2 py-1 rounded border border-red-200 bg-red-50 disabled:opacity-60"
                    >
                      {revoke.isPending ? "…" : "Yes, revoke"}
                    </button>
                    <button
                      onClick={() => setConfirmingId(null)}
                      className="text-xs text-muted-foreground hover:text-foreground px-2 py-1"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmingId(token.tokenId)}
                    className="text-sm text-red-600 hover:opacity-70 transition-opacity"
                  >
                    Revoke access
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-secondary/60 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          How it works
        </h3>
        <ol className="space-y-2 text-sm text-muted-foreground list-none">
          {[
            "Install the Sift extension from the Chrome Web Store.",
            "Visit any X post you want to save.",
            "Click the Sift icon in your toolbar.",
            "The bookmark appears in your Inbox instantly.",
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center shrink-0 font-medium mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function MobileSection() {
  const [showToken, setShowToken] = useState(false);
  const token = "sft_live_k9x2mP8nQrT4vL1wYcE6bA3jH5dF7gZ";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground mb-1">
          iPhone Shortcut
        </h2>
        <p className="text-sm text-muted-foreground">
          Save X posts from the iOS Share Sheet.
        </p>
      </div>

      {/* Status card */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <SmartphoneIcon size={18} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              iPhone Shortcut
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-green-700 font-medium">
              Connected
            </span>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Last used</span>
            <span className="text-foreground">Yesterday at 9:41 AM</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Token name</span>
            <span className="text-foreground">iPhone 15 Pro</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border flex gap-3">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
            <KeyIcon size={13} />
            Generate new token
          </button>
          <button className="text-sm text-red-600 hover:opacity-70 transition-opacity px-3 py-1.5">
            Revoke token
          </button>
        </div>
      </div>

      {/* API token */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-2">
          API Token
        </h3>
        <div className="bg-card border border-border rounded-lg p-3 flex items-center gap-2">
          <code className="flex-1 text-xs font-mono text-muted-foreground truncate">
            {showToken ? token : token.replace(/./g, "•").slice(0, 32)}
          </code>
          <button
            onClick={() => setShowToken((v) => !v)}
            className="text-xs text-primary hover:opacity-70 transition-opacity shrink-0"
          >
            {showToken ? "Hide" : "Reveal"}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Keep this token private. It provides write access to your bookmarks.
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-secondary/60 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          How it works
        </h3>
        <ol className="space-y-2 text-sm text-muted-foreground">
          {[
            "Download the Sift Shortcut to your iPhone.",
            "Open the X app and find a post you want to save.",
            "Tap the Share button, then select Sift.",
            "The Shortcut sends the post URL to Sift, which fetches the content.",
            "The bookmark appears in your Inbox within seconds.",
          ].map((step, i) => (
            <li key={i} className="flex gap-3 list-none">
              <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center shrink-0 font-medium mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function Settings() {
  const [section, setSection] = useState<Section>("account");

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account and connected devices.
        </p>
      </div>

      <div className="flex gap-8">
        {/* Nav */}
        <div className="w-48 shrink-0">
          <SectionNav active={section} onSelect={setSection} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {section === "account" && <AccountSection />}
          {section === "extension" && <ExtensionSection />}
          {section === "mobile" && <MobileSection />}
        </div>
      </div>
    </div>
  );
}
