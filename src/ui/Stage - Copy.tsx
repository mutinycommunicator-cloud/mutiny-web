iimport React from "react";

export default function Stage() {
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 16, padding: 16 }}>
      <b>Stage (Queue → Backstage → On-Air)</b>
      <div style={{ opacity: .7, fontSize: 12, marginTop: 6 }}>
        Drag & drop and hotkeys will land here. For now this is a placeholder.
      </div>
    </div>
  );
}

