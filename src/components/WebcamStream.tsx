import { FC, useEffect, useRef, useState } from 'react';

interface Snapshot {
  emotion: string;
  redness: number;
  imageData: string;
}

interface WebcamStreamProps {
  onSnapshot: (snapshot: Snapshot) => void;
  width?: number;
  height?: number;
}

const WebcamStream: FC<WebcamStreamProps> = ({ onSnapshot, width = 600, height = 500 }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [emotion, setEmotion] = useState('Detecting...');
  const [redness, setRedness] = useState(0);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Initialize webcam
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });

    // Connect to WS
    const socket = new WebSocket('ws://localhost:8765');
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setEmotion(data.emotion);
        setRedness(data.redness);
        // video frame already showing live in video element
      } catch (err) {
        console.error(err);
      }
    };
    setWs(socket);

    return () => {
      socket.close();
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach(track => track.stop());
      }
    };
  }, []);

  const handleSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg').split(',')[1]; // base64 only
    onSnapshot({ emotion, redness, imageData });
  };

  return (
    <div className="webcam-container" style={{ textAlign: 'center' }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        width={width}
        height={height}
        style={{ borderRadius: '8px', border: '1px solid #ccc' }}
      />
      <div className="mt-2">
        <span className="me-3">Emotion: {emotion}</span>
        <span>Redness: {redness.toFixed(1)}</span>
      </div>
      <button
        type="button"
        className="btn btn-sm btn-gradient mt-2"
        onClick={handleSnapshot}
      >
        Save Snapshot
      </button>
    </div>
  );
};

export default WebcamStream;
