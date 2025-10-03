import React, { useEffect, useState } from "react";
import { revolt } from "@/api";

type Props = {
  onOpenChannel: (channelId: string) => void;
  onAskCreateGroup: () => void;
  onAskJoinInvite: () => void;
};

export default function Sidebar(p: Props) {
  const [me, setMe] = useState<any>(null);
  const [dms, setDMs] = useState<any[]>([]);
  const [friendName, setFriendName] = useState("");
  const [status, setStatus] = useState("");

  async function load() {
    try {
      const m = await revolt.me().catch(() => null);
      setMe(m);
      const list = await revolt.dms().catch(() => []);
      setDMs(list || []);
    } catch {}
  }
  useEffect(() => { load(); }, []);

  async function addFriend() {
    if (!friendName.trim()) return;
    setStatus("Sending…");
    try { await revolt.sendFriendRequest(friendName.trim()); setStatus("Sent"); }
    catch (e: any) { setStatus("Failed: " + (e.message || "")); }
  }

  return (
    <aside style={{ width: 280, borderRight: "1px solid #23262e", padding: 12 }}>
      <div style={{ fontWeight: 800, marginBottom: 10 }}>Mutiny</div>

      <div style={{ border: "1px solid #23262e", borderRadius: 12, padding: 10 }}>
        <b>Friends</b>
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          <input placeholder="username#0000 or name" value={friendName}
                 onChange={e => setFriendName(e.target.value)}
                 style={{ flex: 1, padding: 8, borderRadius: 8, background: "#0b0c10",
                          border: "1px solid #23262e", color: "#e7ebf0" }}/>
          <button onClick={addFriend}>Add</button>
        </div>
        <div style={{ fontSize: 12, opacity: .7, marginTop: 6 }}>{status}</div>
      </div>

      <div style={{ marginTop: 12, border: "1px solid #23262e", borderRadius: 12, padding: 10 }}>
        <b>Direct Messages</b>
        <div style={{ marginTop: 8, display: "grid", gap: 6, maxHeight: 260, overflowY: "auto" }}>
          {dms.map((ch: any) => (
            <button key={ch._id} onClick={() => p.onOpenChannel(ch._id)}
                    style={{ textAlign: "left", padding: 8, borderRadius: 8, border: "1px solid #23262e" }}>
              {ch?.recipients?.join(", ") || ch._id}
            </button>
          ))}
          {!dms.length && <div style={{ opacity: .6 }}>No DMs yet.</div>}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          <button onClick={p.onAskCreateGroup}>+ Group</button>
          <button onClick={p.onAskJoinInvite}>Join Invite</button>
        </div>
      </div>
    </aside>
  );
}
