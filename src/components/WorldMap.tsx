import React, { useState } from 'react';
import {
  Lock,
  CheckCircle2,
  Sparkles,
  Play,
  Compass,
  Clock,
  Award,
  Unlock,
} from 'lucide-react';
import { REGIONS, getLessonsForRegion } from '../data/curriculum';
import { useGame } from '../context/GameContext';

export const WorldMap: React.FC = () => {
  const { state, getRegionStatus, openLesson, toggleExplorerMode } = useGame();
  const [selectedRegionId, setSelectedRegionId] = useState<string>('binary-valley');

  const selectedRegion = REGIONS.find((r) => r.id === selectedRegionId) || REGIONS[0];
  const selectedStatus = getRegionStatus(selectedRegion.id);
  const selectedLessons = getLessonsForRegion(selectedRegion.id);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-cyan-400" /> World Map & Learning Campaign
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Conquer all 10 realms of programming. Complete missions to unlock the next region!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Mastered</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Completed</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Available</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-600" /> Locked</span>
          </div>
          <button
            onClick={toggleExplorerMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              state.explorerMode
                ? 'bg-purple-500/20 border-purple-400 text-purple-200'
                : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Toggle Explorer Mode to preview locked regions"
          >
            <Unlock className="w-3.5 h-3.5" />
            {state.explorerMode ? 'Explorer Mode: ON' : 'Explorer Mode'}
          </button>
        </div>
      </div>

      {/* Map + Drawer Layout */}
      <div className="grid lg:grid-cols-12 gap-5">
        {/* Interactive SVG World Map */}
        <div className="lg:col-span-8 cq-panel cq-glow-border rounded-2xl p-4 relative overflow-hidden cq-grid-bg">
          <svg viewBox="0 0 1000 540" className="w-full h-auto select-none">
            <defs>
              <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
              </linearGradient>
              <filter id="nodeGlow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Connecting Energy Paths */}
            {REGIONS.map((region, idx) => {
              if (idx === 0) return null;
              const prev = REGIONS[idx - 1];
              const status = getRegionStatus(region.id);
              const unlocked = status !== 'locked';
              return (
                <line
                  key={`path-${region.id}`}
                  x1={prev.mapX}
                  y1={prev.mapY}
                  x2={region.mapX}
                  y2={region.mapY}
                  stroke={unlocked ? 'url(#pathGrad)' : '#1e293b'}
                  strokeWidth={unlocked ? 4 : 2.5}
                  strokeDasharray={unlocked ? undefined : '8 6'}
                />
              );
            })}

            {/* Region Nodes */}
            {REGIONS.map((region) => {
              const status = getRegionStatus(region.id);
              const isSelected = region.id === selectedRegion.id;
              const lessons = getLessonsForRegion(region.id);
              const done = lessons.filter((l) => state.completedLessons.includes(l.id)).length;

              const strokeColor =
                status === 'mastered'
                  ? '#fbbf24'
                  : status === 'completed'
                    ? '#34d399'
                    : status === 'available'
                      ? region.accentColor
                      : '#475569';

              return (
                <g
                  key={region.id}
                  onClick={() => setSelectedRegionId(region.id)}
                  className="cursor-pointer group"
                >
                  {isSelected && (
                    <circle
                      cx={region.mapX}
                      cy={region.mapY}
                      r={34}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={2}
                      strokeDasharray="6 4"
                      opacity={0.85}
                    />
                  )}

                  <circle
                    cx={region.mapX}
                    cy={region.mapY}
                    r={24}
                    fill={status === 'locked' ? '#0f172a' : '#0b132b'}
                    stroke={strokeColor}
                    strokeWidth={isSelected ? 4 : 3}
                    filter={status !== 'locked' ? 'url(#nodeGlow)' : undefined}
                  />

                  <text
                    x={region.mapX}
                    y={region.mapY + 5}
                    textAnchor="middle"
                    fill={status === 'locked' ? '#64748b' : '#ffffff'}
                    fontSize="14"
                    fontWeight="800"
                    fontFamily="Orbitron, sans-serif"
                  >
                    {status === 'mastered' ? '★' : status === 'completed' ? '✓' : region.number}
                  </text>

                  {/* Label Pill */}
                  <rect
                    x={region.mapX - 68}
                    y={region.mapY + 30}
                    width={136}
                    height={30}
                    rx={8}
                    fill="rgba(6, 9, 19, 0.88)"
                    stroke={isSelected ? strokeColor : 'rgba(148, 163, 184, 0.2)'}
                    strokeWidth={1}
                  />
                  <text
                    x={region.mapX}
                    y={region.mapY + 44}
                    textAnchor="middle"
                    fill={status === 'locked' ? '#94a3b8' : '#f1f5f9'}
                    fontSize="10.5"
                    fontWeight="700"
                  >
                    {region.name.replace('The ', '')}
                  </text>
                  <text
                    x={region.mapX}
                    y={region.mapY + 56}
                    textAnchor="middle"
                    fill={strokeColor}
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {done}/{lessons.length} quests
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Region Details & Mission Selector */}
        <div className="lg:col-span-4 cq-panel rounded-2xl p-5 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400">
                  Region {selectedRegion.number} of 10
                </span>
                <h2 className="font-display text-xl font-bold text-white mt-0.5">
                  {selectedRegion.name}
                </h2>
                <p className="text-xs text-purple-300 font-medium">{selectedRegion.subtitle}</p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${
                  selectedStatus === 'mastered'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : selectedStatus === 'completed'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : selectedStatus === 'available'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {selectedStatus}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{selectedRegion.description}</p>

            {/* Topics */}
            <div className="flex flex-wrap gap-1.5">
              {selectedRegion.topics.map((topic) => (
                <span
                  key={topic}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300"
                >
                  {topic}
                </span>
              ))}
            </div>

            {/* Missions List */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Region Missions ({selectedLessons.length})
              </h3>

              {selectedStatus === 'locked' && (
                <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-3.5 text-xs text-slate-400 flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <span>
                    Complete all missions in{' '}
                    <strong className="text-slate-200">
                      {REGIONS.find((r) => r.id === selectedRegion.requiredRegionId)?.name}
                    </strong>{' '}
                    to unlock this region! (Or enable Explorer Mode above to preview.)
                  </span>
                </div>
              )}

              {selectedLessons.map((lesson) => {
                const isDone = state.completedLessons.includes(lesson.id);
                const locked = selectedStatus === 'locked';
                return (
                  <button
                    key={lesson.id}
                    disabled={locked}
                    onClick={() => openLesson(lesson.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      locked
                        ? 'bg-slate-900/40 border-slate-800/60 opacity-55 cursor-not-allowed'
                        : isDone
                          ? 'bg-emerald-950/25 border-emerald-500/35 hover:border-emerald-400'
                          : 'bg-slate-900/80 border-slate-700/80 hover:border-cyan-400 hover:bg-cyan-950/20'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : locked ? (
                          <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        )}
                        <span className="text-sm font-bold text-white truncate">{lesson.title}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="uppercase font-mono text-cyan-300">{lesson.language}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {lesson.estimatedMinutes}m
                        </span>
                        <span className="flex items-center gap-1 text-amber-300">
                          <Award className="w-3 h-3" /> +{lesson.xpReward} XP
                        </span>
                      </div>
                    </div>

                    {!locked && (
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
