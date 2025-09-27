export type Role = "queue" | "backstage" | "onair";
export type RtcMsg =
  | { type: "join"; userId: string; name: string }
  | { type: "role"; userId: string; role: Role }
  | { type: "mute"; userId: string; kind: "audio" | "video"; value: boolean }
  | { type: "state"; users: Array<{ userId: string; name: string; role: Role, mutedA?: boolean, mutedV?: boolean }> }
  | { type: "signal"; to: string; sdp?: any; ice?: any };

export function connectSignaling(apiBase: string, roomId: string, onMsg: (m: RtcMsg)=>void) {
  const wsUrl = apiBase.replace(/^http/, "ws") + `/rtc/room/${encodeURIComponent(roomId)}`;
  const ws = new WebSocket(wsUrl);
  ws.onmessage = (ev) => { try { onMsg(JSON.parse(ev.data)); } catch {} };
  return {
    send: (m: RtcMsg) => ws.readyState === ws.OPEN && ws.send(JSON.stringify(m)),
    close: () => ws.close()
  };
}

export function bindHotkeys(map: Record<string, (ev: KeyboardEvent)=>void>) {
  function onKey(e: KeyboardEvent) {
    const key = [
      e.ctrlKey ? "Ctrl" : "",
      e.altKey ? "Alt" : "",
      e.shiftKey ? "Shift" : "",
      e.key.length === 1 ? e.key.toUpperCase() : e.key
    ].filter(Boolean).join("+");
    const fn = map[key];
    if (fn) { e.preventDefault(); fn(e); }
  }
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}
