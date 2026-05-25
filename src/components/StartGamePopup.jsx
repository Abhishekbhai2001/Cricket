import React, { useState } from "react";
import { GAME_CONSTANTS } from "../constants";
import {
  validateTeamNames,
  validateOvers,
  validateWickets,
} from "../utils/cricketUtils";

function StartGamePopup({ onStartGame, onClose }) {
  const [team1Input, setTeam1Input] = useState("");
  const [team2Input, setTeam2Input] = useState("");
  const [oversInput, setOversInput] = useState(GAME_CONSTANTS.DEFAULT_OVERS);
  const [wicketsInput, setWicketsInput] = useState(GAME_CONSTANTS.DEFAULT_WICKETS);
  const [errorMessage, setErrorMessage] = useState("");

  const handleStart = () => {
    // Validate team names
    const teamValidation = validateTeamNames(team1Input, team2Input);
    if (!teamValidation.isValid) {
      setErrorMessage(teamValidation.error);
      return;
    }

    // Validate overs
    const oversValidation = validateOvers(oversInput);
    if (!oversValidation.isValid) {
      setErrorMessage(oversValidation.error);
      return;
    }

    // Validate wickets
    const wicketsValidation = validateWickets(wicketsInput);
    if (!wicketsValidation.isValid) {
      setErrorMessage(wicketsValidation.error);
      return;
    }

    setErrorMessage("");
    onStartGame({
      team1: team1Input.trim(),
      team2: team2Input.trim(),
      totalOvers: Number(oversInput),
      totalWickets: Number(wicketsInput),
    });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-black/60 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-slate-950 p-8 rounded-3xl shadow-2xl flex flex-col gap-6 w-[95%] max-w-lg text-slate-200 relative border border-cyan-500/40">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl font-bold w-10 h-10 flex items-center justify-center hover:bg-red-500/20 rounded-full transition"
          aria-label="Close Popup"
        >
          ✕
        </button>

        <div className="text-center pt-2">
          <h2 className="text-4xl font-bold text-cyan-400 mb-2">🏏 New Match</h2>
          <p className="text-slate-400 text-sm">Configure teams and match settings</p>
        </div>

        <div className="space-y-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-cyan-300 uppercase tracking-wider">Team 1</label>
            <input
              type="text"
              value={team1Input}
              onChange={(e) => setTeam1Input(e.target.value)}
              className="p-3 rounded-xl border border-slate-600 bg-slate-900/80 text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 outline-none transition"
              placeholder="Enter team 1 name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-cyan-300 uppercase tracking-wider">Team 2</label>
            <input
              type="text"
              value={team2Input}
              onChange={(e) => setTeam2Input(e.target.value)}
              className="p-3 rounded-xl border border-slate-600 bg-slate-900/80 text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 outline-none transition"
              placeholder="Enter team 2 name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-cyan-300 uppercase tracking-wider">Overs</label>
              <input
                type="number"
                value={oversInput}
                onChange={(e) => setOversInput(Number(e.target.value))}
                className="p-3 rounded-xl border border-slate-600 bg-slate-900/80 text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 outline-none transition"
                min={GAME_CONSTANTS.MIN_OVERS}
                max={GAME_CONSTANTS.MAX_OVERS}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-cyan-300 uppercase tracking-wider">Wickets</label>
              <input
                type="number"
                value={wicketsInput}
                onChange={(e) => setWicketsInput(Number(e.target.value))}
                className="p-3 rounded-xl border border-slate-600 bg-slate-900/80 text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 outline-none transition"
                min={GAME_CONSTANTS.MIN_WICKETS}
                max={GAME_CONSTANTS.MAX_WICKETS}
              />
            </div>
          </div>

        </div>

        {errorMessage && (
          <div className="bg-red-500/20 border-l-4 border-red-500 p-4 rounded text-red-200 text-sm">
            {errorMessage}
          </div>
        )}

        <button
          onClick={handleStart}
          className="w-full bg-cyan-600 hover:bg-cyan-500 p-3 rounded-xl text-slate-950 font-bold text-lg transition-all shadow-lg active:scale-95"
        >
          🎮 Start Game
        </button>
      </div>
    </div>
  );
}

export default StartGamePopup;