// src/ui/App.tsx
import React from "react";
import { Header } from "./Header";
import { Sidebar, ViewKey } from "./Sidebar";
import { Home } from "./Home";
import { PluginStore } from "./PluginStore";
import { ChatView } from "./Chat";
import { Studio } from "./Studio";
import { revolt } from "../api";

export default function App() {
  const [view,setView] = React.useState<ViewKey>("home");
  const [user,setUser] = React.useState<{name:string}|undefined>(undefined);
  const [showPlugins,setShowPlugins] = React.useState(false);

  return (
    <div style={{background:"#0d0f14", color:"#e7ebf0"}}>
      <Header onOpenPlugins={()=>{setShowPlugins(true); setView("plugins");}}
              onLogout={async()=>{ await revolt.logout(); location.reload(); }}
              user={user}/>
      <div style={{display:"grid", gridTemplateColumns:"230px 1fr", minHeight:"calc(100vh - 56px)"}}>
        <Sidebar current={view} onChange={setView}/>
        <main>
          {view==="home"     && <Home/>}
          {view==="dms"      && <ChatView mode="dms"/>}
          {view==="groups"   && <ChatView mode="groups"/>}
          {view==="studio"   && <Studio/>}
          {view==="schedule" && <ScheduleBlurb/>}
          {view==="plugins"  && <PluginStore/>}
        </main>
      </div>
    </div>
  );
}

function ScheduleBlurb() {
  return (
    <div style={{padding:16}}>
      <h2 style={{marginTop:0}}>Scheduler</h2>
      <div style={{opacity:.75, marginBottom:12}}>
        Weekly planner (grid) like your examples; auto-plays media via Worker’s
        plugin registry. Open OBS overlay at <code>/overlay-now.html</code>.
      </div>
      <div style={{border:"1px dashed #2b3240", borderRadius:16, padding:16, color:"#9fb1ff"}}>
        Coming in: drag blocks, assign guests, hotkeys.
      </div>
    </div>
  );
}
