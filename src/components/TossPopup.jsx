import React, { useState } from "react";
import Button from "./Button";

function TossPopup({ team1, team2, onTossConfirm, onCancel }) {
  const [selectedWinner, setSelectedWinner] = useState(team1 || team2);
  const [selectedDecision, setSelectedDecision] = useState("bat");

  const handleConfirm = () => {
    if (!selectedWinner) return;
    onTossConfirm({ winner: selectedWinner, decision: selectedDecision });
  };

  const randomizeToss = () => {
    const winner = Math.random() < 0.5 ? team1 : team2;
    const decision = Math.random() < 0.5 ? "bat" : "field";
    setSelectedWinner(winner);
    setSelectedDecision(decision);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 px-4">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl shadow-2xl p-8 w-full max-w-xl text-white">
        <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-700/50">
          <div>
            <h2 className="text-3xl font-bold text-cyan-400">🏏 Toss</h2>
            <p className="text-sm text-slate-400 mt-2">Choose the toss winner and decision before the match begins.</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-200 text-2xl font-bold transition"
            aria-label="Cancel Toss"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-4">
          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-700/50">
            <div className="text-sm uppercase tracking-[0.2em] text-slate-400 mb-2">Toss Winner</div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                label={team1}
                onClick={() => setSelectedWinner(team1)}
                variant={selectedWinner === team1 ? "runs" : "default"}
              />
              <Button
                label={team2}
                onClick={() => setSelectedWinner(team2)}
                variant={selectedWinner === team2 ? "runs" : "default"}
              />
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-4">
            <div className="text-sm uppercase tracking-[0.2em] text-slate-400 mb-2">Decision</div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                label="Bat"
                onClick={() => setSelectedDecision("bat")}
                variant={selectedDecision === "bat" ? "boundary" : "default"}
              />
              <Button
                label="Field"
                onClick={() => setSelectedDecision("field")}
                variant={selectedDecision === "field" ? "boundary" : "default"}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between pt-2">
            <button
              type="button"
              onClick={randomizeToss}
              className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-xl px-5 py-3 font-semibold transition"
            >
              🎲 Random Toss
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 rounded-xl px-5 py-3 font-semibold text-slate-950 transition"
            >
              ✅ Confirm Toss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TossPopup;
