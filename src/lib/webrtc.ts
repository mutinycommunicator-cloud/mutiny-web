import { useEffect, useRef, useState } from "react";

export function useLocalMedia() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<any>(null);
  const constraintsRef = useRef<MediaStreamConstraints | null>(null);

  async function start(constraints: MediaStreamConstraints = { audio: true, video: true }) {
    try {
      constraintsRef.current = constraints;
      const s = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(s);
      setError(null);
    } catch (e) {
      setError(e);
      setStream(null);
    }
  }

  function stop() {
    if (stream) {
      for (const t of stream.getTracks()) t.stop();
    }
    setStream(null);
  }

  // Clean up on unmount
  useEffect(() => stop, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { stream, start, stop, error };
}
