// src/ui/Header.tsx
import React, { useMemo, useState } from "react";
import { loginRevolt, logoutRevolt } from "@/api";

type Props = {
  onLoggedIn?: () => void;
  onLoggedOut?: () => void;
  onOpenPlugins?: () => void;
  onSwitchView?: (v: "chat" | "studio" | "plugins") => void;
};

export default function Header({
  onLoggedIn,
  onLoggedOut,
  onOpenPlugins,
  onSwitchView,
}: Props) {
  const [showLogin, setShowLogin] = useState(false);
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // detect if we already have a session cookie
  const signedIn = useMemo(() => {
    return document.cookie.includes("mutiny_session=");
  }, [showLogin, busy]);

  async function doLogin() {
    try {
      setBusy(true);
      setErr(null);
      await loginRevolt(u.trim(), p, remember);
      setShowLogin(false);
      onLoggedIn?.();
      // Optional: reload to ensure any gated content mounts with creds
      // location.reload();
    } catch (e: any) {
      setErr(e.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  async function doLogout() {
    try {
      await logoutRevolt();
    } finally {
      onLoggedOut?.();
      // Optional hard reload to clear any state
      // location.reload();
    }
  }

  return (
    <>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 16px",
          borderBottom: "1px solid #23262e",
          background: "#0b0c10",
          color: "#e7ebf0",
        }}
      >
        <b style={{ fontSize: 16 }}>Mutiny Communicator</b>

        <div style={{ display: "flex", gap: 8, marginLeft: 12 }}>
          <button onClick={() => onSwitchView?.("chat")}>Chat</button>
          <button onClick={() => onSwitchView?.("studio")}>Studio</button>
          <button onClick={() => onSwitchView?.("plugins") || onOpenPlugins?.()}>
            Plugin Store
          </button>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {/* Mode toggles requested: Server (Revolt) vs P2P (WebRTC preview) */}
          <select
            defaultValue={localStorage.getItem("mutiny_mode") || "server"}
            onChange={(e) => localStorage.setItem("mutiny_mode", e.target.value)}
            title="Stream mode"
            style={{ padding: "6px 8px", borderRadius: 8, background: "#0b0c10", border: "1px solid #23262e", color: "#e7ebf0" }}
          >
            <option value="server">Server (Revolt)</option>
            <option value="p2p">P2P (WebRTC)</option>
          </select>

          {/* Quick preview toggle flag */}
          <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, opacity: 0.9 }}>
            <input
              type="checkbox"
              defaultChecked={localStorage.getItem("mutiny_preview") === "1"}
              onChange={(e) => localStorage.setItem("mutiny_preview", e.target.checked ? "1" : "0")}
            />
            Preview
          </label>

          {!signedIn ? (
            <button onClick={() => setShowLogin(true)}>Login</button>
          ) : (
            <button onClick={doLogout}>Logout</button>
          )}
        </div>
      </header>

      {showLogin && (
        <div
          onClick={() => !busy && setShowLogin(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.55)",
            display: "grid",
            placeItems: "center",
            zIndex: 50,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 420,
              maxWidth: "92%",
              background: "#111318",
              border: "1px solid #23262e",
              borderRadius: 16,
              padding: 16,
            }}
          >
            <h3 style={{ margin: 0 }}>Sign in to Mutiny</h3>
            <p style={{ opacity: 0.7, fontSize: 12 }}>
              Uses your Revolt account (secure cookie).
            </p>

            <input
              placeholder="Email or username"
              value={u}
              onChange={(e) => setU(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                marginTop: 10,
                borderRadius: 10,
                background: "#0b0c10",
                border: "1px solid #23262e",
                color: "#e7ebf0",
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={p}
              onChange={(e) => setP(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doLogin()}
              style={{
                width: "100%",
                padding: 10,
                marginTop: 8,
                borderRadius: 10,
                background: "#0b0c10",
                border: "1px solid #23262e",
                color: "#e7ebf0",
              }}
            />

            <label style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 8, fontSize: 13 }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>

            {err && (
              <div style={{ color: "#f66", fontSize: 13, marginTop: 8 }}>
                {err}
              </div>
            )}

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button
                onClick={doLogin}
                disabled={busy}
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: "#5b6eff",
                  border: "1px solid #7785ff",
                  color: "#fff",
                  flex: 1,
                }}
              >
                {busy ? "Signing in…" : "Sign in"}
              </button>
              <button
                onClick={() => setShowLogin(false)}
                disabled={busy}
                style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #23262e", flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
