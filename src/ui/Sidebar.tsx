// src/ui/Sidebar.tsx
import React from "react";

type Item = { key: ViewKey; label: string; icon?: string };
export type ViewKey = "home"|"dms"|"groups"|"studio"|"schedule"|"plugins";

const NAV: Item[] = [
  { key:"home",     label:"Home" },
  { key:"dms",      label:"DMs" },
  { key:"groups",   label:"Groups" },
  { key:"studio",   label:"Studio" },
  { key:"schedule", label:"Scheduler" },
  { key:"plugins",  label:"Plugins" },
];

export function Sidebar({current, onChange}:{current:ViewKey; onChange(v:ViewKey):void}) {
  return (
    <aside style={{
      width: 230, borderRight:"1px solid #23262e", padding:12, background:"#0b0c10",
      position:"sticky", top:0, alignSelf:"start", height:"100vh"
    }}>
      <div style={{fontWeight:800, marginBottom:12}}>Menu</div>
      {NAV.map(it => (
        <button key={it.key}
          onClick={()=>onChange(it.key)}
          style={{
            display:"block", width:"100%", textAlign:"left", marginBottom:8,
            padding:"9px 10px", borderRadius:10, cursor:"pointer",
            background: current===it.key ? "#1f2937":"#0b0c10",
            border: "1px solid #23262e", color:"#e7ebf0"
          }}>
          {it.label}
        </button>
      ))}
      <div style={{opacity:.65, fontSize:12, marginTop:16}}>
        Tools (PeerSuite-style)
      </div>
      {["Screen","Whiteboard","Kanban"].map(k=>(
        <div key={k} style={{opacity:.65, fontSize:12, padding:"6px 2px"}}>• {k} (soon)</div>
      ))}
    </aside>
  );
}
