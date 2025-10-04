import React from "react";
import {
  getFriends,
  getServers,
  getServerChannels,
  openDMWithUser,
  RevoltUser,
  RevoltServer,
  RevoltChannel,
} from "@/api";

type Props = {
  activeChannelId?: string;
  onOpenChannel: (channelId: string) => void;
};

export default function FriendsServers({ activeChannelId, onOpenChannel }: Props) {
  const [friends, setFriends] = React.useState<RevoltUser[]>([]);
  const [servers, setServers] = React.useState<RevoltServer[]>([]);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [serverChans, setServerChans] = React.useState<Record<string, RevoltChannel[]>>({});
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [f, s] = await Promise.all([getFriends(), getServers()]);
        setFriends(f.friends || []);
        setServers(s.servers || []);
      } catch (e: any) {
        setErr(e.message || "Failed to load relationships");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function toggleServer(serverId: string) {
    setExpanded((p) => ({ ...p, [serverId]: !p[serverId] }));
    if (!serverChans[serverId]) {
      try {
        const data = await getServerChannels(serverId);
        setServerChans((p) => ({ ...p, [serverId]: data.channels || [] }));
      } catch (e: any) {
        setErr(e.message || "Failed to load channels");
      }
    }
  }

  async function openDM(userId: string) {
    try {
      const { channel } = await openDMWithUser(userId);
      onOpenChannel(channel._id);
    } catch (e: any) {
      setErr(e.message || "Failed to open DM");
    }
  }

  const box = { border: "1px solid #23262e", borderRadius: 12, padding: 10, marginBottom: 12 };
  const itemBtn: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "100%",
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid #23262e",
    background: "#0b0c10",
    color: "#e7ebf0",
    cursor: "pointer",
    textAlign: "left",
  };

  return (
    <div style={{ width: 300, borderRight: "1px solid #23262e", padding: 12, overflowY: "auto" }}>
      <div style={{ fontWeight: 800, marginBottom: 10 }}>Mutiny</div>

      {err && (
        <div style={{ color: "#f66", fontSize: 12, marginBottom: 8 }}>
          {err}
        </div>
      )}

      <div style={box}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Friends</div>
        {loading && !friends.length ? <div style={{ opacity: 0.7 }}>Loading…</div> : null}
        {!friends.length && !loading ? <div style={{ opacity: 0.6 }}>No friends yet.</div> : null}
        <div style={{ display: "grid", gap: 6 }}>
          {friends.map((u) => (
            <button key={u._id} style={itemBtn} onClick={() => openDM(u._id)} title="Open DM">
              <div
                style={{
                  width: 24, height: 24, borderRadius: 6,
                  background: "#1f2937", display: "grid", placeItems: "center",
                  fontSize: 12, opacity: 0.9,
                }}
              >
                {(u.display_name || u.username || "?").slice(0, 1).toUpperCase()}
              </div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontWeight: 600, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                  {u.display_name || u.username || u._id}
                </div>
                <div style={{ fontSize: 11, opacity: 0.6 }}>{u._id}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={box}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Servers</div>
        {loading && !servers.length ? <div style={{ opacity: 0.7 }}>Loading…</div> : null}
        {!servers.length && !loading ? <div style={{ opacity: 0.6 }}>No servers yet.</div> : null}
        <div style={{ display: "grid", gap: 8 }}>
          {servers.map((s) => {
            const isOpen = !!expanded[s._id];
            const chans = serverChans[s._id] || [];
            return (
              <div key={s._id} style={{ border: "1px solid #23262e", borderRadius: 10 }}>
                <button
                  style={{ ...itemBtn, border: "none", borderBottom: isOpen ? "1px solid #23262e" : "none", borderRadius: "10px 10px 0 0" }}
                  onClick={() => toggleServer(s._id)}
                  title="Toggle channels"
                >
                  <div
                    style={{
                      width: 24, height: 24, borderRadius: 6,
                      background: "#1f2937", display: "grid", placeItems: "center",
                      fontSize: 12, opacity: 0.9,
                    }}
                  >
                    {(s.name || "?").slice(0, 1).toUpperCase()}
                  </div>
                  <div style={{ fontWeight: 600 }}>{s.name || s._id}</div>
                  <div style={{ marginLeft: "auto", opacity: 0.7 }}>{isOpen ? "▾" : "▸"}</div>
                </button>

                {isOpen && (
                  <div style={{ padding: 8 }}>
                    {!chans.length ? (
                      <div style={{ opacity: 0.6, fontSize: 12 }}>No channels (or loading…)</div>
                    ) : (
                      <div style={{ display: "grid", gap: 6 }}>
                        {chans.map((c) => (
                          <button
                            key={c._id}
                            style={{
                              ...itemBtn,
                              background: c._id === activeChannelId ? "#111827" : "#0b0c10",
                              border: c._id === activeChannelId ? "1px solid #334155" : "1px solid #23262e",
                            }}
                            onClick={() => onOpenChannel(c._id)}
                          >
                            <span style={{ opacity: 0.7, marginRight: 6 }}>
                              {c.channel_type === "VoiceChannel" ? "🔊" : "#"}
                            </span>
                            <span>{c.name || c._id}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
