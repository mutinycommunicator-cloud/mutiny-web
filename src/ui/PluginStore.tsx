import React, { useEffect, useState } from "react";
import { PluginsAPI, RegistryItem } from "../util/plugins";

export default function PluginStore(){
  const [items,setItems]=useState<RegistryItem[]>([]);
  const [q,setQ]=useState(""); const [cat,setCat]=useState("");
  const [manifest,setManifest]=useState(""); const [busy,setBusy]=useState(false);

  async function load(){ const j = await PluginsAPI.search(q,cat); setItems(j.items||[]); }
  useEffect(()=>{ load(); },[]);

  async function submit(){
    if(!manifest.trim()) return;
    setBusy(true);
    await PluginsAPI.submit(manifest.trim());
    setManifest(""); setBusy(false);
    alert("Submitted! An admin must approve it before it appears.");
  }
  async function install(id:string){ setBusy(true); await PluginsAPI.install(id); setBusy(false); alert("Installed."); }
  async function uninstall(id:string){ setBusy(true); await PluginsAPI.uninstall(id); setBusy(false); alert("Uninstalled."); }

  return (
    <div style={{padding:16}}>
      <h2 style={{marginTop:0}}>Plugin Store</h2>

      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
        <input placeholder="Search" value={q} onChange={e=>setQ(e.target.value)}
               style={{padding:"8px 10px",borderRadius:10,background:"#0b0c10",border:"1px solid #23262e",color:"#e7ebf0"}}/>
        <select value={cat} onChange={e=>setCat(e.target.value)}
                style={{padding:"8px 10px",borderRadius:10,background:"#0b0c10",border:"1px solid #23262e",color:"#e7ebf0"}}>
          <option value="">All categories</option>
          <option value="overlay">Overlay</option>
          <option value="scheduling">Scheduling</option>
          <option value="chat">Chat</option>
          <option value="analytics">Analytics</option>
          <option value="misc">Misc</option>
        </select>
        <button onClick={load}
                style={{padding:"8px 10px",borderRadius:10,background:"#0b0c10",border:"1px solid #23262e",color:"#e7ebf0"}}>Search</button>
      </div>

      <div style={{border:"1px solid #23262e",borderRadius:16,padding:12,marginBottom:16}}>
        <b>Submit plugin</b>
        <div style={{display:"flex",gap:8,marginTop:8}}>
          <input placeholder="https://.../mutiny-plugin.json" value={manifest} onChange={e=>setManifest(e.target.value)}
                 style={{flex:1,padding:"8px 10px",borderRadius:10,background:"#0b0c10",border:"1px solid #23262e",color:"#e7ebf0"}}/>
          <button onClick={submit} disabled={busy}
                  style={{padding:"8px 10px",borderRadius:10,background:"#5b6eff",border:"1px solid #7785ff",color:"#fff"}}>{busy?"Submitting…":"Submit"}</button>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
        {items.map(p=>(
          <div key={p.id} style={{border:"1px solid #23262e",borderRadius:16,padding:12}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              {p.icon && <img src={p.icon} alt="" width="28" height="28" style={{borderRadius:6}}/>}
              <div>
                <div style={{fontWeight:700}}>{p.name}</div>
                <div style={{opacity:.7,fontSize:12}}>{p.id} · v{p.version}</div>
              </div>
            </div>
            <div style={{marginTop:8,opacity:.8,fontSize:12}}>
              {p.categories?.join(" · ") || "misc"}
            </div>
            <div style={{display:"flex",gap:8,marginTop:10}}>
              <button onClick={()=>install(p.id)}
                      style={{padding:"6px 10px",borderRadius:10,background:"#1f2937",border:"1px solid #334155",color:"#fff"}}>Install</button>
              <button onClick={()=>uninstall(p.id)}
                      style={{padding:"6px 10px",borderRadius:10,background:"#251b1b",border:"1px solid #442",color:"#f88"}}>Uninstall</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
