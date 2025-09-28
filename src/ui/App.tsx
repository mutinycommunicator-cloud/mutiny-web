import React, { useEffect, useState } from "react";
import { HeaderBar } from "@/ui/Header";
import { PeoplePanel } from "@/ui/PeoplePanel";
import { Stage } from "@/ui/Stage";
import { CallMedia } from "@/ui/CallMedia";
import { AuthModal } from "@/ui/Auth";
import { PluginStore } from "@/ui/PluginStore";
import { connectSignaling } from "@/lib/rtc";
import { API, serversList, serverChannels, serverCreate, channelCreate, discoveryList, discoveryPublish } from "@/lib/api";
import "@/theme.css";

type Tile = { userId: string; name: string; role:"queue"|"backstage"|"onair"; mutedA?:boolean; mutedV?:boolean };

export default function App() {
  const [roomId, setRoomId] = useState("main");
  const [me] = useState({ userId: crypto.randomUUID(), name: "You" });
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [isHost] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showPlugins, setShowPlugins] = useState(false);
  const [layout, setLayout] = useState<"mutiny"|"revolt">(() => (localStorage.getItem("mutiny_layout") as any) || "mutiny");

  // Simple Revolt-like: servers/channels
  const [servers, setServers] = useState<any[]>([]);
  const [currentServer, setCurrentServer] = useState<string|undefined>(undefined);
  const [channels, setChannels] = useState<any[]>([]);

  async function refreshServers() {
    try {
      const s = await serversList(); setServers(s.items||[]);
      const sid = (s.items?.[0]?.id) || undefined;
      setCurrentServer(sid);
      if (sid) {
        const ch = await serverChannels(sid);
        setChannels(ch.items||[]);
        if (ch.items?.[0]) setRoomId(ch.items[0].id);
      }
    } catch {}
  }
  useEffect(()=>{ refreshServers(); document.title = "Mutiny Communicator"; }, []);

  // WS signaling to mirror People/Stage state
  useEffect(() => {
    const conn = connectSignaling(API, roomId, (m) => {
      if (m.type === "state") setTiles(m.users as any);
      if (m.type === "role")  setTiles(prev => prev.map(p => p.userId === m.userId ? { ...p, role: m.role } : p));
      if (m.type === "mute")  setTiles(prev => prev.map(p => p.userId === m.userId ? { ...p, [m.kind === "audio" ? "mutedA" : "mutedV"]: m.value } : p));
      if (m.type === "join")  setTiles(prev => prev.some(p => p.userId === m.userId) ? prev : [...prev, { ...m, role: "queue" } as any]);
    });
    setTimeout(() => conn.send({ type: "join", ...me as any }), 100);
    return () => conn.close();
  }, [roomId, me.userId]);

  function toggleLayout() {
    const next = layout === "mutiny" ? "revolt" : "mutiny";
    setLayout(next); localStorage.setItem("mutiny_layout", next);
  }

  async function createServer() {
    const name = prompt("Server name?");
    if (!name) return;
    await serverCreate(name);
    await refreshServers();
  }
  async function createChannel() {
    if (!currentServer) return;
    const name = prompt("Channel name?");
    if (!name) return;
    await channelCreate(currentServer, name);
    const ch = await serverChannels(currentServer); setChannels(ch.items||[]);
  }
  async function publishToDiscovery() {
    if (!currentServer) return;
    await discoveryPublish(currentServer);
    alert("Published to discovery.");
  }

  return (
    <div style={{ display:"grid", gridTemplateRows:"auto 1fr", height:"100vh" }}>
      <HeaderBar
        onOpenPlugins={()=>setShowPlugins(true)}
        onOpenLogin={()=>setShowLogin(true)}
        onLoggedOut={()=>{}}
        onLayoutToggle={toggleLayout}
      />
      <div style={{
        display:"grid",
        gridTemplateColumns: layout==="revolt" ? "260px 1fr 320px" : "1fr 320px",
        gap:0
      }}>
        {layout==="revolt" && (
          <aside style={{ borderRight:"1px solid var(--border)", padding:12 }}>
            <div style={{display:"flex", gap:8}}>
              <button style={btn} onClick={createServer}>+ Server</button>
              <button style={btn} onClick={publishToDiscovery}>Publish</button>
            </div>
            <div style={{marginTop:10, fontWeight:700}}>Servers</div>
            <div style={{display:"grid", gap:6, marginTop:6}}>
              {servers.map(s =>
                <div key={s.id}
                     onClick={async()=>{ setCurrentServer(s.id); const ch = await serverChannels(s.id); setChannels(ch.items||[]); ch.items?.[0] && setRoomId(ch.items[0].id); }}
                     style={{padding:"8px 10px", border:"1px solid var(--border)", borderRadius:10, cursor:"pointer", background: s.id===currentServer?"#151a2b":"var(--bg)"}}>
                  {s.name || s.id}
                </div>
              )}
            </div>
            <div style={{display:"flex", gap:8, marginTop:10}}>
              <button style={btn} onClick={createChannel}>+ Channel</button>
            </div>
            <div style={{marginTop:10, fontWeight:700}}>Channels</div>
            <div style={{display:"grid", gap:6, marginTop:6}}>
              {channels.map(c =>
                <div key={c.id}
                     onClick={()=>setRoomId(c.id)}
                     style={{padding:"8px 10px", border:"1px solid var(--border)", borderRadius:10, cursor:"pointer", background: roomId===c.id?"#151a2b":"var(--bg)"}}>
                  #{c.name || c.id}
                </div>
              )}
            </div>

            <div style={{marginTop:12, fontWeight:700}}>Discovery</div>
            <DiscoveryList />
          </aside>
        )}

        <main style={{ padding:12, overflow:"auto" }}>
          <Stage tiles={tiles} />
          <CallMedia apiBase={API} roomId={roomId} me={me} />
        </main>

        <PeoplePanel apiBase={API} roomId={roomId} me={me} isHost={isHost} />
      </div>

      {showLogin && <AuthModal onClose={()=>setShowLogin(false)} onLoggedIn={()=>{}} />}
      {showPlugins && <PluginStore onClose={()=>setShowPlugins(false)} />}
    </div>
  );
}

function DiscoveryList() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(()=>{ discoveryList().then(d=>setItems(d.items||[])).catch(()=>{}); },[]);
  return (
    <div style={{display:"grid", gap:6, marginTop:6}}>
      {items.map(x => <div key={x.id} style={{padding:"8px 10px", border:"1px solid var(--border)", borderRadius:10}}>{x.name||x.id}</div>)}
      {!items.length && <div style={{opacity:.6, fontSize:12}}>No public servers yet.</div>}
    </div>
  );
}

const btn: React.CSSProperties = { padding:"8px 10px", borderRadius:10, background:"var(--bg)", border:"1px solid var(--border)", color:"var(--text)" };
