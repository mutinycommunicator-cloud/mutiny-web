import React, { useState } from "react";
import { revolt } from "@/api";

export default function JoinInvite({ onDone }: { onDone: () => void }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function join() {
    setBusy(true); setMsg("");
    // accept rvlt.gg/<code> or raw code
    const c = code.trim().replace(/^https?:\/\/(rvlt\.gg|revolt\.chat)\/?/i, "");
    try {
      const res = await revolt.joinInvite(c);
      setMsg("Joined.");
    } catch (e: any) { setMsg("Failed: " + (e.message || "")); }
    finally { setBusy(false); }
  }

  return (
    <div style={{ width: 420, background: "#111318", border: "1px solid #23262e",
      borderRadius: 16, padding: 16 }}>
      <h3 style={{ marginTop: 0 }}>Join via Invite</h3>
      <input placeholder="rvlt.gg/XXXX or code" value={code}
             onChange={e => setCode(e.target.value)}
             style={{ width: "100%", padding: 10, borderRadius: 10, background: "#0b0c10",
               border: "1px solid #23262e", color: "#e7ebf0" }}/>
      {msg && <div style={{ fontSize: 12, opacity: .8, marginTop: 8 }}>{msg}</div>}
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button onClick={join} disabled={busy}>{busy ? "Joining…" : "Join"}</button>
        <button onClick={onDone}>Close</button>
      </div>
    </div>
  );
}
