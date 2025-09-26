import React, { useEffect, useState } from "react";
import { RVLT } from "../util/revolt";
import PluginStore from "./PluginStore";

function Login({ onOk }:{ onOk:()=>void }) {
  const [id,setId]=useState(""), [pw,setPw]=useState(""), [err,setErr]=useState<string|null>(null), [busy,setBusy]=useState(false);
  async function submit(){ try{ setBusy(true); setErr(null); await RVLT.login(id,pw); onOk(); } catch(e:any){ setErr(e.message||"Login failed"); } finally{ setBusy(false);} }
  return (<div style={{display:"grid",placeItems:"center",height:"100vh"}}>
    <div style={{width:380,background:"#111318",border:"1px solid #23262e",borderRadius:16,padding:24}}>
      <h2 style={{margin:0}}>Sign in to Mutiny</h2>
      <p style={{opacity:.7,fontSize:12}}>Uses your Revolt account (secure cookie).</p>
      <input placeholder="Email or username" value={id} onChange={e=>setId(e.target.value)}
             style={{width:"100%",padding:10,marginTop:12,borderRadius:10,background:"#0b0c10",border:"1px solid #23262e",color:"#e7ebf0"}}/>
      <input type="password" placeholder="Password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=> e.key==="Enter" && submit()}
             style={{width:"100%",padding:10,marginTop:8,borderRadius:10,background:"#0b0c10",border:"1px solid #23262e",color:"#e7ebf0"}}/>
      {err && <div style={{color:"#f66",fontSize:13,marginTop:8}}>{err}</div>}
      <button onClick={submit} disabled={busy}
              style={{marginTop:12,width:"100%",padding:10,borderRadius:10,background:"#5b6eff",border:"1px solid #7785ff",color:"#fff"}}>{busy?"Signing in…":"Sign in"}</button>
    </div></div>);
}

function Chat({ channel, onChannelChange }:{ channel:string; onChannelChange:(v:string)=>void }) {
  const [msgs,setMsgs]=useState<any[]>([]), [text,setText]=useState(""), [loading,setLoading]=useState(false);
  async function load(){ if(!channel) return; setLoading(true); try{ setMsgs(await RVLT.getMessages(channel,50)); } finally{ setLoading(false);} }
  async function send(){ if(!text.trim()||!channel) return; await RVLT.sendMessage(channel,text); setText(""); load(); }
  async function react(mid:string){ await RVLT.react(channel,mid,"👍",true); load(); }
  async function pick(e:React.ChangeEvent<HTMLInputElement>){ const f=e.target.files?.[0]; if(!f) return; const {id}=await RVLT.uploadAttachment(f); await RVLT.sendMessage(channel,`Attachment: ${id}`); load(); }
  useEffect(()=>{ if(channel) load(); },[channel]);
  return (
    <div style={{border:"1px solid #23262e",borderRadius:16,overflow:"hidden"}}>
      <div style={{display:"flex",gap:8,padding:"8px 12px",borderBottom:"1px solid #23262e"}}>
        <input placeholder="Revolt Channel ID" value={channel} onChange={e=>onChannelChange(e.target.value)}
               style={{flex:1,padding:8,borderRadius:10,background:"#0b0c10",border:"1px solid #23262e",color:"#e7ebf0"}}/>
        <button onClick={load} style={{padding:"8px 10px",borderRadius:10,background:"#0b0c10",border:"1px solid #23262e",color:"#e7ebf0"}}>{loading?"Loading…":"Load"}</button>
      </div>
      <div style={{height:280,overflowY:"auto",padding:12}}>
        {msgs.map((m:any)=> <div key={m._id} style={{marginBottom:10}}>
          <div style={{fontSize:12,opacity:.7}}>{m.author}</div><div>{m.content}</div>
          <button onClick={()=>react(m._id)} style={{marginTop:4,padding:"4px 6px",borderRadius:8,background:"#0b0c10",border:"1px solid #23262e",color:"#e7ebf0"}}>👍 React</button>
        </div>)}
        {!msgs.length && <div style={{opacity:.6}}>No messages yet.</div>}
      </div>
      <div style={{display:"flex",gap:8,padding:12,borderTop:"1px solid #23262e"}}>
        <input placeholder="Message…" value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=> e.key==="Enter" && send()}
               style={{flex:1,padding:10,borderRadius:10,background:"#0b0c10",border:"1px solid #23262e",color:"#e7ebf0"}}/>
        <input type="file" id="up" style={{display:"none"}} onChange={pick}/>
        <label htmlFor="up" style={{padding:"10px 12px",borderRadius:10,border:"1px solid #23262e",cursor:"pointer"}}>Attach</label>
        <button onClick={send} style={{padding:"10px 12px",borderRadius:10,background:"#5b6eff",border:"1px solid #7785ff",color:"#fff"}}>Send</button>
      </div>
    </div>
  );
}

function LeftRail({ onOpenStore }:{ onOpenStore:()=>void }) {
  return (
    <aside style={{width:260,borderRight:"1px solid #23262e",padding:12}}>
      <div style={{fontWeight:800,marginBottom:10}}>Mutiny</div>
      <button onClick={onOpenStore} style={{width:"100%",padding:"8px 10px",borderRadius:10,background:"#0b0c10",border:"1px solid #23262e",color:"#e7ebf0"}}>Plugin Store</button>
      <div style={{opacity:.7,fontSize:12,marginTop:8}}>Overlays for OBS:<br/><code>/overlay-now.html?channel=&lt;id&gt;</code></div>
    </aside>
  );
}

export default function App(){
  const [authed,setAuthed]=useState(false);
  const [channel,setChannel]=useState(""); const [showStore,setShowStore]=useState(false);

  return !authed ? <Login onOk={()=>setAuthed(true)} /> : (
    <div style={{display:"flex",height:"100vh",background:"#0b0c10",color:"#e7ebf0"}}>
      <LeftRail onOpenStore={()=>setShowStore(true)}/>
      <main style={{flex:1,display:"flex",flexDirection:"column"}}>
        <header style={{display:"flex",alignItems:"center",gap:12,padding:"10px 16px",borderBottom:"1px solid #23262e"}}>
          <b>Mutiny — Channel-Weaver</b>
          <div style={{marginLeft:"auto",display:"flex",gap:8}}>
            <button onClick={()=>setShowStore(true)} style={{padding:"8px 10px",borderRadius:10,background:"#0b0c10",border:"1px solid #23262e",color:"#e7ebf0"}}>Plugins</button>
            <button onClick={()=>{ RVLT.logout().then(()=>location.reload()); }} style={{padding:"8px 10px",borderRadius:10,background:"#0b0c10",border:"1px solid #23262e",color:"#e7ebf0"}}>Logout</button>
          </div>
        </header>
        <div style={{flex:1,overflowY:"auto"}}>
          <div style={{maxWidth:1140,margin:"0 auto",padding:16}}>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16}}>
              <div style={{border:"1px solid #23262e",borderRadius:16,padding:16}}>
                <b>Stage (Queue → Backstage → On-Air)</b>
                <div style={{opacity:.7,fontSize:12}}>Drag/drop & hotkeys coming.</div>
              </div>
              <div style={{border:"1px solid #23262e",borderRadius:16,padding:16}}>
                <b>Scheduler</b>
                <div style={{opacity:.7,fontSize:12}}>Overlay reads the current block from backend.</div>
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16,marginTop:16}}>
              <Chat channel={channel} onChannelChange={setChannel}/>
              <div style={{border:"1px solid #23262e",borderRadius:16,padding:16}}>
                <b>Live Tips</b>
                <div style={{opacity:.7,fontSize:12,marginTop:6}}>In OBS add a Browser Source pointing to:<br/>
                  <code>/overlay-now.html?channel=&lt;your-id&gt;</code></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showStore && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)"}} onClick={()=>setShowStore(false)}>
          <div onClick={e=>e.stopPropagation()} style={{position:"absolute",top:"8%",left:"50%",transform:"translateX(-50%)",width:900,maxWidth:"92%",background:"#111318",border:"1px solid #23262e",borderRadius:16}}>
            <PluginStore/>
          </div>
        </div>
      )}
    </div>
  );
}
