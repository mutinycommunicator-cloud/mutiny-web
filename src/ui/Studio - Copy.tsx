// src/ui/Studio.tsx
import React from "react";

export function Studio() {
  return (
    <div style={{display:"grid", gridTemplateColumns:"280px 1fr 320px", height:"calc(100vh - 56px)"}}>
      <div style={{borderRight:"1px solid #23262e", padding:12}}>
        <b>People</b>
        <div style={{opacity:.7, fontSize:12, marginTop:6}}>Host + guests list · invite controls (soon)</div>
      </div>

      <div style={{display:"grid", gridTemplateRows:"auto 1fr auto"}}>
        <div style={{padding:"10px 12px", borderBottom:"1px solid #23262e"}}>
          <b>Stage</b>
          <span style={{opacity:.7, marginLeft:8, fontSize:12}}>
            Queue → Backstage → On-Air
          </span>
        </div>
        <div style={{display:"grid", placeItems:"center", color:"#9fb1ff"}}>
          (Stream canvas / scenes here)
        </div>
        <div style={{padding:12, borderTop:"1px solid #23262e"}}>
          Tip: OBS Browser Source → <code>/overlay-now.html?channel=&lt;id&gt;</code>
        </div>
      </div>

      <div style={{borderLeft:"1px solid #23262e", padding:12}}>
        <b>Schedule</b>
        <div style={{opacity:.7, fontSize:12, marginTop:6}}>
          Reads “current block” from backend. Media plugins (YouTube, Twitch, MP4) auto-play when a block starts.
        </div>
      </div>
    </div>
  );
}
