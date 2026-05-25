import React, { useState } from "react";
import Button from "./Button";

function PlayerSelectionPopup({ team1, team2, onPlayersSet, onCancel }) {
  const [team1Batsmen, setTeam1Batsmen] = useState(["Batsman 1", "Batsman 2", "Batsman 3", "Batsman 4", "Batsman 5"]);
  const [team1Bowlers, setTeam1Bowlers] = useState(["Bowler 1", "Bowler 2", "Bowler 3"]);
  const [team2Batsmen, setTeam2Batsmen] = useState(["Batsman 1", "Batsman 2", "Batsman 3", "Batsman 4", "Batsman 5"]);
  const [team2Bowlers, setTeam2Bowlers] = useState(["Bowler 1", "Bowler 2", "Bowler 3"]);

  const [editingTeam, setEditingTeam] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newPlayerName, setNewPlayerName] = useState("");

  const handleEditPlayer = (team, role, index, currentName) => {
    setEditingTeam(team);
    setEditingRole(role);
    setEditingIndex(index);
    setNewPlayerName(currentName);
  };

  const handleSaveEdit = (team, role, index) => {
    if (!newPlayerName.trim()) return;

    if (team === "team1") {
      if (role === "batsmen") {
        const updated = [...team1Batsmen];
        updated[index] = newPlayerName.trim();
        setTeam1Batsmen(updated);
      } else {
        const updated = [...team1Bowlers];
        updated[index] = newPlayerName.trim();
        setTeam1Bowlers(updated);
      }
    } else {
      if (role === "batsmen") {
        const updated = [...team2Batsmen];
        updated[index] = newPlayerName.trim();
        setTeam2Batsmen(updated);
      } else {
        const updated = [...team2Bowlers];
        updated[index] = newPlayerName.trim();
        setTeam2Bowlers(updated);
      }
    }
    setEditingTeam(null);
    setEditingRole(null);
    setEditingIndex(null);
    setNewPlayerName("");
  };

  const handleAddPlayer = (team, role) => {
    if (!newPlayerName.trim()) return;

    if (team === "team1") {
      if (role === "batsmen") {
        setTeam1Batsmen([...team1Batsmen, newPlayerName.trim()]);
      } else {
        setTeam1Bowlers([...team1Bowlers, newPlayerName.trim()]);
      }
    } else {
      if (role === "batsmen") {
        setTeam2Batsmen([...team2Batsmen, newPlayerName.trim()]);
      } else {
        setTeam2Bowlers([...team2Bowlers, newPlayerName.trim()]);
      }
    }
    setNewPlayerName("");
  };

  const handleRemovePlayer = (team, role, index) => {
    if (team === "team1") {
      if (role === "batsmen") {
        setTeam1Batsmen(team1Batsmen.filter((_, i) => i !== index));
      } else {
        setTeam1Bowlers(team1Bowlers.filter((_, i) => i !== index));
      }
    } else {
      if (role === "batsmen") {
        setTeam2Batsmen(team2Batsmen.filter((_, i) => i !== index));
      } else {
        setTeam2Bowlers(team2Bowlers.filter((_, i) => i !== index));
      }
    }
  };

  const handleConfirm = () => {
    onPlayersSet({
      [team1]: { batsmen: team1Batsmen, bowlers: team1Bowlers },
      [team2]: { batsmen: team2Batsmen, bowlers: team2Bowlers },
    });
  };

  const renderPlayerSection = (teamName, batsmen, bowlers, teamKey, role, setPlayers) => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-bold text-emerald-300 uppercase mb-2">🏏 Batsmen</h4>
        <div className="space-y-2 mb-3">
          {batsmen.map((batsman, idx) => (
            <div key={idx}>
              {editingTeam === teamKey && editingRole === "batsmen" && editingIndex === idx ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    placeholder="Player name"
                    className="flex-1 px-2 py-1 rounded-lg bg-slate-800 text-slate-100 text-sm outline-none border border-slate-600 focus:border-emerald-400"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveEdit(teamKey, "batsmen", idx)}
                    className="px-2 py-1 bg-emerald-600/80 hover:bg-emerald-600 text-emerald-100 rounded text-sm font-semibold"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => setEditingTeam(null)}
                    className="px-2 py-1 bg-slate-600 hover:bg-slate-500 text-slate-200 rounded text-sm font-semibold"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-slate-800/50 p-2 rounded-lg group">
                  <span
                    onClick={() => handleEditPlayer(teamKey, "batsmen", idx, batsman)}
                    className="text-sm text-slate-200 cursor-pointer hover:text-emerald-400 transition flex-1"
                  >
                    {idx + 1}. {batsman}
                  </span>
                  <button
                    onClick={() => handleRemovePlayer(teamKey, "batsmen", idx)}
                    className="text-xs bg-red-600/30 hover:bg-red-600/50 text-red-300 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        {editingTeam === teamKey && editingRole === "batsmen" && editingIndex === null ? (
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="New batsman name"
              className="flex-1 px-2 py-1 rounded-lg bg-slate-800 text-slate-100 text-sm outline-none border border-slate-600 focus:border-emerald-400"
              autoFocus
            />
            <button
              onClick={() => handleAddPlayer(teamKey, "batsmen")}
              className="px-3 py-1 bg-emerald-600/80 hover:bg-emerald-600 text-emerald-100 rounded text-sm font-semibold"
            >
              Add
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setEditingTeam(teamKey);
              setEditingRole("batsmen");
              setEditingIndex(null);
              setNewPlayerName("");
            }}
            className="w-full py-1 text-xs bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded font-semibold"
          >
            + Add Batsman
          </button>
        )}
      </div>

      <div>
        <h4 className="text-sm font-bold text-rose-300 uppercase mb-2">🎯 Bowlers</h4>
        <div className="space-y-2 mb-3">
          {bowlers.map((bowler, idx) => (
            <div key={idx}>
              {editingTeam === teamKey && editingRole === "bowlers" && editingIndex === idx ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    placeholder="Player name"
                    className="flex-1 px-2 py-1 rounded-lg bg-slate-800 text-slate-100 text-sm outline-none border border-slate-600 focus:border-rose-400"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveEdit(teamKey, "bowlers", idx)}
                    className="px-2 py-1 bg-rose-600/80 hover:bg-rose-600 text-rose-100 rounded text-sm font-semibold"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => setEditingTeam(null)}
                    className="px-2 py-1 bg-slate-600 hover:bg-slate-500 text-slate-200 rounded text-sm font-semibold"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-slate-800/50 p-2 rounded-lg group">
                  <span
                    onClick={() => handleEditPlayer(teamKey, "bowlers", idx, bowler)}
                    className="text-sm text-slate-200 cursor-pointer hover:text-rose-400 transition flex-1"
                  >
                    {idx + 1}. {bowler}
                  </span>
                  <button
                    onClick={() => handleRemovePlayer(teamKey, "bowlers", idx)}
                    className="text-xs bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        {editingTeam === teamKey && editingRole === "bowlers" && editingIndex === null ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="New bowler name"
              className="flex-1 px-2 py-1 rounded-lg bg-slate-800 text-slate-100 text-sm outline-none border border-slate-600 focus:border-rose-400"
              autoFocus
            />
            <button
              onClick={() => handleAddPlayer(teamKey, "bowlers")}
              className="px-3 py-1 bg-rose-600/80 hover:bg-rose-600 text-rose-100 rounded text-sm font-semibold"
            >
              Add
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setEditingTeam(teamKey);
              setEditingRole("bowlers");
              setEditingIndex(null);
              setNewPlayerName("");
            }}
            className="w-full py-1 text-xs bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded font-semibold"
          >
            + Add Bowler
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 px-4 py-6 overflow-auto">
      <div className="bg-slate-950 border border-cyan-500/40 rounded-3xl shadow-2xl w-full max-w-2xl text-slate-100">
        <div className="sticky top-0 bg-slate-950/95 border-b border-slate-700/50 px-6 py-4 flex justify-between items-center rounded-t-3xl">
          <h2 className="text-2xl font-bold text-cyan-400">⚾ Player Rosters</h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-200 text-2xl font-bold transition">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Team 1 */}
          <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl p-4">
            <h3 className="text-lg font-bold text-emerald-400 mb-4 pb-3 border-b border-emerald-500/20">{team1}</h3>
            {renderPlayerSection(team1, team1Batsmen, team1Bowlers, "team1", "both", null)}
          </div>

          {/* Team 2 */}
          <div className="bg-slate-900/80 border border-rose-500/30 rounded-xl p-4">
            <h3 className="text-lg font-bold text-rose-400 mb-4 pb-3 border-b border-rose-500/20">{team2}</h3>
            {renderPlayerSection(team2, team2Batsmen, team2Bowlers, "team2", "both", null)}
          </div>
        </div>

        <div className="border-t border-slate-700/50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-lg font-semibold transition"
          >
            ✅ Confirm Rosters
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlayerSelectionPopup;
