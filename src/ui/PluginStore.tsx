// src/ui/PluginStore.tsx
import React from "react";
import { plugins } from "../api";

export function PluginStore() {
  const [q, setQ] = React.useState("");
  const [cat,setCat] = React.useState("");
  const [items,setItems] = React.useState<any[]>([]);
  const [loading,setLoading] = React.useState(false);

  async function load() {
    setLoading(true);
    try { setItems((await plugins.search(q,cat)).items || []); }
    finally { setLoading(false); }
  }
  React.useEffect(()=>{ load(); }, []);

  return (
    <div style={{padding:16}}>
      <h2 style={{marginTop:0}}>Plugin Store</h2>
      <div style={{display:"flex", gap:8, flexWrap:"wrap", marginBottom:12}}>
        <input placeholder="Search" value={q} onChange={e=>setQ(e.target.value)}
          style={inp}/>
        <select value={cat} onChange={e=>setCat(e.target.value)} style={inp}>
          <option value="">All categories</option>
          <option value="media">Media</option>
          <option value="overlay">Overlay</option>
          <option value="chat">Chat</option>
          <option value="rtc">RTC</option>
          <option value="analytics">Analytics</option>
          <option value="misc">Misc</option>
        </select>
        <button onClick={load} style={btn()}>Search</button>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:12}}>
        {items.map(p => (
          <div key={p.id} style={{border:"1px solid #23262e", borderRadius:16, padding:12}}>
            <div style={{fontWeight:700}}>{p.name}</div>
            <div style={{opacity:.7, fontSize:12}}>v{p.version} · {p.categories?.join(" · ")||"misc"}</div>
            <div style={{marginTop:8, display:"flex", gap:8}}>
              <button onClick={()=>alert("Installed (demo).")} style={btn("ghost")}>Install</button>
              {p.capabilities?.includes("payments") &&
                <button onClick={()=>alert("Payment processing plugin necessary.")} style={btn("ghost")}>Monetize</button>}
            </div>
          </div>
        ))}
        {!items.length && !loading && <div style={{opacity:.7}}>No plugins yet.</div>}
      </div>
    </div>
  );
}
const btn = (k:"primary"|"ghost"="primary") => ({
  padding:"8px 10px", borderRadius:10, cursor:"pointer",
  background: k==="primary" ? "#5b6eff" : "#0b0c10",
  border: "1px solid " + (k==="primary" ? "#7785ff" : "#23262e"),
  color:"#e7ebf0"
}) as React.CSSProperties;

const inp: React.CSSProperties = {
  padding:"8px 10px", borderRadius:10, background:"#0b0c10",
  border:"1px solid #23262e", color:"#e7ebf0"
};
