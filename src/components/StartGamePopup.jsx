import React, { useState } from "react";
import { GAME_CONSTANTS } from "../constants";
import {
  validateTeamNames,
  validateOvers,
  validateWickets,
} from "../utils/cricketUtils";

function StartGamePopup({ setTeam1, setTeam2, setTotalOvers, setTotalWickets, setStartGameVisible, setWicket, setScore, setOver, setBalls, setBattingTeam }) {
  const [team1Input, setTeam1Input] = useState("");
  const [team2Input, setTeam2Input] = useState("");
  const [oversInput, setOversInput] = useState(GAME_CONSTANTS.DEFAULT_OVERS);
  const [wicketsInput, setWicketsInput] = useState(GAME_CONSTANTS.DEFAULT_WICKETS);
  const [selectedBattingTeam, setSelectedBattingTeam] = useState("team1");
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
    setTeam1(team1Input.trim());
    setTeam2(team2Input.trim());
    setTotalOvers(Number(oversInput));
    setTotalWickets(Number(wicketsInput));
    setWicket(Number(wicketsInput));
    setScore(0);
    setOver(0);
    setBalls(0);
    setBattingTeam(selectedBattingTeam === "team1" ? team1Input.trim() : team2Input.trim());
    setStartGameVisible(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-gradient-to-br from-green-900 to-black/90 backdrop-blur-lg flex justify-center items-center z-50">
      <div className="bg-gradient-to-br from-slate-900 to-black p-8 rounded-2xl shadow-2xl flex flex-col gap-6 w-[95%] max-w-lg text-gray-200 relative border-2 border-cyan-500/30">
        <button
          onClick={() => setStartGameVisible(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl font-bold w-10 h-10 flex items-center justify-center hover:bg-red-500/20 rounded-full transition"
          aria-label="Close Popup"
        >
          ✕
        </button>

        <div className="text-center pt-2">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">🏏 New Match</h2>
          <p className="text-gray-400 text-sm">Configure teams and match settings</p>
        </div>

        <div className="space-y-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-cyan-300 uppercase tracking-wider">Team 1</label>
            <input
              type="text"
              value={team1Input}
              onChange={(e) => setTeam1Input(e.target.value)}
              className="p-3 rounded-lg border-2 border-cyan-500/30 bg-slate-800/50 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 outline-none transition"
              placeholder="Enter team 1 name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-cyan-300 uppercase tracking-wider">Team 2</label>
            <input
              type="text"
              value={team2Input}
              onChange={(e) => setTeam2Input(e.target.value)}
              className="p-3 rounded-lg border-2 border-cyan-500/30 bg-slate-800/50 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 outline-none transition"
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
                className="p-3 rounded-lg border-2 border-cyan-500/30 bg-slate-800/50 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 outline-none transition"
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
                className="p-3 rounded-lg border-2 border-cyan-500/30 bg-slate-800/50 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 outline-none transition"
                min={GAME_CONSTANTS.MIN_WICKETS}
                max={GAME_CONSTANTS.MAX_WICKETS}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-cyan-300 uppercase tracking-wider">Batting Team</label>
            <select
              value={selectedBattingTeam}
              onChange={(e) => setSelectedBattingTeam(e.target.value)}
              className="p-3 rounded-lg border-2 border-cyan-500/30 bg-slate-800/50 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 outline-none transition cursor-pointer"
            >
              <option value="team1" className="bg-slate-900">{team1Input || "Team 1"}</option>
              <option value="team2" className="bg-slate-900">{team2Input || "Team 2"}</option>
            </select>
          </div>
        </div>

        {errorMessage && (
          <div className="bg-red-500/20 border-l-4 border-red-500 p-4 rounded text-red-200 text-sm">
            {errorMessage}
          </div>
        )}

        <button
          onClick={handleStart}
          className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:via-blue-400 hover:to-indigo-500 p-4 rounded-xl text-white font-bold text-lg transition-all shadow-lg hover:shadow-xl active:scale-95 transform"
        >
          🎮 Start Game
        </button>
      </div>
    </div>
  );
}

export default StartGamePopup;