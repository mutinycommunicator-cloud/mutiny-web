import React, { useState } from "react";
import { revolt } from "@/api";

export default function Header(props: {
  onOpenStore: () => void;
  onOpenCreateGroup: () => void;
  onOpenJoinInvite: () => void;
}) {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function doLogin() {
    try {
      setBusy(true); setErr("");
      await revolt.login(email.trim(), password, remember);
      setShowLogin(false);
      location.reload();
    } catch (e: any) { setErr(e.message || "Login failed"); }
    finally { setBusy(false); }
  }

  return (
    <header style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "10px 16px", borderBottom: "1px solid #23262e"
    }}>
      <b>Mutiny Communicator — Channel-Weaver</b>

      <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
        <button onClick={props.onOpenCreateGroup}>+ Group</button>
        <button onClick={props.onOpenJoinInvite}>Join via Invite</button>
        <button onClick={props.onOpenStore}>Plugins</button>

        {/* Login / Logout */}
        {!localStorage.getItem("mutiny_revolt_token") && !sessionStorage.getItem("mutiny_revolt_token") ? (
          <>
            <button onClick={() => setShowLogin(true)}>Login</button>
            {showLogin && (
              <div style={{
                position: "fixed", inset: 0, background: "rgba(0,0,0,.4)"
              }} onClick={() => setShowLogin(false)}>
                <div onClick={e => e.stopPropagation()}
                  style={{ width: 360, maxWidth: "92%", background: "#111318",
                    color: "#e7ebf0", border: "1px solid #23262e", borderRadius: 16,
                    padding: 16, position: "absolute", top: "12%", left: "50%", transform: "translateX(-50%)" }}>
                  <h3 style={{ marginTop: 0 }}>Login to Revolt</h3>
                  <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                         style={{ width: "100%", padding: 10, borderRadius: 10, background: "#0b0c10",
                           border: "1px solid #23262e", color: "#e7ebf0" }}/>
                  <input type="password" placeholder="Password" value={password}
                         onChange={e => setPassword(e.target.value)}
                         onKeyDown={e => e.key === "Enter" && doLogin()}
                         style={{ width: "100%", marginTop: 8, padding: 10, borderRadius: 10, background: "#0b0c10",
                           border: "1px solid #23262e", color: "#e7ebf0" }}/>
                  <label style={{ display: "flex", gap: 6, fontSize: 12, marginTop: 8, opacity: .8 }}>
                    <input type="checkbox" checked={remember}
                           onChange={e => setRemember(e.target.checked)}/>
                    Remember me (stores token)
                  </label>
                  {err && <div style={{ color: "#f66", fontSize: 13, marginTop: 6 }}>{err}</div>}
                  <button onClick={doLogin} disabled={busy}
                          style={{ marginTop: 10, width: "100%", padding: 10, borderRadius: 10,
                            background: "#5b6eff", border: "1px solid #7785ff", color: "#fff" }}>
                    {busy ? "Signing in…" : "Sign in"}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <button onClick={() => { revolt.logout().then(() => location.reload()); }}>Logout</button>
        )}
      </div>
    </header>
  );
}
