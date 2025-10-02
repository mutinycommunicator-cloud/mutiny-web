// src/ui/Header.tsx
import React from "react";

export function Header(props: {
  onOpenPlugins(): void;
  onLogout(): void;
  user?: { name: string };
}) {
  return (
    <header style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "10px 16px", borderBottom: "1px solid #23262e",
      background: "#0e1016", position: "sticky", top: 0, zIndex: 10
    }}>
      <b style={{fontSize: 18}}>Mutiny Communicator</b>
      <span style={{opacity:.65, fontSize:12}}>stream · chat · plugins</span>
      <div style={{marginLeft:"auto", display:"flex", gap:8}}>
        <button onClick={props.onOpenPlugins}
          style={btn("ghost")}>Plugin Store</button>
        {props.user
          ? <button onClick={props.onLogout} style={btn("ghost")}>Logout</button>
          : null}
      </div>
    </header>
  );
}

function btn(kind: "ghost" | "primary" = "primary") {
  return {
    padding:"8px 12px", borderRadius:10, cursor:"pointer",
    background: kind==="primary" ? "#5b6eff" : "#0b0c10",
    border: "1px solid " + (kind==="primary" ? "#7785ff" : "#23262e"),
    color:"#e7ebf0"
  } as React.CSSProperties;
}
