import React, { useEffect, useState } from "react";
import { PeoplePanel } from "@/ui/PeoplePanel";
import { Stage } from "@/ui/Stage";
import { connectSignaling } from "@/lib/rtc";

const API =
  (typeof window !== "undefined" && (window as any).MUTINY_API_BASE) ||
  import.meta.env.VITE_API_BASE ||
  "https://mutiny-api.mutinycomm.workers.dev";

export default function App() {
  const [roomId] = useState("main");
  const [me] = useState({ userId: crypto.randomUUID(), name: "You" });
  const [tiles, setTiles] = useState<any[]>([]);
  const [isHost] = useState(true); // later: decide by auth/role

  // header brand text
  useEffect(() => { document.title = "Mutiny Communicator"; }, []);

  // mirror state updates from WS into Stage tiles
  useEffect(() => {
    const conn = connectSignaling(API, roomId, (m) => {
      if (m.type === "state") setTiles(m.users);
      if (m.type === "role")  setTiles(prev => prev.map(p => p.userId === m.userId ? { ...p, role: m.role } : p));
      if (m.type === "mute")  setTiles(prev => prev.map(p => p.userId === m.userId ? { ...p, [m.kind === "audio" ? "mutedA" : "mutedV"]: m.value } : p));
      if (m.type === "join")  setTiles(prev => prev.some(p => p.userId === m.userId) ? prev : [...prev, { ...m, role: "queue" }]);
    });
    setTimeout(() => conn.send({ type: "join", ...me }), 100);
    return () => conn.close();
  }, [roomId, me.userId]);

  return (
    <div style={{ display: "grid", gridTemplateRows: "auto 1fr", height: "100vh", background: "#0b0c10", color: "#e7ebf0" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderBottom: "1px solid #23262e" }}>
        <b>Mutiny Communicator</b>
        <div style={{ marginLeft: "auto", opacity: .7, fontSize: 12 }}>Room: {roomId}</div>
      </header>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px" }}>
        <main style={{ padding: 12, overflow: "auto" }}>
          <Stage tiles={tiles} />
          {/* Add Chat + Scheduler panels here */}
        </main>
        <PeoplePanel apiBase={API} roomId={roomId} me={me} isHost={isHost} />
      </div>
    </div>
  );
}
