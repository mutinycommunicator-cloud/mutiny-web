import React, { useEffect, useState } from "react";
import { logout, me, themeSet, themeCurrent } from "@/lib/api";

export function HeaderBar({
  onOpenPlugins, onOpenLogin, onLoggedOut, onLayoutToggle,
}:{
  onOpenPlugins:()=>void; onOpenLogin:()=>void; onLoggedOut:()=>void; onLayoutToggle:()=>void;
}) {
  const [user, setUser] = useState<any>(null);
  const [curr, setCurr] = useState<string>("default");

  useEffect(() => {
    (async () => {
      try { const m = await me(); setUser(m.user || null); } catch {}
      try { const c = await themeCurrent(); setCurr(c?.id || "default"); applyTheme(c?.id || "default"); } catch {}
    })();
  }, []);

  function applyTheme(id: string) {
    setCurr(id);
    document.documentElement.setAttribute("data-theme", id === "revolt" ? "revolt" : "default");
    themeSet(id).catch(()=>{});
  }

  async function doLogout() { await logout(); setUser(null); onLoggedOut(); }

  return (
    <header style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 16px", borderBottom:"1px solid var(--border)" }}>
      <b>Mutiny Communicator</b>
      <button onClick={onLayoutToggle} style={btn}>Toggle Layout</button>
      <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
        <select value={curr} onChange={e=>applyTheme(e.target.value)} style={sel}>
          <option value="default">Default Theme</option>
          <option value="revolt">Revolt Theme</option>
        </select>
        <button onClick={onOpenPlugins} style={btn}>Plugins</button>
        {user
          ? <>
              <span style={{opacity:.7, fontSize:12}}>Hi, {user.name||user.id}</span>
              <button onClick={doLogout} style={btn}>Logout</button>
            </>
          : <button onClick={onOpenLogin} style={btnPrimary}>Login</button>
        }
      </div>
    </header>
  );
}
const btn: React.CSSProperties = { padding:"8px 10px", borderRadius:10, background:"var(--bg)", border:"1px solid var(--border)", color:"var(--text)" };
const btnPrimary: React.CSSProperties = { padding:"8px 10px", borderRadius:10, background:"var(--accent)", border:"1px solid var(--accent-2)", color:"#fff" };
const sel: React.CSSProperties = { padding:"8px 10px", borderRadius:10, background:"var(--bg)", border:"1px solid var(--border)", color:"var(--text)" };
export default HeaderBar;
