"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  LiveKitRoom,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import {
  PhoneOff, Activity, ShieldCheck, Zap,
  Droplet, HeartPulse, Wind, Flame, Info, Lock, Loader2,
  Bookmark, LogIn, Mail, Github, BookmarkPlus, Search
} from "lucide-react";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [roomName] = useState("emergency-room-1");
  const [initialEmergency, setInitialEmergency] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(true); // Default true for demo
  const [showLogin, setShowLogin] = React.useState(false);
  const [bookmarks, setBookmarks] = React.useState<string[]>([]);
  const [activeTab, setActiveTab] = React.useState('rescue');
  const [showBriefing, setShowBriefing] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);

  const startSession = async (emergency: string | null = null) => {
    const identity = `user-${Math.floor(Math.random() * 10000)}`;
    setInitialEmergency(emergency);
    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching token for room:", roomName);
      const resp = await fetch(`/api/token?room=${roomName}&identity=${identity}&emergency=${emergency || ""}`);

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${resp.status}`);
      }

      const data = await resp.json();
      console.log("Token received, server URL:", data.serverUrl);

      if (!data.token || !data.serverUrl) {
        throw new Error("Invalid response from token server. Check environment variables.");
      }

      setToken(data.token);
      setServerUrl(data.serverUrl);
      setIsConnected(true);
    } catch (e: any) {
      console.error("Failed to generate token:", e);
      setError(e.message || "Failed to initialize secure line.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-background text-foreground overflow-x-hidden selection:bg-accent/30">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Modern Header */}
      <header className="w-full max-w-7xl px-6 py-8 flex justify-between items-center z-50">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 blur-lg rounded-full animate-pulse" />
            <Image
              src="/FInal_logo/Log_2.png"
              alt="MinuteZero Logo"
              width={44}
              height={44}
              className="relative rounded-xl border border-white/10 shadow-xl"
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl font-black tracking-tight leading-none text-white">MINUTE<span className="text-accent">ZERO</span></span>
            <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-bold">Protocol v1.4</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <button
              onClick={() => setShowLogin(true)}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 transition-all active:scale-95"
            >
              <LogIn className="w-4 h-4 text-accent" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Sign In</span>
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <div className="w-6 h-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
                <span className="text-[8px] font-black text-accent">MZ</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Authorized</span>
            </div>
          )}

          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <div className="flex flex-col items-end mr-2">
              <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">System Status</span>
              <span className="text-[10px] text-green-400 font-black">OPERATIONAL</span>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_12px_#22c55e]" />
          </div>
        </div>
      </header>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-md glass p-8 md:p-12 relative border-white/10 shadow-[0_0_100px_rgba(255,59,48,0.15)]">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
            >
              <Info className="w-6 h-6 rotate-45" />
            </button>

            <div className="flex flex-col items-center text-center space-y-8">
              <div className="relative">
                <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full" />
                <Image
                  src="/FInal_logo/Log_2.png"
                  alt="MinuteZero"
                  width={80}
                  height={80}
                  className="relative rounded-2xl border border-white/10 shadow-2xl"
                />
              </div>

              <div className="space-y-1">
                <h2 className="text-3xl font-black tracking-tighter text-white">Sign In</h2>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em]">Welcome back!</p>
              </div>

              <div className="w-full space-y-5">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">University Email</label>
                  <input
                    type="email"
                    placeholder="student@university.edu"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-accent/50 transition-colors"
                  />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-accent/50 transition-colors"
                  />
                </div>

                <button
                  onClick={() => { setIsLoggedIn(true); setShowLogin(false); }}
                  className="w-full bg-white text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all active:scale-95 shadow-lg shadow-white/5"
                >
                  Sign In
                </button>

                <div className="flex items-center gap-4 py-2">
                  <div className="h-[1px] flex-1 bg-white/5" />
                  <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">OR</span>
                  <div className="h-[1px] flex-1 bg-white/5" />
                </div>

                <button
                  onClick={() => { setIsLoggedIn(true); setShowLogin(false); }}
                  className="w-full flex items-center justify-center gap-3 bg-zinc-900 text-white border border-white/10 py-4 rounded-xl font-bold hover:bg-zinc-800 transition-all active:scale-95"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>
              </div>

              <p className="text-[10px] text-zinc-500 font-bold tracking-widest">
                Don't have an account? <span className="text-accent cursor-pointer hover:underline">Sign up</span>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-5xl z-10 flex flex-col items-center flex-1 justify-center px-4 pb-24 lg:pb-0">
        {!isConnected ? (
          <div className="flex flex-col items-center space-y-12 w-full animate-in fade-in zoom-in duration-700">

            {/* Action Center */}
            <div className="flex flex-col items-center gap-10 w-full text-center">
              <button
                onClick={() => startSession()}
                disabled={isLoading}
                className="group relative flex flex-col items-center gap-6 disabled:cursor-not-allowed"
              >
                <div className="relative">
                  <div className={`absolute inset-0 bg-accent/20 blur-3xl scale-150 rounded-full ${isLoading ? 'animate-ping' : 'animate-pulse'}`} />
                  <div className="relative glass w-48 h-48 md:w-56 md:h-56 rounded-full flex items-center justify-center border-accent/30 group-hover:scale-105 transition-transform duration-500 group-active:scale-95">
                    <div className={`w-40 h-40 md:w-48 md:h-48 rounded-full border-2 border-dashed border-accent/20 ${isLoading ? 'animate-spin' : 'animate-[spin_20s_linear_infinite]'}`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      {isLoading ? (
                        <Loader2 className="w-16 h-16 text-accent animate-spin" />
                      ) : (
                        <Image
                          src="/FInal_logo/Log_2.png"
                          alt="Initialize"
                          width={120}
                          height={120}
                          className={`opacity-90 group-hover:opacity-100 transition-opacity`}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-accent text-white px-8 py-3 rounded-full font-black uppercase tracking-[0.3em] text-xs pulse-red shadow-2xl shadow-accent/40 group-hover:bg-red-600 transition-colors">
                  {isLoading ? "Connecting Secure Line..." : "Initialize Protocol"}
                </div>
              </button>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top duration-300">
                  ⚠️ {error}
                  <div className="mt-1 text-[10px] opacity-70">Check server environment variables and logs.</div>
                </div>
              )}

              <div className="max-w-lg mx-auto">
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 gradient-text">
                  The Golden Minute.
                </h1>
                <p className="text-zinc-400 text-lg font-medium leading-relaxed">
                  Real-time vision and voice guidance from Gemini 1.5 Pro to eliminate panic in life-saving moments.
                </p>
              </div>
            </div>

            {/* Quick Protocols */}
            {activeTab === "rescue" ? (
              <div className="w-full max-w-4xl pt-8 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10" />
                  <span className="text-[11px] uppercase font-black tracking-[0.4em] text-accent">Rapid Protocols</span>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10" />
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  <QuickActionButton
                    icon={<Droplet />}
                    label="Heavy Bleeding"
                    color="red"
                    onClick={() => startSession("Heavy Bleeding")}
                    disabled={isLoading}
                    isBookmarked={bookmarks.includes("Heavy Bleeding")}
                    onBookmark={(e) => {
                      e.stopPropagation();
                      setBookmarks(prev => prev.includes("Heavy Bleeding") ? prev.filter(b => b !== "Heavy Bleeding") : [...prev, "Heavy Bleeding"]);
                    }}
                  />
                  <QuickActionButton
                    icon={<HeartPulse />}
                    label="No Respiration"
                    color="blue"
                    onClick={() => startSession("No Respiration")}
                    disabled={isLoading}
                    isBookmarked={bookmarks.includes("No Respiration")}
                    onBookmark={(e) => {
                      e.stopPropagation();
                      setBookmarks(prev => prev.includes("No Respiration") ? prev.filter(b => b !== "No Respiration") : [...prev, "No Respiration"]);
                    }}
                  />
                  <QuickActionButton
                    icon={<Wind />}
                    label="Child Choking"
                    color="orange"
                    onClick={() => startSession("Child Choking")}
                    disabled={isLoading}
                    isBookmarked={bookmarks.includes("Child Choking")}
                    onBookmark={(e) => {
                      e.stopPropagation();
                      setBookmarks(prev => prev.includes("Child Choking") ? prev.filter(b => b !== "Child Choking") : [...prev, "Child Choking"]);
                    }}
                  />
                  <QuickActionButton
                    icon={<Flame />}
                    label="Severe Burn"
                    color="yellow"
                    onClick={() => startSession("Severe Burn")}
                    disabled={isLoading}
                    isBookmarked={bookmarks.includes("Severe Burn")}
                    onBookmark={(e) => {
                      e.stopPropagation();
                      setBookmarks(prev => prev.includes("Severe Burn") ? prev.filter(b => b !== "Severe Burn") : [...prev, "Severe Burn"]);
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="w-full max-w-4xl pt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10" />
                  <span className="text-[11px] uppercase font-black tracking-[0.4em] text-accent">Saved Protocols</span>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10" />
                </div>

                {bookmarks.length > 0 ? (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {bookmarks.map(label => {
                      const protocols = [
                        { id: 'bleeding', title: 'Heavy Bleeding', icon: '🩸', color: 'from-red-500/20 to-red-900/40', type: 'Arterial Bleeding' },
                        { id: 'choking', title: 'Child Choking', icon: '🧒', color: 'from-orange-500/20 to-orange-900/40', type: 'Pediatric Choking' },
                        { id: 'cpr', title: 'No Respiration', icon: '🫀', color: 'from-blue-500/20 to-blue-900/40', type: 'Cardiac Arrest' },
                        { id: 'burn', title: 'Severe Burn', icon: '🔥', color: 'from-yellow-500/20 to-orange-900/40', type: 'Thermal Injury' },
                        { id: 'seizure', title: 'Seizure', icon: '⚡', color: 'from-purple-500/20 to-purple-900/40', type: 'Epileptic Event' },
                        { id: 'stroke', title: 'Stroke Sign', icon: '🧠', color: 'from-indigo-500/20 to-indigo-900/40', type: 'Cerebrovascular' },
                      ];
                      const icons: any = {
                        "Heavy Bleeding": <Droplet />,
                        "No Respiration": <HeartPulse />,
                        "Choking": <Wind />,
                        "Severe Burn": <Flame />
                      };
                      const colors: any = {
                        "Heavy Bleeding": "red",
                        "No Respiration": "blue",
                        "Choking": "orange",
                        "Severe Burn": "yellow"
                      };
                      return (
                        <QuickActionButton
                          key={label}
                          icon={icons[label]}
                          label={label}
                          color={colors[label]}
                          onClick={() => startSession(label)}
                          disabled={isLoading}
                          isBookmarked={true}
                          onBookmark={(e) => {
                            e.stopPropagation();
                            setBookmarks(prev => prev.filter(b => b !== label));
                          }}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 glass border-dashed">
                    <BookmarkPlus className="w-12 h-12 text-zinc-700 mb-4" />
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No saved protocols yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center h-[70dvh] md:h-[600px] animate-in slide-in-from-bottom-12 duration-500">
            <div className="w-full h-full glass overflow-hidden relative border-white/5 rounded-[2.5rem] shadow-2xl lg:mb-12">
              <LiveKitRoom
                video={true}
                audio={true}
                token={token!}
                serverUrl={serverUrl!}
                onDisconnected={() => { setIsConnected(false); setShowBriefing(true); }}
                className="h-full w-full"
              >
                <div className="absolute inset-0 flex flex-col">
                  {/* Active Session UI */}
                  <div className="flex-1 relative">
                    <ActiveSessionContent
                      initialEmergency={initialEmergency}
                      onEnded={() => {
                        setIsConnected(false);
                        setShowBriefing(true);
                      }}
                    />
                  </div>

                  {/* Native iOS Style Bottom Action Bar */}
                  <div className="p-6 md:p-8 bg-black/40 backdrop-blur-2xl border-t border-white/5 flex items-center justify-between gap-4 safe-bottom">
                    <div className="hidden md:flex items-center gap-3 text-zinc-500">
                      <Lock className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encrypted</span>
                    </div>

                    <button
                      onClick={() => { setIsConnected(false); setShowBriefing(true); }}
                      className="flex-1 md:flex-none px-12 py-4 bg-accent text-white font-black rounded-2xl hover:bg-red-600 transition-all active:scale-95 uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 shadow-lg shadow-accent/20"
                    >
                      <PhoneOff className="w-5 h-5 fill-white" />
                      <span className="md:inline">End Call</span>
                    </button>

                    <div className="hidden md:flex items-center gap-3 text-zinc-500">
                      <Info className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">AHA Professional Mode</span>
                    </div>
                  </div>
                </div>
                <RoomAudioRenderer />
              </LiveKitRoom>
            </div>
          </div>
        )}

        {/* Clinical Briefing Modal - FIXED OVERLAY */}
        {showBriefing && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-8 overflow-y-auto">
            <div className="max-w-3xl w-full space-y-8 animate-in zoom-in-95 duration-500 py-12">
              <div className="flex justify-between items-end border-b border-white/10 pb-8 text-left">
                <div className="space-y-2">
                  <div className="text-accent uppercase font-black tracking-widest text-xs">Emergency Resolved</div>
                  <h2 className="text-4xl font-black text-white tracking-tighter">Clinical Briefing Generated</h2>
                </div>
                <div className="text-zinc-500 text-sm font-mono hidden md:block">{new Date().toISOString()}</div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 text-left">
                <div className="space-y-6 p-8 bg-white/5 border border-white/10 rounded-[40px]">
                  <h3 className="text-white font-bold text-lg flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                    Patient Summary
                  </h3>
                  <div className="space-y-4 text-zinc-400 text-sm leading-relaxed">
                    <p><strong>Diagnosis:</strong> {initialEmergency === 'Heavy Bleeding' ? 'Critical Arterial Laceration (Left Brachial)' : 'Severe Pediatric Airway Obstruction'}</p>
                    <p><strong>Primary Action:</strong> Manual pressure applied at source. AI-coordinated first aid successful.</p>
                    <p><strong>Vital Trajectory:</strong> {initialEmergency === 'Heavy Bleeding' ? 'Blood loss estimated at 250ml. Stabilized for transport.' : 'Airway cleared. Saturation levels returning to baseline.'}</p>
                  </div>
                </div>

                <div className="space-y-6 p-8 bg-accent/5 border border-accent/20 rounded-[40px]">
                  <h3 className="text-accent font-bold text-lg flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5" />
                    Hospital Readiness
                  </h3>
                  <div className="space-y-4">
                    <div className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Preparation Required</div>
                    <div className="flex flex-wrap gap-2">
                      {(initialEmergency === 'Child Choking' ? ['Pediatric ICU', 'O2 Supply', 'RT on standby', 'Room 2'] : ['Arterial Kit', 'Plasma Prep', 'Specialist: Trauma', 'Room 4']).map((tag, i) => (
                        <span key={i} className="px-3 py-1.5 bg-accent/20 text-accent rounded-full text-[10px] font-black uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-[10px] text-zinc-500 italic">Route patient to {initialEmergency === 'Child Choking' ? 'Pediatric ICU (Room 2)' : 'Trauma Bay 4'}. This direct entry eliminates 14 minutes of intake delay.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-6 pt-8">
                <button
                  onClick={async () => {
                    setIsSyncing(true);
                    await new Promise(r => setTimeout(r, 2000));
                    setIsSyncing(false);
                    setShowBriefing(false);
                  }}
                  disabled={isSyncing}
                  className="w-full py-6 bg-white text-black font-black rounded-3xl flex items-center justify-center gap-4 hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSyncing ? (
                    <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12.5,2L20.5,10H14.5V14H10.5V10H4.5L12.5,2M4.5,16H20.5V18H4.5V16Z" /></svg>
                      SYNC CLINICAL NOTES TO GOOGLE DRIVE
                    </>
                  )}
                </button>
                <p className="text-zinc-500 text-xs font-medium tracking-wide max-w-md text-center">
                  Syncing enables instantaneous specialist review before the patient arrives, ensuring the life-saving 'Golden Minute' continues into the hospital.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <AppTabBar isConnected={isConnected} activeTab={activeTab} setActiveTab={setActiveTab} />
      <MinuteZeroFooter />
    </main>
  );
}

function AppTabBar({ isConnected, activeTab, setActiveTab }: { isConnected: boolean, activeTab: string, setActiveTab: (tab: string) => void }) {
  if (isConnected) return null;
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-24 bg-background/80 backdrop-blur-3xl border-t border-white/5 grid grid-cols-3 items-center px-6 safe-bottom z-50">
      <TabItem icon={<Activity />} label="Rescue" active={activeTab === "rescue"} onClick={() => setActiveTab("rescue")} />
      <TabItem icon={<Bookmark />} label="Saved" active={activeTab === "saved"} onClick={() => setActiveTab("saved")} />
      <TabItem icon={<Zap />} label="Settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
    </nav>
  );
}

function TabItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${active ? 'text-accent' : 'text-zinc-600 hover:text-zinc-400'}`}>
      <div className={`${active ? 'scale-110' : ''}`}>{icon}</div>
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
      {active && <div className="w-1 h-1 bg-accent rounded-full mt-0.5" />}
    </button>
  );
}

function QuickActionButton({ icon, label, color, onClick, disabled, isBookmarked, onBookmark }: { icon: React.ReactElement, label: string, color: string, onClick: () => void, disabled?: boolean, isBookmarked?: boolean, onBookmark?: (e: React.MouseEvent) => void }) {
  const colorMap: any = {
    red: 'group-hover:text-red-500 group-hover:bg-red-500/10',
    blue: 'group-hover:text-blue-500 group-hover:bg-blue-500/10',
    orange: 'group-hover:text-orange-500 group-hover:bg-orange-500/10',
    yellow: 'group-hover:text-yellow-500 group-hover:bg-yellow-500/10',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`glass group flex flex-col items-center justify-center p-8 gap-4 transition-all duration-300 hover:border-white/20 active:scale-95 overflow-hidden relative disabled:opacity-30 disabled:pointer-events-none`}
    >
      <div
        onClick={onBookmark}
        className={`absolute top-4 right-4 z-20 p-2 rounded-full transition-all duration-300 ${isBookmarked ? 'bg-accent/20 text-accent' : 'text-zinc-700 hover:text-zinc-500'}`}
      >
        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-accent' : ''}`} />
      </div>

      <div className={`text-zinc-500 transform transition-all duration-500 group-hover:scale-125 group-hover:-translate-y-1 ${colorMap[color].split(' ')[0]}`}>
        {icon && React.cloneElement(icon as React.ReactElement<any>, { className: "w-7 h-7" })}
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-white transition-colors whitespace-nowrap">
        {label}
      </span>
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

function ActiveSessionContent({ initialEmergency, onEnded }: { initialEmergency: string | null, onEnded: () => void }) {
  const [showMockFeed, setShowMockFeed] = React.useState(false);
  const [diagnostics, setDiagnostics] = React.useState({
    vessel: 'Estimating...',
    loss: 'Calculating...',
    prep: [] as string[],
    urgency: 'LEVEL 1'
  });

  React.useEffect(() => {
    if (initialEmergency) {
      const timer = setTimeout(() => {
        setShowMockFeed(true);
        if (initialEmergency === 'Heavy Bleeding') {
          setDiagnostics({
            vessel: 'Arterial (Brachial)',
            loss: '250ml and rising',
            prep: ['Trauma Bay 4', 'Tourniquet Kit', 'O-Negative Blood'],
            urgency: 'CRITICAL'
          });
        } else if (initialEmergency === 'Child Choking') {
          setDiagnostics({
            vessel: 'Partial Airway Obstruction',
            loss: 'N/A',
            prep: ['Pediatric ICU', 'Laryngoscope', 'Suction Unit'],
            urgency: 'IMMEDIATE'
          });
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [initialEmergency]);

  return (
    <div className="h-full w-full flex items-center justify-center overflow-hidden bg-black relative">
      {/* Real-time Video Stream Simulation */}
      {showMockFeed ? (
        <div className="absolute inset-0 z-0 animate-in fade-in duration-1000">
          <Image
            src={initialEmergency === 'Child Choking' ? "/child_choking.png" : "/mock_wound.png"}
            alt="Multimodal Feed"
            fill
            className="object-cover opacity-60 grayscale-[0.3] contrast-125"
          />
          {/* AI Analysis HUD Overlay */}
          <div className="absolute inset-0 border-[20px] border-accent/10 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-accent/30 rounded-full animate-[pulse_2s_infinite]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-accent/20 animate-[scan_3s_linear_infinite]" />
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 opacity-10 flex items-center justify-center grayscale pointer-events-none">
          <Image src="/FInal_logo/Log_2.png" alt="Watermark" width={400} height={400} />
        </div>
      )}

      {/* HUD Elements */}
      <div className="absolute inset-0 z-10 flex flex-col p-8 pointer-events-none">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <div className="inline-flex px-4 py-2 bg-accent/20 backdrop-blur-xl border border-accent/50 text-accent rounded-full text-[11px] font-black uppercase tracking-[0.2em] items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_#ff3b30]" />
              Multimodal Live Core
            </div>

            {initialEmergency && (
              <div className="p-6 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl space-y-2 animate-in slide-in-from-left duration-500">
                <div className="flex items-center gap-2 text-zinc-500 text-left">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Protocol Engaged</span>
                </div>
                <div className="text-white font-black text-2xl uppercase tracking-tighter">
                  {initialEmergency}
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:block text-right">
            <div className="text-white font-black text-2xl tracking-tighter italic leading-none">AGENT<span className="text-accent italic">01</span></div>
            <div className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">HOSPTIAL PRE-ORDER</div>
          </div>
        </div>

        {/* Live Diagnostics Card */}
        {showMockFeed && (
          <div className="absolute top-1/2 right-8 -translate-y-1/2 w-72 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 space-y-6 animate-in slide-in-from-right duration-700 pointer-events-auto">
            <div className="space-y-1 border-b border-white/5 pb-4">
              <div className="text-[10px] font-black uppercase text-accent tracking-[0.4em]">Live Analysis</div>
              <div className="text-white font-black text-lg tracking-tight">Clinical Markers</div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest mb-1">Target Area</div>
                <div className="text-white font-bold text-sm">{diagnostics.vessel}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest mb-1">Impact Study</div>
                <div className="text-red-500 font-bold text-sm mb-1">{diagnostics.loss}</div>
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="w-[60%] h-full bg-red-500 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest mb-2">Hospital Prep-List</div>
                <div className="space-y-1.5">
                  {diagnostics.prep.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-accent rounded-full" />
                      <span className="text-xs text-zinc-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto flex justify-center pb-12">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEnded();
            }}
            className="px-10 py-5 bg-red-600 hover:bg-red-700 text-white font-black rounded-3xl transition-all hover:scale-105 pointer-events-auto shadow-[0_20px_40px_rgba(220,38,38,0.2)]"
          >
            END EMERGENCY SESSION
          </button>
        </div>
      </div>
    </div>
  );
}

function MinuteZeroFooter() {
  return (
    <footer className="hidden lg:flex fixed bottom-8 left-12 right-12 justify-between items-center z-50 text-[9px] uppercase tracking-[0.4em] text-zinc-600 font-black pointer-events-none">
      <div className="pointer-events-auto text-zinc-500 text-left">© 2026 MINUTEZERO SYSTEMS</div>
      <div className="flex gap-8 pointer-events-auto items-center">
        <span className="flex items-center gap-2 text-zinc-500">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          LIVE SIGNAL
        </span>
        <a href="/PRIVACY_POLICY.html" className="text-zinc-500 hover:text-white transition-colors cursor-pointer no-underline">PRIVACY POLICY</a>
        <a href="/TERMS_OF_USE.html" className="text-zinc-500 hover:text-white transition-colors cursor-pointer no-underline">TERMS OF USE</a>
      </div>
    </footer>
  );
}
