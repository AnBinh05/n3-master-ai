'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Headphones, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  Music,
  X
} from 'lucide-react';
import { 
  AMBIENT_TRACKS, 
  AmbientTrackId, 
  playAmbientSound, 
  stopAmbientSound, 
  setAmbientVolume 
} from '@/lib/ambient-audio';
import { playClick } from '@/lib/game-audio';

export function LofiStudyPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AmbientTrackId>('rain');
  const [volume, setVolume] = useState(0.35);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setAmbientVolume(volume);
  }, [volume]);

  const handleTogglePlay = () => {
    playClick();
    if (isPlaying) {
      stopAmbientSound();
      setIsPlaying(false);
    } else {
      playAmbientSound(currentTrack);
      setIsPlaying(true);
    }
  };

  const handleSelectTrack = (trackId: AmbientTrackId) => {
    playClick();
    setCurrentTrack(trackId);
    if (isPlaying) {
      playAmbientSound(trackId);
    }
  };

  const selectedTrackInfo = AMBIENT_TRACKS.find((t) => t.id === currentTrack) || AMBIENT_TRACKS[0];

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 select-none">
      <AnimatePresence>
        {isExpanded ? (
          /* Expanded Studio Panel */
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-80 sm:w-96 rounded-3xl bg-card/95 backdrop-blur-xl border border-border/80 shadow-2xl p-5 space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-foreground flex items-center gap-1">
                    Tokyo Lofi Study Room <Sparkles className="w-3 h-3 text-amber-400" />
                  </h4>
                  <p className="text-[10px] text-muted-foreground">Âm thanh thư giãn & tập trung sâu</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Current Playing Track Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-card border border-purple-500/20 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">
                  {selectedTrackInfo.icon} {selectedTrackInfo.name}
                </span>
                {isPlaying && (
                  <div className="flex items-center gap-0.5">
                    <span className="w-1 h-3 bg-purple-500 rounded-full animate-pulse" />
                    <span className="w-1 h-5 bg-purple-500 rounded-full animate-pulse delay-100" />
                    <span className="w-1 h-2 bg-purple-500 rounded-full animate-pulse delay-200" />
                  </div>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground">{selectedTrackInfo.description}</p>
            </div>

            {/* Track Selector Grid */}
            <div className="grid grid-cols-2 gap-2">
              {AMBIENT_TRACKS.map((track) => (
                <button
                  key={track.id}
                  onClick={() => handleSelectTrack(track.id)}
                  className={`p-2.5 rounded-xl text-left font-bold text-xs transition-all border ${
                    currentTrack === track.id
                      ? 'bg-purple-500/15 border-purple-500 text-purple-600 dark:text-purple-300 shadow-sm'
                      : 'bg-muted/40 border-border/40 text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <div className="text-base">{track.icon}</div>
                  <div className="truncate text-[11px] mt-0.5">{track.name}</div>
                </button>
              ))}
            </div>

            {/* Volume & Master Play Controls */}
            <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-3">
              {/* Volume Slider */}
              <div className="flex items-center gap-2 flex-1">
                <Volume2 className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              {/* Big Play/Pause Button */}
              <button
                onClick={handleTogglePlay}
                className={`p-2.5 rounded-xl font-bold text-white shadow-md transition-all active:scale-95 ${
                  isPlaying
                    ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 shadow-purple-500/20'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>
            </div>
          </motion.div>
        ) : (
          /* Compact Floating Music Pill */
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 p-2 rounded-full bg-card/90 backdrop-blur-md border border-purple-500/30 shadow-xl hover:border-purple-500/60 transition-all cursor-pointer group"
          >
            <button
              onClick={handleTogglePlay}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold transition-all shadow-md ${
                isPlaying
                  ? 'bg-gradient-to-tr from-purple-500 to-indigo-600 animate-spin-slow'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
              title={isPlaying ? 'Tạm dừng Lofi BGM' : 'Phát Lofi BGM'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-white" />
              ) : (
                <Play className="w-4 h-4 fill-foreground ml-0.5" />
              )}
            </button>

            <div
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-2 pr-3"
            >
              <div className="text-left">
                <div className="text-[11px] font-black text-foreground flex items-center gap-1">
                  <span>{selectedTrackInfo.icon}</span>
                  <span className="hidden sm:inline">{selectedTrackInfo.name.split(' ')[0]}</span>
                </div>
                <span className="text-[9px] font-semibold text-purple-500 block">
                  {isPlaying ? 'Đang phát Lofi' : 'Phòng học Lofi'}
                </span>
              </div>

              <ChevronUp className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
