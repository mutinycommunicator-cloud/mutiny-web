// src/ui/Header.tsx
import React from "react";
import { api, tokens } from "@/api";

type HeaderProps = {
  title?: string;
  onOpenHome?: () => void;
  onOpenPlugins?: () => void;
  onOpenStudio?: () => void;
  onOpenDMs?: () => void;
  onLoggedIn?: () => void;   // called after login/logout to let parent refresh
};

export default function Header({
  title = "Mutiny Communicator",
  onOpenHome,
  onOpenPlugins,
  onOpenStudio,
  onOpenDMs,
  onLoggedIn,
}: HeaderProps) {
  const [login, setLogin] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  const [me, setMe] = React.useState<any>(null);
  const authed = !!tokens.get();

  // fetch minimal user info when authed
  React.useEffect(() => {
    let abort = false;
    if (authed) {
      api.me().then((m) => {
        if (!abort) setMe(m);
      }).catch(() => {
        if (!abort) setMe(null);
      });
    } else {
      setMe(null);
    }
    return () => { abort = true; };
  }, [authed]);

  async function doLogin() {
    if (!login || !password) {
      alert("Enter your Revolt login and password");
      return;
    }
    try {
      setBusy(true);
      await api.revoltLogin(login, password, remember);
      setPassword("");
      onLoggedIn?.();
    } catch (e: any) {
      alert(e?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  function doLogout() {
    api.logout();
    onLoggedIn?.();
  }

  function keyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") doLogin();
  }

  const S = styles;

  return (
    <header style={S.header}>
      <div style={S.left}>
        <span style={S.brand} onClick={onOpenHome}>{title}</span>
        {authed && (
          <nav style={S.nav}>
            <button style={S.navBtn} onClick={onOpenHome}>Home</button>
            <button style={S.navBtn} onClick={onOpenDMs}>DMs</button>
            <button style={S.navBtn} onClick={onOpenStudio}>Studio</button>
            <button style={S.navBtn} onClick={onOpenPlugins}>Plugin Store</button>
          </nav>
        )}
      </div>

      <div style={S.right}>
        {!authed ? (
          <div style={S.loginRow}>
            <input
              style={S.input}
              placeholder="Revolt email or username"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
            <input
              style={S.input}
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={keyDown}
            />
            <label style={S.remember}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />{" "}
              Remember me
            </label>
            <button style={S.primaryBtn} onClick={doLogin} disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </div>
        ) : (
          <div style={S.userRow}>
            <span style={S.userBadge}>
              {me?.username || me?.name || "Logged in"}
            </span>
            <button style={S.secondaryBtn} onClick={doLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "0 14px",
    background: "#0b0c10",
    color: "#e7ebf0",
    borderBottom: "1px solid #23262e",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  left: { display: "flex", alignItems: "center", gap: 14 },
  brand: {
    fontWeight: 800,
    cursor: "pointer",
    userSelect: "none",
  },
  nav: { display: "flex", gap: 8 },
  navBtn: {
    padding: "8px 10px",
    borderRadius: 10,
    background: "#0f1218",
    border: "1px solid #2b2f39",
    color: "#e7ebf0",
    cursor: "pointer",
  },
  right: { display: "flex", alignItems: "center" },
  loginRow: { display: "flex", alignItems: "center", gap: 8 },
  input: {
    width: 200,
    padding: "8px 10px",
    borderRadius: 10,
    background: "#0f1218",
    border: "1px solid #2b2f39",
    color: "#e7ebf0",
  },
  remember: { fontSize: 13, opacity: 0.9, display: "flex", alignItems: "center", gap: 6 },
  primaryBtn: {
    padding: "8px 12px",
    borderRadius: 10,
    background: "#5b6eff",
    border: "1px solid #7785ff",
    color: "#fff",
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "8px 10px",
    borderRadius: 10,
    background: "#1f2937",
    border: "1px solid #334155",
    color: "#fff",
    cursor: "pointer",
  },
  userRow: { display: "flex", alignItems: "center", gap: 10 },
  userBadge: {
    padding: "6px 10px",
    borderRadius: 999,
    background: "#111318",
    border: "1px solid #2b2f39",
    fontSize: 13,
  },
};
