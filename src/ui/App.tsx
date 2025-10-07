// src/ui/App.tsx
import React from "react";
import Header from "./Header";
import FriendsServers from "./FriendsServers";
import Chat from "./Chat";
import Stage from "./Stage";
import PluginStore from "./PluginStore";

type View = "chat" | "studio" | "plugins";

export default function App() {
  const [view, setView] = React.useState<View>("chat");
  const [channelId, setChannelId] = React.useState<string | undefined>(undefined);

  return (
    <div style={{ display: "grid", gridTemplateRows: "auto 1fr", height: "100vh", background: "#0b0c10", color: "#e7ebf0" }}>
      <Header
        onSwitchView={setView}
        onOpenPlugins={() => setView("plugins")}
        onLoggedIn={() => window.location.reload()}
        onLoggedOut={() => window.location.reload()}
      />

      <div style={{ display: "flex", minHeight: 0 }}>
        <FriendsServers
          activeChannelId={channelId}
          onOpenChannel={setChannelId}
        />

        <main style={{ flex: 1, minWidth: 0, minHeight: 0 }}>
          {view === "chat" && <Chat channelId={channelId} />}
          {view === "studio" && <Stage />}
          {view === "plugins" && <PluginStore />}
        </main>
      </div>
    </div>
  );
}
