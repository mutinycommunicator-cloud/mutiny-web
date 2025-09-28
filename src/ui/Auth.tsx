import React, { useState } from "react";
import { loginRevolt } from "@/lib/api";

export function AuthModal({ onClose, onLoggedIn }:{
  onClose:()=>void; onLoggedIn:()=>void;
}) {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string|null>(null);

  async function doLogin() {
    try {
      setBusy(true); setErr(null);
      await loginRevolt(id.trim(), pw);
      onLoggedIn();
      onClose();
    } catch (e:any) {
      setErr(e?.message || "Login failed");
    } finally { setBusy(false); }
  }

  return (
    <div style={backdrop} onClick={onClose}>
      <div style={modal} onClick={e=>e.stopPropagation()}>
        <h2 style={{margin:"0 0 6px"}}>Sign in to Mutiny</h2>
        <p style={{opacity:.7, fontSize:12, margin:"0 0 10px"}}>Uses your Revolt account via the Worker.</p>
        <input placeholder="Email or username" value={id} onChange={e=>setId(e.target.value)} style={inp}/>
        <input type="password" placeholder="Password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} style={inp}/>
        {err && <div style={{color:"#f66", fontSize:13, marginTop:6}}>{err}</div>}
        <button onClick={doLogin} disabled={busy} style={btnPrimary}>{busy?"Signing in…":"Sign in"}</button>
      </div>
    </div>
  );
}

const backdrop: React.CSSProperties = { position:"fixed", inset:0, background:"rgba(0,0,0,.5)", display:"grid", placeItems:"center", zIndex:50 };
const modal: React.CSSProperties = { width:380, background:"var(--panel)", border:"1px solid var(--border)", borderRadius:16, padding:20 };
const inp: React.CSSProperties = { width:"100%", padding:10, marginTop:8, borderRadius:10, background:"var(--bg)", border:"1px solid var(--border)", color:"var(--text)" };
const btnPrimary: React.CSSProperties = { marginTop:12, width:"100%", padding:10, borderRadius:10, background:"var(--accent)", border:"1px solid var(--accent-2)", color:"#fff" };
