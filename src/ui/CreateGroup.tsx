import React, { useState } from "react";
import { revolt } from "@/api";

export default function CreateGroup({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("My Group");
  const [members, setMembers] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function create() {
    setBusy(true); setMsg("");
    try {
      const ids = members.split(",").map(s => s.trim()).filter(Boolean);
      const ch = await revolt.createGroup(name.trim(), ids);
      setMsg("Created: " + ch?._id);
    } catch (e: any) { setMsg("Failed: " + (e.message || "")); }
    finally { setBusy(false); }
  }

  return (
    <div style={{ width: 420, background: "#111318", border: "1px solid #23262e",
      borderRadius: 16, padding: 16 }}>
      <h3 style={{ marginTop: 0 }}>Create Group</h3>
      <input value={name} onChange={e => setName(e.target.value)}
             style={{ width: "100%", padding: 10, borderRadius: 10, background: "#0b0c10",
               border: "1px solid #23262e", color: "#e7ebf0" }}/>
      <input placeholder="member user IDs, comma-separated" value={members}
             onChange={e => setMembers(e.target.value)}
             style={{ width: "100%", padding: 10, marginTop: 8, borderRadius: 10, background: "#0b0c10",
               border: "1px solid #23262e", color: "#e7ebf0" }}/>
      {msg && <div style={{ fontSize: 12, opacity: .8, marginTop: 8 }}>{msg}</div>}
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button onClick={create} disabled={busy}>{busy ? "Creating…" : "Create"}</button>
        <button onClick={onDone}>Close</button>
      </div>
    </div>
  );
}
