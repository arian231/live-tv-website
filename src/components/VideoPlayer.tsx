import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Maximize, AlertCircle } from 'lucide-react';

export default function VideoPlayer({ url, poster }: { url?: string; poster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !url) return;

    setError(null);

    const initPlayer = () => {
      if (Hls.isSupported()) {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch((e) => console.log('Autoplay prevented', e));
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            console.error('HLS Error:', data);
            setError('Stream unavailable or CORS error.');
          }
        });
        hlsRef.current = hls;
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // For Safari
        video.src = url;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch((e) => console.log('Autoplay prevented', e));
        });
      } else {
        setError('HLS is not supported in this browser.');
      }
    };

    initPlayer();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [url]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  if (!url) {
    return (
      <div className="w-full aspect-video bg-[#0a0f1c] rounded-xl overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.1)] border border-cyan-900/30 flex flex-col items-center justify-center p-8 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          <Play className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-slate-200 font-semibold mb-1">Select a Channel</h3>
          <p className="text-slate-500 text-sm max-w-sm">Please choose a channel from the sidebar to start watching live TV.</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group shadow-[0_0_40px_rgba(6,182,212,0.15)] border border-cyan-500/30 transition-all duration-500 hover:shadow-[0_0_50px_rgba(6,182,212,0.3)]">
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-rose-400 gap-3">
          <AlertCircle className="w-10 h-10 animate-pulse" />
          <p className="text-sm font-medium tracking-wide">{error}</p>
        </div>
      ) : (
        <video 
          ref={videoRef} 
          className="w-full h-full object-contain bg-black" 
          poster={poster}
          playsInline 
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={togglePlay}
        />
      )}

      {/* Custom Controls */}
      <div className="absolute inset-x-0 bottom-0 p-4 pt-12 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between z-10">
        <button onClick={togglePlay} className="h-10 w-10 flex items-center justify-center bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-full transition-transform hover:scale-105 shadow-[0_0_20px_rgba(34,211,238,0.6)]">
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
        <button onClick={toggleFullscreen} className="p-2 bg-slate-900/60 hover:bg-slate-800 text-slate-200 rounded-lg backdrop-blur-md border border-white/10 transition-colors shadow-lg">
          <Maximize className="w-5 h-5" />
        </button>
      </div>

      {/* Live Badge */}
      {!error && (
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-rose-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded tracking-wider shadow-[0_0_15px_rgba(244,63,94,0.6)] uppercase">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
          LIVE
        </div>
      )}
      
      {/* Watermark */}
      <div className="absolute top-4 right-4 pointer-events-none opacity-40 font-bold text-white text-xs drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-widest font-mono">
        CODECLOUD<span className="text-cyan-400">STREAM</span>
      </div>
    </div>
  );
}
