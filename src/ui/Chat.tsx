import React from "react";

const API =
  (import.meta as any).env?.VITE_API_BASE ||
  "https://mutiny-api.mutinycomm.workers.dev";

// the token we stored on login (no cookies)
const TOKEN_KEY = "mutiny_revolt_token";
function authHeaders() {
  const t =
    localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || "";
  const h = new Headers();
  if (t) h.set("Authorization", "Bearer " + t); // Worker maps → X-Session-Token
  h.set("Content-Type", "application/json");
  return h;
}

async function loadMessages(channelId: string, limit = 50) {
  const r = await fetch(
    `${API}/revolt/channels/${encodeURIComponent(
      channelId
    )}/messages?limit=${limit}`,
    { headers: authHeaders() }
  );
  if (!r.ok) throw new Error(`Load failed: ${r.status}`);
  return r.json();
}

async function postMessage(channelId: string, content: string) {
  const r = await fetch(
    `${API}/revolt/channels/${encodeURIComponent(channelId)}/messages`,
    { method: "POST", headers: authHeaders(), body: JSON.stringify({ content }) }
  );
  if (!r.ok) throw new Error(`Send failed: ${r.status}`);
  return r.json();
}

export default function Chat({ channelId }: { channelId?: string }) {
  const [channel, setChannel] = React.useState(channelId || "");
  const [msgs, setMsgs] = React.useState<any[]>([]);
  const [text, setText] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState("");

  // keep internal channel in sync with prop
  React.useEffect(() => {
    if (channelId && channelId !== channel) setChannel(channelId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId]);

  async function reload() {
    if (!channel) return;
    setLoading(true);
    setErr("");
    try {
      const data = await loadMessages(channel, 50);
      setMsgs(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setErr(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function send() {
    if (!channel || !text.trim()) return;
    try {
      await postMessage(channel, text.trim());
      setText("");
      reload();
    } catch (e: any) {
      setErr(e?.message || "Failed to send");
    }
  }

  React.useEffect(() => {
    if (!channel) return;
    reload();
    const t = setInterval(reload, 3000); // simple poll
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel]);

  return (
    <section
      style={{
        border: "1px solid #23262e",
        borderRadius: 16,
        overflow: "hidden",
        background: "#0b0c10",
        color: "#e7ebf0",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: 12,
          borderBottom: "1px solid #23262e",
        }}
      >
        {!channelId && (
          <input
            placeholder="Revolt Channel ID (DM / Group / Server channel)"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            style={inp}
          />
        )}
        <button onClick={reload} style={btn}>
          {loading ? "Loading…" : "Load"}
        </button>
      </div>

      {!!err && (
        <div style={{ color: "#f66", fontSize: 12, padding: "6px 12px" }}>
          {err}
        </div>
      )}

      <div style={{ height: 260, overflowY: "auto", padding: 12 }}>
        {msgs.map((m: any) => (
          <div key={m._id} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>{m.author}</div>
            <div>{m.content}</div>
          </div>
        ))}
        {!msgs.length && <div style={{ opacity: 0.6 }}>No messages yet.</div>}
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          padding: 12,
          borderTop: "1px solid #23262e",
        }}
      >
        <input
          placeholder="Message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          style={inp}
        />
        <button onClick={send} style={sendBtn}>
          Send
        </button>
      </div>
    </section>
  );
}

const inp: React.CSSProperties = {
  flex: 1,
  padding: 10,
  borderRadius: 10,
  background: "#0b0c10",
  border: "1px solid #23262e",
  color: "#e7ebf0",
};
const btn: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: 10,
  background: "#0b0c10",
  border: "1px solid #23262e",
  color: "#e7ebf0",
};
const sendBtn: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 10,
  background: "#5b6eff",
  border: "1px solid #7785ff",
  color: "#fff",
};
