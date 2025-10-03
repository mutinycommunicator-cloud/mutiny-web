import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import CreateGroup from "./CreateGroup";
import JoinInvite from "./JoinInvite";
import Chat from "./Chat"; // your existing chat view; assumes prop channelId

export default function App() {
  const [channelId, setChannelId] = useState<string>("");
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#0b0c10", color: "#e7ebf0" }}>
      <Header
        onOpenStore={() => location.hash = "#plugins"}
        onOpenCreateGroup={() => setShowCreate(true)}
        onOpenJoinInvite={() => setShowJoin(true)}
      />
      <div style={{ flex: 1, display: "flex" }}>
        <Sidebar
          onOpenChannel={setChannelId}
          onAskCreateGroup={() => setShowCreate(true)}
          onAskJoinInvite={() => setShowJoin(true)}
        />
        <main style={{ flex: 1, padding: 16 }}>
          {channelId ? <Chat channelId={channelId}/> : <div style={{ opacity: .7 }}>Pick a DM or join/create a group.</div>}
        </main>
      </div>

      {(showCreate || showJoin) && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)" }}
             onClick={() => { setShowCreate(false); setShowJoin(false); }}>
          <div onClick={e => e.stopPropagation()} style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)" }}>
            {showCreate && <CreateGroup onDone={() => setShowCreate(false)}/>}
            {showJoin && <JoinInvite onDone={() => setShowJoin(false)}/>}
          </div>
        </div>
      )}
    </div>
  );
}
