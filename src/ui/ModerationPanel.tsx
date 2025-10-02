import React, { useState } from "react";
import { apiBase, sid } from "../api"; // your helper that exposes API base + current SID

export default function ModerationPanel() {
  const [serverId, setServerId] = useState("");
  const [userId, setUserId]     = useState("");
  const [channelId, setChannel] = useState("");
  const [messageId, setMsg]     = useState("");
  const [reason, setReason]     = useState("");
  const [secs, setSecs]         = useState(0);
  const [timeoutISO, setTimeoutISO] = useState("");

  async function POST(path: string, body: any) {
    const r = await fetch(`${apiBase}${path}?sid=${encodeURIComponent(sid())}`, {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify(body)
    });
    const j = await r.json().catch(() => ({}));
    alert(r.ok ? "OK" : `Error ${r.status}: ${j?.error ?? ""}`);
  }

  return (
    <div style={{ padding: 12, display:"grid", gap:12 }}>
      <h3>Moderation</h3>

      <section style={{ border:"1px solid #23262e", borderRadius:12, padding:12 }}>
        <b>Delete message</b>
        <div style={{ display:"flex", gap:8, marginTop:8 }}>
          <input placeholder="Channel ID" value={channelId} onChange={e=>setChannel(e.target.value)} />
          <input placeholder="Message ID" value={messageId} onChange={e=>setMsg(e.target.value)} />
          <button onClick={()=>POST("/revolt/mod/delete-message", { channelId, messageId })}>Delete</button>
        </div>
      </section>

      <section style={{ border:"1px solid #23262e", borderRadius:12, padding:12 }}>
        <b>Purge channel</b>
        <div style={{ display:"flex", gap:8, marginTop:8 }}>
          <input placeholder="Channel ID" value={channelId} onChange={e=>setChannel(e.target.value)} />
          <input type="number" placeholder="Limit (max 200)" value={secs} onChange={e=>setSecs(parseInt(e.target.value||"0",10))}/>
          <button onClick={()=>POST("/revolt/mod/purge", { channelId, limit: secs || 50 })}>Purge</button>
        </div>
      </section>

      <section style={{ border:"1px solid #23262e", borderRadius:12, padding:12 }}>
        <b>Kick / Ban / Unban</b>
        <div style={{ display:"grid", gap:8, marginTop:8 }}>
          <div style={{ display:"flex", gap:8 }}>
            <input placeholder="Server ID" value={serverId} onChange={e=>setServerId(e.target.value)} />
            <input placeholder="User ID" value={userId} onChange={e=>setUserId(e.target.value)} />
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <input placeholder="Reason (optional)" value={reason} onChange={e=>setReason(e.target.value)} />
            <input type="number" placeholder="Delete msg seconds" value={secs} onChange={e=>setSecs(parseInt(e.target.value||"0",10))}/>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>POST("/revolt/mod/kick", { serverId, userId })}>Kick</button>
            <button onClick={()=>POST("/revolt/mod/ban", { serverId, userId, reason, deleteMessageSeconds: secs || 0 })}>Ban</button>
            <button onClick={()=>POST("/revolt/mod/unban", { serverId, userId })}>Unban</button>
          </div>
        </div>
      </section>

      <section style={{ border:"1px solid #23262e", borderRadius:12, padding:12 }}>
        <b>Timeout / Roles</b>
        <div style={{ display:"grid", gap:8, marginTop:8 }}>
          <input placeholder="Timeout until (ISO 8601)" value={timeoutISO} onChange={e=>setTimeoutISO(e.target.value)} />
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>POST("/revolt/mod/member-edit", { serverId, userId, timeoutUntil: timeoutISO || null })}>Apply timeout</button>
            <button onClick={()=>POST("/revolt/mod/member-edit", { serverId, userId, timeoutUntil: null })}>Clear timeout</button>
          </div>
        </div>
      </section>
    </div>
  );
}
