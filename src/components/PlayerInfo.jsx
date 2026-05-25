import React from "react";

function PlayerInfo({ currentBatsman, nonStriker, currentBowler, battingTeam, bowlingTeam }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Batting Info */}
      <div className="bg-slate-900/80 rounded-2xl p-5 border border-emerald-500/40 backdrop-blur-sm">
        <div className="text-xs uppercase tracking-widest text-emerald-300 font-semibold mb-3 pb-3 border-b border-emerald-500/20">
          🏏 Batting - {battingTeam}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs text-emerald-200/70">On Strike</div>
              <div className="text-lg font-bold text-white">{currentBatsman}</div>
            </div>
            <div className="text-2xl text-emerald-400">★</div>
          </div>
          <div className="border-t border-emerald-500/20 pt-2">
            <div className="text-xs text-emerald-200/70">Non-Striker</div>
            <div className="text-base font-semibold text-emerald-200">{nonStriker}</div>
          </div>
        </div>
      </div>

      {/* Bowling Info */}
      <div className="bg-slate-900/80 rounded-2xl p-5 border border-rose-500/40 backdrop-blur-sm">
        <div className="text-xs uppercase tracking-widest text-rose-300 font-semibold mb-3 pb-3 border-b border-rose-500/20">
          🎯 Bowling - {bowlingTeam}
        </div>
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs text-rose-200/70">Current Bowler</div>
            <div className="text-lg font-bold text-white">{currentBowler}</div>
          </div>
          <div className="text-2xl text-rose-400">◆</div>
        </div>
      </div>
    </div>
  );
}

export default PlayerInfo;
