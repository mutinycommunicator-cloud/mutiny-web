import React from "react";
import type { Role } from "@/lib/rtc";

type Tile = { userId: string; name: string; mutedA?: boolean; mutedV?: boolean; role: Role };

export function Stage({ tiles }: { tiles: Tile[] }) {
  const onair = tiles.filter(t => t.role === "onair");
  return (
    <div style={{ border: "1px solid #23262e", borderRadius: 16, padding: 12, minHeight: 260 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>On-Air</div>
      {onair.length === 0 ? (
        <div style={{ opacity: .6, fontSize: 13 }}>Nobody on-air yet.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
          {onair.map(t => (
            <div key={t.userId} style={{
              border: "1px solid #23262e",
              borderRadius: 12,
              padding: 10,
              background: "#0b0c10",
              display: "grid", gap: 6
            }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <b>{t.name}</b>
                <div>{t.mutedA ? "🔇" : "🎙️"} {t.mutedV ? "🚫📷" : "📷"}</div>
              </div>
              <div style={{
                background: "#111318", border: "1px solid #23262e", borderRadius: 10,
                height: 120, display: "grid", placeItems: "center", opacity: .5
              }}>
                video feed
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
