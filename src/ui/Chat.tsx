// src/ui/Chat.tsx
import React from "react";
import { revolt, Msg } from "../api";

export function ChatView({mode}:{mode:"dms"|"groups"}) {
  const [channels,setChannels] = React.useState<{id:string;name:string}[]>([]);
  const [current,setCurrent] = React.useState<{id:string;name:string}|null>(null);
  const [manualId,setManualId] = React.useState("");

  React.useEffect(()=>{
    revolt.channelsMine().then(setChannels);
  },[]);

  async function addManual() {
    if (!manualId.trim()) return;
    await revolt.rememberChannel(manualId.trim(), manualId.trim());
    const list = await revolt.channelsMine();
    setChannels(list);
    setCurrent({id:manualId.trim(), name:manualId.trim()});
    setManualId("");
  }

  return (
    <div style={{display:"grid", gridTemplateColumns:"260px 1fr 320px", height:"calc(100vh - 56px)"}}>
      {/* left list */}
      <div style={{borderRight:"1px solid #23262e", padding:12}}>
        <b style={{display:"block", marginBottom:8}}>{mode==="dms"?"Direct Messages":"Groups"}</b>
        <div style={{display:"flex", gap:8, marginBottom:10}}>
          <input placeholder={mode==="dms"?"DM Channel ID":"Group Channel ID"}
            value={manualId} onChange={e=>setManualId(e.target.value)} style={inp}/>
          <button onClick={addManual} style={btn("ghost")}>Add</button>
        </div>
        <div style={{display:"grid", gap:6}}>
          {channels.map(c=>(
            <button key={c.id} onClick={()=>setCurrent(c)} style={{
              textAlign:"left", padding:"8px 10px", borderRadius:10,
              background: current?.id===c.id ? "#1f2937":"#0b0c10",
              border:"1px solid #23262e", color:"#e7ebf0"
            }}>{c.name || c.id}</button>
          ))}
          {!channels.length && <div style={{opacity:.7}}>No channels yet – add one above.</div>}
        </div>
      </div>

      {/* center room */}
      <div style={{borderRight:"1px solid #23262e"}}>
        {current ? <ChatRoom channel={current}/> : <EmptyHint/>}
      </div>

      {/* right info rail */}
      <div style={{padding:12}}>
        <b>Conversation Information</b>
        <div style={{opacity:.7, fontSize:12, marginTop:6}}>
          Participants, pinned links, attachments… (coming)
        </div>
      </div>
    </div>
  );
}

function ChatRoom({channel}:{channel:{id:string;name:string}}) {
  const [msgs,setMsgs] = React.useState<Msg[]>([]);
  const [text,setText] = React.useState("");
  const [loading,setLoading] = React.useState(false);

  async function load() {
    setLoading(true);
    try { setMsgs(await revolt.getMessages(channel.id, 50)); }
    finally { setLoading(false); }
  }
  React.useEffect(()=>{ load(); }, [channel.id]);

  async function send() {
    if (!text.trim()) return;
    await revolt.sendMessage(channel.id, text.trim());
    setText(""); load();
  }

  return (
    <div style={{display:"grid", gridTemplateRows:"auto 1fr auto", height:"100%"}}>
      <div style={{padding:"10px 12px", borderBottom:"1px solid #23262e"}}>
        <b>{channel.name}</b>
        <button onClick={load} style={{...btn("ghost"), float:"right"}}>{loading?"…":"Reload"}</button>
      </div>

      <div style={{padding:12, overflowY:"auto"}}>
        {msgs.map(m=>(
          <div key={m._id} style={{marginBottom:10}}>
            <div style={{fontSize:12, opacity:.7}}>{m.author}</div>
            <div>{m.content}</div>
          </div>
        ))}
        {!msgs.length && <div style={{opacity:.6}}>No messages yet.</div>}
      </div>

      <div style={{display:"flex", gap:8, padding:12, borderTop:"1px solid #23262e"}}>
        <input placeholder="Message…" value={text} onChange={e=>setText(e.target.value)}
          onKeyDown={e=>e.key==="Enter" && send()} style={inp}/>
        <button onClick={send} style={btn()}>Send</button>
      </div>
    </div>
  );
}

function EmptyHint() {
  return <div style={{display:"grid", placeItems:"center", height:"100%", opacity:.65}}>Pick a channel on the left.</div>;
}

const btn = (k:"primary"|"ghost"="primary") => ({
  padding:"8px 10px", borderRadius:10, cursor:"pointer",
  background: k==="primary" ? "#5b6eff" : "#0b0c10",
  border: "1px solid " + (k==="primary" ? "#7785ff" : "#23262e"),
  color:"#e7ebf0"
}) as React.CSSProperties;

const inp: React.CSSProperties = {
  flex:1, padding:"10px", borderRadius:10, background:"#0b0c10",
  border:"1px solid #23262e", color:"#e7ebf0"
};
