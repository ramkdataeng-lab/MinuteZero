"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  ControlBar,
  useLocalParticipant,
  TrackReference,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import "@livekit/components-styles";
import { Mic, Video, PhoneOff, Activity, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [roomName, setRoomName] = useState("emergency-room-1");

  const startSession = async () => {
    const identity = `user-${Math.floor(Math.random() * 10000)}`;
    try {
      const resp = await fetch(`/api/token?room=${roomName}&identity=${identity}`);
      const data = await resp.json();
      setToken(data.token);
      setIsConnected(true);
    } catch (e) {
      console.error("Failed to generate token", e);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-12 bg-black overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#ff3b301a] blur-[120px] rounded-full pointer-events-none opacity-50" />

      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-4">
          <Image
            src="/FInal_logo/Log_2.png"
            alt="MinuteZero Logo"
            width={40}
            height={40}
            className="rounded-lg shadow-[0_0_15px_rgba(255,59,48,0.4)]"
          />
          <span className="text-xl font-bold tracking-tight text-white hidden sm:block">MinuteZero</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Gemini Live Agent</span>
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
        </div>
      </nav>

      <div className="relative w-full max-w-6xl z-10 flex flex-col items-center mt-12">
        {!isConnected ? (
          <div className="flex flex-col items-center space-y-8">
            {/* Hero Logo centerpiece */}
            <div className="relative group cursor-pointer" onClick={startSession}>
              <div className="absolute -inset-1 bg-gradient-to-r from-[#ff3b30] to-yellow-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02]">
                <Image
                  src="/FInal_logo/Log_2.png"
                  alt="MinuteZero The Golden Minute"
                  width={500}
                  height={500}
                  priority
                  className="w-full max-w-[400px] md:max-w-[500px]"
                />
              </div>

              {/* Pulse Indicator */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#ff3b30] text-white px-6 py-2 rounded-full font-black uppercase tracking-[0.2em] text-[10px] pulse-red animate-bounce">
                Initialize Protocol
              </div>
            </div>

            <div className="text-center space-y-4 pt-8">
              <p className="text-zinc-400 text-lg md:text-xl max-w-xl mx-auto font-medium">
                Closing the panic gap with real-time AI First Response.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-12">
              <FeatureCard icon={<Activity className="w-5 h-5" />} title="Vital Vision" desc="AI scans environment for hazards." />
              <FeatureCard icon={<ShieldCheck className="w-5 h-5" />} title="AHA Protocol" desc="Certified life-saving guidance." />
              <FeatureCard icon={<Zap className="w-5 h-5" />} title="Zero Latency" desc="Instant multimodal responses." />
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-4xl h-[600px] glass overflow-hidden relative">
              <LiveKitRoom
                video={true}
                audio={true}
                token={token!}
                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
                onDisconnected={() => setIsConnected(false)}
                className="h-full w-full"
              >
                <div className="absolute inset-0 flex flex-col">
                  {/* Active Session UI */}
                  <div className="flex-1 relative bg-zinc-950">
                    <ActiveSessionContent />
                  </div>

                  {/* Controls */}
                  <div className="h-24 bg-black/80 backdrop-blur-xl border-t border-white/5 p-6 flex items-center justify-center gap-8">
                    <button onClick={() => setIsConnected(false)} className="px-10 py-3 bg-[#ff3b30] text-white font-black rounded-full hover:bg-red-600 transition-colors uppercase tracking-[0.2em] text-[10px] flex items-center gap-3">
                      <PhoneOff className="w-4 h-4" /> End Emergency Call
                    </button>
                  </div>
                </div>
                <RoomAudioRenderer />
              </LiveKitRoom>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-8 flex justify-between items-center z-50 text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-medium bg-gradient-to-t from-black to-transparent pointer-events-none">
        <div className="pointer-events-auto">© 2026 MinuteZero Systems</div>
        <div className="flex gap-4 pointer-events-auto">
          <span>Encrypted Line</span>
          <span className="text-[#ff3b30] animate-pulse">Waiting for Signal</span>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="glass p-6 space-y-3 hover:bg-white/5 transition-colors group">
      <div className="text-[#ff3b30] group-hover:scale-110 transition-transform">{icon}</div>
      <h4 className="text-white font-bold text-lg uppercase tracking-tight">{title}</h4>
      <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function ActiveSessionContent() {
  const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone]);

  return (
    <div className="h-full w-full flex items-center justify-center overflow-hidden">
      {/* Logo Watermark in Background */}
      <div className="absolute inset-0 opacity-10 flex items-center justify-center grayscale pointer-events-none">
        <Image src="/FInal_logo/Log_2.png" alt="Watermark" width={600} height={600} />
      </div>

      {/* Agent Visualizer */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 rounded-full border border-[#ff3b30]/20 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border border-[#ff3b30]/40 flex items-center justify-center animate-pulse">
            <div className="w-32 h-32 rounded-full border-2 border-[#ff3b30] flex items-center justify-center">
              <div className="w-4 h-4 bg-[#ff3b30] rounded-full shadow-[0_0_20px_#ff3b30]" />
            </div>
          </div>
        </div>
      </div>

      {/* UI Overlay */}
      <div className="absolute top-8 left-8 space-y-2">
        <div className="px-3 py-1 bg-red-600/20 border border-red-500/50 text-red-500 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          Live Multimodal Feed
        </div>
        <div className="text-zinc-500 font-mono text-[10px] uppercase tracking-tighter">
          Receiving sensor data...
        </div>
      </div>

      <div className="absolute top-8 right-8 text-right">
        <div className="text-white font-black text-2xl tracking-tighter italic">MZ AGENT 01</div>
        <div className="text-[#ff3b30] font-bold text-xs uppercase tracking-widest uppercase italic">Connected</div>
      </div>
    </div>
  );
}
