// src/ui/Home.tsx
import React from "react";

export function Home() {
  // demo cards
  const cards = Array.from({length:8}).map((_,i)=>({
    id:i, title:["BeyondTheSummit","Live coding","Music set","Talk show"][i%4],
    viewers: (12_000 + i*321).toLocaleString("en-US"),
    thumb:`https://picsum.photos/seed/mutiny${i}/640/360`
  }));

  return (
    <div style={{padding:16}}>
      <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:12}}>
        <div style={{
          background:"#1e293b", padding:"14px 18px", borderRadius:16,
          color:"#e7ebf0", flex:"1 1 auto"
        }}>
          <div style={{fontWeight:700, fontSize:18}}>Featured</div>
          <div style={{opacity:.8, fontSize:12}}>Bring your channels, overlays & plugins.</div>
        </div>
      </div>

      <h3 style={{margin:"12px 0"}}>Live channels</h3>
      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:12}}>
        {cards.map(c=>(
          <div key={c.id} style={{
            border:"1px solid #23262e", borderRadius:16, overflow:"hidden"
          }}>
            <img src={c.thumb} alt="" style={{display:"block", width:"100%"}}/>
            <div style={{padding:10}}>
              <b>{c.title}</b>
              <div style={{opacity:.7, fontSize:12}}>{c.viewers} watching</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
