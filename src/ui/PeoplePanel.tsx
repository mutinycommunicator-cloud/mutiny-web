import React, { useEffect, useMemo, useRef, useState } from "react";
import { bindHotkeys, connectSignaling, Role, RtcMsg } from "@/lib/rtc";

type Person = { userId: string; name: string; role: Role; mutedA?: boolean; mutedV?: boolean };

export function PeoplePanel({
  apiBase, roomId, me, isHost,
}: {
  apiBase: string;
  roomId: string;
  me: { userId: string; name: string };
  isHost: boolean;
}) {
  const [people, setPeople] = useState<Person[]>([]);
  const [selected, setSelected] = useState<string|null>(null);
  const connRef = useRef<ReturnType<typeof connectSignaling>|null>(null);

  useEffect(() => {
    const conn = connectSignaling(apiBase, roomId, (m: RtcMsg) => {
      if (m.type === "state") {
        setPeople(prev => m.users.map(u => {
          const p = prev.find(x => x.userId === u.userId);
          return { ...u, mutedA: p?.mutedA, mutedV: p?.mutedV };
        }));
      } else if (m.type === "role") {
        setPeople(prev => prev.map(p => p.userId === m.userId ? { ...p, role: m.role } : p));
      } else if (m.type === "mute") {
        setPeople(prev => prev.map(p => p.userId === m.userId ? { ...p, [m.kind === "audio" ? "mutedA" : "mutedV"]: m.value } : p));
      } else if (m.type === "join") {
        setPeople(prev => prev.some(p => p.userId === m.userId) ? prev : [...prev, { ...m, role: "queue" }]);
      }
    });
    connRef.current = conn;
    setTimeout(() => conn.send({ type: "join", ...me }), 100);
    return () => conn.close();
  }, [apiBase, roomId, me.userId]);

  function changeRole(userId: string, role: Role) {
    if (!isHost) return;
    connRef.current?.send({ type: "role", userId, role });
  }
  function toggleMute(userId: string, kind: "audio"|"video") {
    if (!isHost && userId !== me.userId) return;
    const person = people.find(p => p.userId === userId);
    const val = kind === "audio" ? !person?.mutedA : !person?.mutedV;
    connRef.current?.send({ type: "mute", userId, kind, value: !!val });
  }

  useEffect(() => {
    return bindHotkeys({
      "Ctrl+1": () => selected && changeRole(selected, "backstage"),
      "Ctrl+2": () => selected && changeRole(selected, "onair"),
      "Ctrl+0": () => selected && changeRole(selected, "queue"),
      "M":      () => selected && toggleMute(selected, "audio"),
    });
  }, [selected, isHost, people]);

  function allowDrop(e: React.DragEvent) { e.preventDefault(); }
  function onDragStart(userId: string) {
    return (e: React.DragEvent) => { e.dataTransfer.setData("text/plain", userId); };
  }
  function onDrop(targetRole: Role) {
    return (e: React.DragEvent) => {
      e.preventDefault();
      const userId = e.dataTransfer.getData("text/plain");
      if (userId) changeRole(userId, targetRole);
    };
  }

  const lists = useMemo(() => ({
    queue: people.filter(p => p.role === "queue"),
    backstage: people.filter(p => p.role === "backstage"),
    onair: people.filter(p => p.role === "onair"),
  }), [people]);

  function renderList(title: string, role: Role, items: Person[]) {
    return (
      <div onDragOver={allowDrop} onDrop={onDrop(role)} style={{ border: "1px solid #23262e", borderRadius: 12, padding: 8 }}>
        <div style={{ fontSize: 12, opacity: .7, marginBottom: 6 }}>{title}</div>
        <div style={{ display: "grid", gap: 6 }}>
          {items.map(p => (
            <div
              key={p.userId}
              draggable
              onDragStart={onDragStart(p.userId)}
              onClick={() => setSelected(p.userId)}
              style={{
                padding: "8px 10px",
                borderRadius: 10,
                border: "1px solid " + (selected === p.userId ? "#7785ff" : "#23262e"),
                background: selected === p.userId ? "#151a2b" : "#0b0c10",
                display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between",
                cursor: "grab"
              }}
            >
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ width: 8, height: 8, borderRadius: 99, background: p.role === "onair" ? "#22c55e" : p.role === "backstage" ? "#eab308" : "#64748b" }} />
                <div>{p.name}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={(e) => { e.stopPropagation(); toggleMute(p.userId, "audio"); }}
                        title="Toggle mic" style={btnSm}>
                  {p.mutedA ? "🔇" : "🎙️"}
                </button>
                <button onClick={(e) => { e.stopPropagation(); toggleMute(p.userId, "video"); }}
                        title="Toggle cam" style={btnSm}>
                  {p.mutedV ? "🚫📷" : "📷"}
                </button>
              </div>
            </div>
          ))}
          {!items.length && <div style={{ opacity: .5, fontSize: 12 }}>Drop here</div>}
        </div>
      </div>
    );
  }

  return (
    <aside style={{ width: 320, borderLeft: "1px solid #23262e", padding: 12, display: "grid", gap: 10 }}>
      <div style={{ fontWeight: 700 }}>People</div>
      {renderList("Queue", "queue", lists.queue)}
      {renderList("Backstage", "backstage", lists.backstage)}
      {renderList("On-Air", "onair", lists.onair)}
      <div style={{ fontSize: 12, opacity: .7 }}>
        Tips: drag to move · Ctrl+1 → backstage · Ctrl+2 → on-air · Ctrl+0 → queue · M → mute.
      </div>
    </aside>
  );
}

const btnSm: React.CSSProperties = {
  padding: "4px 8px",
  borderRadius: 8,
  border: "1px solid #334155",
  background: "#1f2937",
  color: "#e7ebf0",
};
