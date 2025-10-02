import React, { useEffect, useRef, useState } from "react";
import { useLocalMedia } from "@/lib/webrtc";

export default function CallMedia() {
  const { stream, start, stop, error } = useLocalMedia();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream ?? null;
    }
  }, [stream]);

  async function startPreview() {
    await start({ audio: true, video: true });
    setMicOn(true);
    setCamOn(true);
  }

  function toggleMic() {
    const tracks = stream?.getAudioTracks() || [];
    tracks.forEach(t => (t.enabled = !t.enabled));
    setMicOn(tracks[0]?.enabled ?? false);
  }

  function toggleCam() {
    const tracks = stream?.getVideoTracks() || [];
    tracks.forEach(t => (t.enabled = !t.enabled));
    setCamOn(tracks[0]?.enabled ?? false);
  }

  function endPreview() {
    stop();
    setMicOn(false);
    setCamOn(false);
  }

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ padding: 10, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
        <b>Media</b>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {!stream
            ? <button onClick={startPreview} style={btn}>Start preview</button>
            : <>
                <button onClick={toggleMic} style={btn}>{micOn ? "Mute" : "Unmute"}</button>
                <button onClick={toggleCam} style={btn}>{camOn ? "Camera off" : "Camera on"}</button>
                <button onClick={endPreview} style={btnDanger}>Stop</button>
              </>
          }
        </div>
      </div>
      <div style={{ background: "#000", height: 260, display: "grid", placeItems: "center" }}>
        {stream
          ? <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ opacity: .7 }}>No media yet. Click <i>Start preview</i>.</div>}
      </div>
      {error && <div style={{ color: "#f88", fontSize: 12, padding: 10, borderTop: "1px solid var(--border)" }}>{String(error)}</div>}
    </div>
  );
}

const btn: React.CSSProperties = { padding: "8px 10px", borderRadius: 10, background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" };
const btnDanger: React.CSSProperties = { ...btn, background: "#251b1b", borderColor: "#442", color: "#f88" };
