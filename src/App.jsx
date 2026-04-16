import { useState } from "react";
import Button from "./components/Button";
import "./index.css";
import StartGamePopup from "./components/StartGamePopup";
import Popup from "./components/Popup";
import { GAME_CONSTANTS } from "./constants";

function App() {
  const [gameState, setGameState] = useState({
    // Basic match info
    score: 0,
    over: 0,
    wicket: 10,
    balls: 0,
    team1: "",
    team2: "",
    totalOvers: GAME_CONSTANTS.DEFAULT_OVERS,
    totalWickets: GAME_CONSTANTS.DEFAULT_WICKETS,
    isStartGamePopupVisible: true,
    history: [],
    battingTeam: "",
    inning: 1,
    firstInningsScore: null,
    isInningsTransition: false,
    isInningsEndPopupVisible: false,
    isResultPopupVisible: false,
    resultMessage: "",
    resultDetails: "", // Details about how they won
    gameMessage: "",
    isGameOver: false,
    batsmanRuns: 0,
    lastDeliveryType: null, // 'legal' | 'wide' | 'noball' 
    extras: {
      wides: 0,
      noBalls: 0,
      byes: 0,
      legByes: 0,
    },

    // Toss Info
    isTossScreen: false,
    tossWinner: "",
    tossDecision: "", // "bat" or "field"

    // Player Info
    currentBatsman: "Batsman 1",
    nonStriker: "Batsman 2",
    currentBowler: "Bowler 1",

    // Statistics
    boundaries: 0, // Count of 4s
    sixers: 0, // Count of 6s
    wides: 0,
    noBalls: 0,
    byes: 0,
    legByes: 0,
    dotBalls: 0,

    // Powerplay tracking
    isPowerplay: true, // First 6 overs

    // Fall of wickets
    fallOfWickets: [], // [{over: "2.3", batsman: "Name", bowler: "Bowler", runs: 45}, ...]

    // Ball-by-ball tracking
    ballByBall: [], // [{over: "1.1", runs: 4, type: "boundary", details: "..."}, ...]

    // Required run rate (2nd innings)
    requiredRunRate: 0,
    currentRunRate: 0,

    // Extras popup
    isExtrasPopupVisible: false,
  });

  // Calculate new overs and balls count
  const calculateOversAndBalls = (currentBalls, currentOvers, ballsToAdd = 1) => {
    let newBalls = currentBalls + ballsToAdd;
    let newOvers = currentOvers;
    if (newBalls >= GAME_CONSTANTS.BALLS_PER_OVER) {
      newOvers += Math.floor(newBalls / GAME_CONSTANTS.BALLS_PER_OVER);
      newBalls %= GAME_CONSTANTS.BALLS_PER_OVER;
    }
    return { overs: newOvers, balls: newBalls };
  };

  // Save game state to history (without history reference to prevent nesting)
  const saveToHistory = (state) => {
    const { history: currentHistory, ...stateWithoutHistory } = state;
    return [...currentHistory, stateWithoutHistory];
  };

  const updateGameEnd = (newState) => {
    if (newState.inning === 1) {
      if (newState.wicket <= 0) {
        newState.firstInningsScore = newState.score;
        newState.isInningsTransition = true;
        newState.isInningsEndPopupVisible = true;
        newState.gameMessage = `First innings complete: ${newState.battingTeam} all out at ${newState.score}.`;
        newState.isGameOver = true;
        return;
      }
      if (newState.over >= newState.totalOvers) {
        newState.firstInningsScore = newState.score;
        newState.isInningsTransition = true;
        newState.isInningsEndPopupVisible = true;
        newState.gameMessage = `First innings complete: ${newState.battingTeam} ${newState.score}/${newState.totalWickets - newState.wicket} in ${newState.totalOvers}.`;
        newState.isGameOver = true;
        return;
      }
      newState.gameMessage = "";
      newState.isGameOver = false;
    } else {
      // Second innings - Check if winning team has reached or exceeded required runs
      const requiredRuns = newState.firstInningsScore + 1;
      
      // If second team reaches required runs, they win immediately
      if (newState.score >= requiredRuns) {
        const runMargin = newState.score - newState.firstInningsScore;
        const wicketsLeft = newState.wicket;
        newState.resultMessage = `🏆 ${newState.battingTeam} Wins!`;
        newState.resultDetails = `${newState.battingTeam} won by ${runMargin} run${runMargin !== 1 ? 's' : ''} with ${wicketsLeft} wicket${wicketsLeft !== 1 ? 's' : ''} remaining`;
        newState.isResultPopupVisible = true;
        newState.isGameOver = true;
        return;
      }

      // Check for other end conditions
      if (newState.wicket <= 0) {
        const fieldingTeam = newState.battingTeam === newState.team1 ? newState.team2 : newState.team1;
        const runMargin = newState.firstInningsScore - newState.score;
        newState.resultMessage = `🏆 ${fieldingTeam} Wins!`;
        newState.resultDetails = `${fieldingTeam} won by ${runMargin} run${runMargin !== 1 ? 's' : ''} (${newState.battingTeam} all out)`;
        newState.isResultPopupVisible = true;
        newState.isGameOver = true;
        return;
      }

      if (newState.over >= newState.totalOvers) {
        if (newState.score > newState.firstInningsScore) {
          const runMargin = newState.score - newState.firstInningsScore;
          newState.resultMessage = `🏆 ${newState.battingTeam} Wins!`;
          newState.resultDetails = `${newState.battingTeam} won by ${runMargin} run${runMargin !== 1 ? 's' : ''} with ${newState.wicket} wicket${newState.wicket !== 1 ? 's' : ''} left`;
        } else {
          const fieldingTeam = newState.battingTeam === newState.team1 ? newState.team2 : newState.team1;
          const runMargin = newState.firstInningsScore - newState.score;
          newState.resultMessage = `🏆 ${fieldingTeam} Wins!`;
          newState.resultDetails = `${fieldingTeam} won by ${runMargin} run${runMargin !== 1 ? 's' : ''}`;
        }
        newState.isResultPopupVisible = true;
        newState.isGameOver = true;
        return;
      }

      newState.gameMessage = "";
      newState.isGameOver = false;
    }
  };

  const handleScoreUpdate = (input) => {
    setGameState(prev => {
      if (prev.isInningsTransition || prev.isGameOver || prev.over >= prev.totalOvers || prev.wicket <= 0) {
        return prev;
      }

      let type = 'normal';
      let runs = 0;
      if (typeof input === 'number') {
        runs = input;
      } else {
        type = input.type;
        runs = input.runs;
      }

      let ballsToAdd = 1;
      let totalRuns = runs;
      let batsmanRuns = runs;
      let extrasAdded = 0;
      let deliveryType = 'legal';
      let source = 'bat';
      let legal = true;

      switch (type) {
        case 'wide':
          totalRuns = 1 + runs;
          batsmanRuns = 0;
          extrasAdded = totalRuns;
          ballsToAdd = 0;
          deliveryType = 'wide';
          source = 'extras';
          legal = false;
          break;
        case 'noball':
          totalRuns = 1 + runs;
          extrasAdded = 1;
          ballsToAdd = 0;
          deliveryType = 'noball';
          source = runs > 0 ? 'bat' : 'extras';
          batsmanRuns = runs > 0 ? runs : 0;
          legal = false;
          break;
        case 'bye':
          totalRuns = runs;
          batsmanRuns = 0;
          extrasAdded = runs;
          deliveryType = 'legal';
          source = 'extras';
          break;
        case 'legbye':
          totalRuns = runs;
          batsmanRuns = 0;
          extrasAdded = runs;
          deliveryType = 'legal';
          source = 'extras';
          break;
        case 'normal':
        default:
          totalRuns = runs;
          batsmanRuns = runs;
          extrasAdded = 0;
          source = 'bat';
          break;
      }

      const { overs: newOvers, balls: newBalls } = calculateOversAndBalls(prev.balls, prev.over, ballsToAdd);
      const isPowerplay = newOvers < GAME_CONSTANTS.POWERPLAY_OVERS;

      // Track statistics
      let newBoundaries = prev.boundaries;
      let newSixers = prev.sixers;
      let newDotBalls = prev.dotBalls;
      let newExtras = { ...prev.extras };

      if (batsmanRuns === 4) newBoundaries += 1;
      if (batsmanRuns === 6) newSixers += 1;
      if (totalRuns === 0) newDotBalls += 1;

      // Update extras
      if (type === 'wide') newExtras.wides += extrasAdded;
      else if (type === 'noball') newExtras.noBalls += extrasAdded;
      else if (type === 'bye') newExtras.byes += extrasAdded;
      else if (type === 'legbye') newExtras.legByes += extrasAdded;

      const newState = {
        ...prev,
        history: saveToHistory(prev),
        score: prev.score + totalRuns,
        balls: newBalls,
        over: newOvers,
        boundaries: newBoundaries,
        sixers: newSixers,
        dotBalls: newDotBalls,
        batsmanRuns: prev.batsmanRuns + batsmanRuns,
        lastDeliveryType: deliveryType,
        extras: newExtras,
        isPowerplay,
        ballByBall: [
          ...prev.ballByBall,
          {
            over: `${newOvers}.${newBalls}`,
            runs: totalRuns,
            type: totalRuns === 0 ? "dot" : batsmanRuns === 4 ? "boundary" : batsmanRuns === 6 ? "sixer" : "run",
            source,
            legal,
            batsman: prev.currentBatsman,
            bowler: prev.currentBowler,
            deliveryType,
          },
        ],
      };

      updateGameEnd(newState);
      return newState;
    });
  };

  const handleWicket = (type = "runout") => {
    setGameState(prev => {
      if (prev.isInningsTransition || prev.isGameOver || prev.over >= prev.totalOvers || prev.wicket <= 0) {
        return prev;
      }

      const invalidOnWide = ["bowled", "lbw", "hitwicket", "caught", "stumped"];
      const invalidOnNoBall = ["bowled", "lbw", "caught", "stumped"];

      if (prev.lastDeliveryType === "wide" && invalidOnWide.includes(type.toLowerCase())) {
        return {
          ...prev,
          gameMessage: "Invalid dismissal on wide. Only run out/obstructing can apply.",
        };
      }

      if (prev.lastDeliveryType === "noball" && invalidOnNoBall.includes(type.toLowerCase())) {
        return {
          ...prev,
          gameMessage: "Invalid dismissal on no ball. Only run out/hit wicket/obstructing can apply.",
        };
      }

      const { overs: newOvers, balls: newBalls } = calculateOversAndBalls(prev.balls, prev.over, 1);
      const newFallOfWickets = [
        ...prev.fallOfWickets,
        {
          over: `${newOvers}.${newBalls}`,
          batsman: prev.currentBatsman,
          bowler: prev.currentBowler,
          runs: prev.score,
          wicketNumber: prev.totalWickets - prev.wicket + 1,
          dismissal: type,
          deliveryType: prev.lastDeliveryType || "legal",
        },
      ];

      const newState = {
        ...prev,
        history: saveToHistory(prev),
        wicket: Math.max(0, prev.wicket - 1),
        balls: newBalls,
        over: newOvers,
        fallOfWickets: newFallOfWickets,
        ballByBall: [
          ...prev.ballByBall,
          {
            over: `${newOvers}.${newBalls}`,
            runs: 0,
            type: "wicket",
            dismissal: type,
            deliveryType: prev.lastDeliveryType || "legal",
            batsman: prev.currentBatsman,
            bowler: prev.currentBowler,
            legal: true,
          },
        ],
        gameMessage: `WICKET (${type.toUpperCase()})! ${prev.currentBatsman} dismissed!`
      };

      updateGameEnd(newState);
      return newState;
    });
  };

  const handleUndo = () => {
    setGameState(prev => {
      if (!prev.history || prev.history.length === 0) {
        return prev;
      }
      const previousState = prev.history[prev.history.length - 1];
      const remainingHistory = prev.history.slice(0, -1);
      return {
        ...previousState,
        history: remainingHistory,
      };
    });
  };

  const resetGame = () => {
    setGameState({
      score: 0,
      over: 0,
      wicket: GAME_CONSTANTS.DEFAULT_WICKETS,
      balls: 0,
      team1: "",
      team2: "",
      totalOvers: GAME_CONSTANTS.DEFAULT_OVERS,
      totalWickets: GAME_CONSTANTS.DEFAULT_WICKETS,
      isStartGameVisible: true,
      history: [],
      battingTeam: "",
      inning: 1,
      firstInningsScore: null,
      isInningsTransition: false,
      isInningsEndPopupVisible: false,
      isResultPopupVisible: false,
      resultMessage: "",
      resultDetails: "",
      gameMessage: "",
      isGameOver: false,
      batsmanRuns: 0,
      lastDeliveryType: null,
      extras: {
        wides: 0,
        noBalls: 0,
        byes: 0,
        legByes: 0,
      },

      isTossScreen: false,
      tossWinner: "",
      tossDecision: "",

      currentBatsman: "Batsman 1",
      nonStriker: "Batsman 2",
      currentBowler: "Bowler 1",

      boundaries: 0,
      sixers: 0,
      wides: 0,
      noBalls: 0,
      byes: 0,
      legByes: 0,
      dotBalls: 0,

      isPowerplay: true,

      fallOfWickets: [],
      ballByBall: [],

      requiredRunRate: 0,
      currentRunRate: 0,
    });
  };

  const startSecondInnings = () => {
    setGameState(prev => {
      const requiredRuns = prev.firstInningsScore + 1;
      const requiredRunRate = (requiredRuns / prev.totalOvers).toFixed(2);

      return {
        ...prev,
        inning: 2,
        score: 0,
        over: 0,
        balls: 0,
        wicket: prev.totalWickets,
        isGameOver: false,
        isInningsTransition: false,
        isInningsEndPopupVisible: false,
        gameMessage: `Second innings start: ${prev.battingTeam === prev.team1 ? prev.team2 : prev.team1} needs ${requiredRuns} runs`,
        battingTeam: prev.battingTeam === prev.team1 ? prev.team2 : prev.team1,
        history: [],
        boundaries: 0,
        sixers: 0,
        wides: 0,
        noBalls: 0,
        byes: 0,
        legByes: 0,
        dotBalls: 0,
        batsmanRuns: 0,
        lastDeliveryType: null,
        extras: {
          wides: 0,
          noBalls: 0,
          byes: 0,
          legByes: 0,
        },
        isPowerplay: true,
        fallOfWickets: [],
        ballByBall: [],
        requiredRunRate,
        currentRunRate: 0,
        currentBatsman: "Batsman 1",
        nonStriker: "Batsman 2",
        currentBowler: "Bowler 1",
      };
    });
  };

  // 🔹 Advanced AI Match Analysis Functions
  const getCurrentBattingTeam = () => {
    return gameState.battingTeam || gameState.team1;
  };

  const analyzeTeamPerformance = () => {
    const runRate = gameState.over > 0 ? (gameState.score / gameState.over) : 0;
    const wicketsLeft = gameState.wicket;
    const oversLeft = gameState.totalOvers - gameState.over;

    let performance = "Good";
    let score = 75;

    // First innings analysis
    if (gameState.inning === 1) {
      if (runRate >= 6.0) performance = "Excellent";
      else if (runRate >= 5.0) performance = "Very Good";
      else if (runRate >= 4.0) performance = "Good";
      else if (runRate >= 3.0) performance = "Average";
      else performance = "Poor";

      score = Math.min(100, (runRate / 6.0) * 60 + (wicketsLeft / gameState.totalWickets) * 40);
    }
    // Second innings analysis
    else if (gameState.inning === 2 && gameState.firstInningsScore) {
      const target = gameState.firstInningsScore + 1;
      const requiredRate = oversLeft > 0 ? (target - gameState.score) / oversLeft : 0;
      const progress = gameState.score / target;

      if (progress >= 0.8 && wicketsLeft >= 3) performance = "Excellent";
      else if (progress >= 0.6 && wicketsLeft >= 2) performance = "Very Good";
      else if (progress >= 0.4) performance = "Good";
      else if (progress >= 0.2) performance = "Challenging";
      else performance = "Critical";

      score = Math.min(100, Math.max(0, (progress * 50) + (wicketsLeft / gameState.totalWickets) * 30 + (runRate >= requiredRate ? 20 : 0)));
    }

    return { performance, score: Math.round(score) };
  };

  const analyzeMatchSituation = () => {
    if (gameState.inning === 1) {
      const runRate = gameState.over > 0 ? (gameState.score / gameState.over) : 0;
      const wicketsLeft = gameState.wicket;
      const oversPlayed = gameState.over;

      if (oversPlayed < 6) return "Building Momentum";
      if (runRate >= 6.0 && wicketsLeft >= 7) return "Dominating";
      if (runRate >= 5.0 && wicketsLeft >= 5) return "Strong Position";
      if (runRate >= 4.0) return "Steady Progress";
      if (wicketsLeft <= 3) return "Under Pressure";
      return "Balanced";
    } else {
      const target = gameState.firstInningsScore + 1;
      const remainingOvers = gameState.totalOvers - gameState.over;
      const requiredRate = remainingOvers > 0 ? (target - gameState.score) / remainingOvers : 0;
      const currentRate = gameState.over > 0 ? (gameState.score / gameState.over) : 0;
      const wicketsLeft = gameState.wicket;

      if (remainingOvers <= 0) {
        return gameState.score >= target ? "🎉 Target Achieved!" : "❌ Target Missed";
      }

      if (gameState.score >= target) return "🎯 Target Reached Early";
      if (requiredRate <= currentRate + 0.5 && wicketsLeft >= 4) return "🟢 Comfortable Chase";
      if (requiredRate <= currentRate + 1.0 && wicketsLeft >= 2) return "🟡 Manageable";
      if (requiredRate <= currentRate + 2.0) return "🟠 Challenging";
      return "🔴 Critical Situation";
    }
  };

  const calculateWinProbability = () => {
    if (gameState.inning === 1) {
      // First innings - neutral probability
      return 50;
    }

    const target = gameState.firstInningsScore + 1;
    const progress = Math.min(1, gameState.score / target);
    const wicketsFactor = gameState.wicket / gameState.totalWickets;
    const oversFactor = gameState.over / gameState.totalOvers;
    const runRateFactor = gameState.over > 0 ? Math.min(1, (gameState.score / gameState.over) / 6.0) : 0;

    let probability = (progress * 0.4) + (wicketsFactor * 0.3) + (runRateFactor * 0.2) + ((1 - oversFactor) * 0.1);

    return Math.min(100, Math.max(0, Math.round(probability * 100)));
  };

  const getRunRateAnalysis = () => {
    const currentRR = gameState.over > 0 ? (gameState.score / gameState.over) : 0;

    if (gameState.inning === 1) {
      if (currentRR >= 6.0) return { rate: currentRR.toFixed(2), status: "Excellent", color: "text-green-400" };
      if (currentRR >= 5.0) return { rate: currentRR.toFixed(2), status: "Very Good", color: "text-green-300" };
      if (currentRR >= 4.0) return { rate: currentRR.toFixed(2), status: "Good", color: "text-yellow-300" };
      if (currentRR >= 3.0) return { rate: currentRR.toFixed(2), status: "Average", color: "text-orange-300" };
      return { rate: currentRR.toFixed(2), status: "Slow", color: "text-red-300" };
    } else {
      const target = gameState.firstInningsScore + 1;
      const remainingOvers = gameState.totalOvers - gameState.over;
      const requiredRR = remainingOvers > 0 ? (target - gameState.score) / remainingOvers : 0;

      const rrAnalysis = { rate: currentRR.toFixed(2), status: "Current", color: "text-blue-300" };
      const reqAnalysis = { rate: requiredRR.toFixed(2), status: "Required", color: "text-red-300" };

      return { current: rrAnalysis, required: reqAnalysis };
    }
  };

  const getStrategicAdvice = () => {
    if (gameState.inning === 1) {
      const wicketsLeft = gameState.wicket;
      const oversLeft = gameState.totalOvers - gameState.over;

      if (oversLeft > 10 && wicketsLeft >= 7) {
        return "Focus on building partnerships and accelerating in the middle overs";
      } else if (wicketsLeft <= 3) {
        return "Conserve wickets and look for quick runs";
      } else {
        return "Maintain steady scoring while preserving wickets";
      }
    } else {
      const target = gameState.firstInningsScore + 1;
      const remainingOvers = gameState.totalOvers - gameState.over;
      const requiredRate = remainingOvers > 0 ? (target - gameState.score) / remainingOvers : 0;
      const currentRate = gameState.over > 0 ? (gameState.score / gameState.over) : 0;
      const wicketsLeft = gameState.wicket;

      if (remainingOvers <= 2) {
        return wicketsLeft >= 2 ? "Go for boundaries, every ball counts!" : "Stay calm and focus on singles";
      } else if (requiredRate > currentRate + 2) {
        return "Need to accelerate, take calculated risks";
      } else if (wicketsLeft <= 2) {
        return "Preserve remaining wickets, focus on rotation";
      } else {
        return "Keep the scoreboard moving steadily";
      }
    }
  };

  const isControlsDisabled = gameState.isGameOver || gameState.isStartGameVisible || gameState.isInningsTransition;

  return (
    <>
      <div
        className="flex justify-center items-center min-h-screen overflow-hidden text-white bg-gradient-to-br from-green-800 via-green-600 to-green-900 relative"
        style={{
          backgroundImage: `
            linear-gradient(180deg, rgba(20,83,11,0.9) 0%, rgba(34,197,94,0.7) 50%, rgba(20,83,11,0.9) 100%),
            repeating-linear-gradient(90deg, transparent, transparent 100px, rgba(255,255,255,0.03) 100px, rgba(255,255,255,0.03) 101px),
            repeating-linear-gradient(0deg, transparent, transparent 100px, rgba(255,255,255,0.03) 100px, rgba(255,255,255,0.03) 101px)
          `,
          backgroundSize: "cover, 400% 400%, 400% 400%",
          backgroundPosition: "center",
          animation: "gradient 15s ease infinite",
        }}
      >
        {/* Cricket Field Pattern SVG Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
            <circle cx="500" cy="500" r="300" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
            <circle cx="500" cy="500" r="200" fill="none" stroke="white" strokeWidth="2" opacity="0.2" />
            <circle cx="500" cy="500" r="100" fill="none" stroke="white" strokeWidth="2" opacity="0.1" />
            <line x1="500" y1="200" x2="500" y2="800" stroke="white" strokeWidth="1" opacity="0.1" />
            <line x1="200" y1="500" x2="800" y2="500" stroke="white" strokeWidth="1" opacity="0.1" />
          </svg>
        </div>

        <div className="flex flex-col h-screen w-full max-w-6xl gap-8 p-4 relative z-10">
          {/* Scoreboard */}
          <div className="flex-shrink-0 lg:w-full w-full">
            <div className="lg:w-[70%] mx-auto pt-6 flex flex-col bg-gradient-to-br from-black/80 to-black/60 rounded-3xl ss-font justify-between backdrop-blur-md border-2 border-yellow-400/30 shadow-2xl">
              <div className="flex justify-center items-end lg:text-9xl text-7xl lg:p-8 ss-font drop-shadow-[0_0_10px_#FFD700]">
                {gameState.score}-{gameState.totalWickets - gameState.wicket}
              </div>
              <div className="flex justify-center text-2xl mb-4 font-bold text-yellow-300">
                {gameState.battingTeam === gameState.team1 ? `🏏 ${gameState.team1}` : `🏏 ${gameState.team2}`} vs {gameState.battingTeam === gameState.team1 ? gameState.team2 : gameState.team1}
              </div>
              {gameState.gameMessage && (
                <div className="flex justify-center text-lg text-yellow-200 mb-3 font-semibold px-4">
                  {gameState.gameMessage}
                </div>
              )}
              <div className="flex lg:flex-row flex-col justify-around p-6 text-xl px-8 drop-shadow-[0_0_10px_#FFD700] gap-4 border-t border-yellow-400/20">
                <div className="text-center">
                  <div className="text-gray-400 text-sm">OVERS</div>
                  <div className="text-2xl font-bold text-yellow-300">{gameState.over}.{gameState.balls} / {gameState.totalOvers}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 text-sm">WICKETS</div>
                  <div className="text-2xl font-bold text-red-400">{gameState.wicket} / {gameState.totalWickets}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced AI Match Analysis Section */}
          <div className="flex-shrink-0 lg:w-[70%] mx-auto">
            <div className="bg-gradient-to-br from-purple-900/80 to-purple-800/60 rounded-3xl backdrop-blur-md border-2 border-purple-400/30 shadow-2xl p-6">
              <h3 className="text-xl font-bold text-purple-300 mb-4 text-center uppercase tracking-wider">🤖 AI Match Analysis</h3>

              {/* Team Status Header */}
              <div className="mb-4 text-center">
                <div className="text-purple-200 text-sm mb-1">
                  {gameState.inning === 1 ? "First Innings" : "Second Innings"} - {getCurrentBattingTeam()} Batting
                </div>
                <div className="text-purple-300 text-lg font-bold">
                  {analyzeMatchSituation()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Team Performance */}
                <div className="bg-purple-800/50 rounded-lg p-4 border border-purple-400/20">
                  <div className="text-purple-200 text-sm mb-1">Team Performance</div>
                  <div className="text-2xl font-bold text-white">{analyzeTeamPerformance().performance}</div>
                  <div className="text-sm text-purple-300">{analyzeTeamPerformance().score}% Rating</div>
                </div>

                {/* Win Probability */}
                <div className="bg-purple-800/50 rounded-lg p-4 border border-purple-400/20">
                  <div className="text-purple-200 text-sm mb-1">
                    {gameState.inning === 1 ? "Projected Score" : "Win Probability"}
                  </div>
                  <div className="text-3xl font-bold text-green-400">
                    {gameState.inning === 1 ? `${Math.round(gameState.score * (gameState.totalOvers / Math.max(gameState.over, 1)))}*` : `${calculateWinProbability()}%`}
                  </div>
                </div>

                {/* Run Rate Analysis */}
                {gameState.inning === 1 ? (
                  <div className="bg-purple-800/50 rounded-lg p-4 border border-purple-400/20">
                    <div className="text-purple-200 text-sm mb-1">Current Run Rate</div>
                    <div className={`text-2xl font-bold ${getRunRateAnalysis().color}`}>
                      {getRunRateAnalysis().rate}
                    </div>
                    <div className="text-sm text-purple-300">{getRunRateAnalysis().status}</div>
                  </div>
                ) : (
                  <div className="bg-purple-800/50 rounded-lg p-4 border border-purple-400/20">
                    <div className="text-purple-200 text-sm mb-1">Run Rates</div>
                    <div className="text-sm text-purple-200">
                      Current: <span className="text-yellow-300 font-bold">{getRunRateAnalysis().current.rate}</span>
                    </div>
                    <div className="text-sm text-purple-200">
                      Required: <span className="text-red-300 font-bold">{getRunRateAnalysis().required.rate}</span>
                    </div>
                  </div>
                )}

                {/* Key Stats */}
                <div className="bg-purple-800/50 rounded-lg p-4 border border-purple-400/20">
                  <div className="text-purple-200 text-sm mb-1">Key Metrics</div>
                  <div className="text-sm text-purple-200">
                    Wickets Left: <span className="text-red-300 font-bold">{gameState.wicket}</span>
                  </div>
                  <div className="text-sm text-purple-200">
                    Overs Left: <span className="text-blue-300 font-bold">{gameState.totalOvers - gameState.over}.{6 - gameState.balls}</span>
                  </div>
                </div>
              </div>

              {/* Strategic Advice */}
              <div className="bg-purple-800/30 rounded-lg p-4 border border-purple-400/10">
                <div className="text-purple-200 text-sm mb-2">💡 Strategic Advice</div>
                <div className="text-purple-100 text-sm font-medium">
                  {getStrategicAdvice()}
                </div>
              </div>

              {/* Second Innings Specific Info */}
              {gameState.inning === 2 && gameState.firstInningsScore && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-800/30 rounded-lg p-4 border border-purple-400/10">
                    <div className="text-purple-200 text-sm mb-1">Target Information</div>
                    <div className="text-sm text-purple-200">
                      Target: <span className="text-yellow-300 font-bold text-lg">{gameState.firstInningsScore + 1}</span>
                    </div>
                    <div className="text-sm text-purple-200">
                      Runs Needed: <span className="text-red-300 font-bold text-lg">{Math.max(0, gameState.firstInningsScore + 1 - gameState.score)}</span>
                    </div>
                  </div>
                  <div className="bg-purple-800/30 rounded-lg p-4 border border-purple-400/10">
                    <div className="text-purple-200 text-sm mb-1">Match Progress</div>
                    <div className="text-sm text-purple-200">
                      Progress: <span className="text-blue-300 font-bold">{((gameState.score / (gameState.firstInningsScore + 1)) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="text-sm text-purple-200">
                      Phase: <span className="text-green-300 font-bold">
                        {gameState.over <= 6 ? "Powerplay" : gameState.over <= 15 ? "Middle Overs" : "Death Overs"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Button Grid - Organized by Category */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-6">
              {/* Runs Section */}
              <div className="bg-black/50 backdrop-blur-md rounded-2xl p-6 border border-blue-400/30">
                <h3 className="text-lg font-bold text-blue-300 mb-4 uppercase tracking-wider">Scoring Shots</h3>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-2 lg:gap-3">
                  <Button
                    label="Dot"
                    onClick={() => handleScoreUpdate(0)}
                    disabled={isControlsDisabled}
                    variant="dot"
                  />
                  <Button
                    label="1"
                    onClick={() => handleScoreUpdate(1)}
                    disabled={isControlsDisabled}
                    variant="runs"
                  />
                  <Button
                    label="2"
                    onClick={() => handleScoreUpdate(2)}
                    disabled={isControlsDisabled}
                    variant="runs"
                  />
                  <Button
                    label="3"
                    onClick={() => handleScoreUpdate(3)}
                    disabled={isControlsDisabled}
                    variant="runs"
                  />
                  <Button
                    label="4"
                    onClick={() => handleScoreUpdate(4)}
                    disabled={isControlsDisabled}
                    variant="boundary"
                  />
                  <Button
                    label="5"
                    onClick={() => handleScoreUpdate(5)}
                    disabled={isControlsDisabled}
                    variant="runs"
                  />
                  <Button
                    label="6⭐"
                    onClick={() => handleScoreUpdate(6)}
                    disabled={isControlsDisabled}
                    variant="sixer"
                  />
                </div>
              </div>

              {/* Extras Section - Heading Only */}
              <button
                onClick={() => setGameState(prev => ({ ...prev, isExtrasPopupVisible: true }))}
                className="w-full bg-black/50 backdrop-blur-md rounded-2xl p-6 border border-purple-400/30 hover:border-purple-400/60 hover:bg-black/60 transition-all"
              >
                <h3 className="text-lg font-bold text-purple-300 uppercase tracking-wider">⚪ Other Runs & Extras</h3>
              </button>

              {/* Wickets & Controls Section */}
              <div className="bg-black/50 backdrop-blur-md rounded-2xl p-6 border border-red-400/30">
                <h3 className="text-lg font-bold text-red-300 mb-4 uppercase tracking-wider">Match Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    label="🔴 Wicket"
                    onClick={handleWicket}
                    disabled={isControlsDisabled}
                    variant="wicket"
                  />
                  <Button
                    label="↩️ Undo"
                    onClick={handleUndo}
                    disabled={gameState.history.length === 0}
                    variant="undo"
                  />
                  <button
                    onClick={resetGame}
                    className="col-span-1 md:col-span-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:from-gray-500 disabled:to-gray-500 px-4 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed"
                  >
                    🔄 New Match
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      {gameState.isStartGameVisible && (
        <StartGamePopup
          setTeam1={(value) => setGameState(prev => ({ ...prev, team1: value }))}
          setTeam2={(value) => setGameState(prev => ({ ...prev, team2: value }))}
          setTotalOvers={(value) => setGameState(prev => ({ ...prev, totalOvers: value }))}
          setTotalWickets={(value) => setGameState(prev => ({ ...prev, totalWickets: value }))}
          setStartGameVisible={(value) => setGameState(prev => ({ ...prev, isStartGameVisible: value }))}
          setWicket={(value) => setGameState(prev => ({ ...prev, wicket: value }))}
          setScore={(value) => setGameState(prev => ({ ...prev, score: value }))}
          setOver={(value) => setGameState(prev => ({ ...prev, over: value }))}
          setBalls={(value) => setGameState(prev => ({ ...prev, balls: value }))}
          setBattingTeam={(value) => setGameState(prev => ({ ...prev, battingTeam: value }))}
        />
      )}

      {gameState.isInningsEndPopupVisible && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-40">
          <div className="bg-gradient-to-br from-slate-900 to-black text-white p-8 rounded-2xl shadow-2xl w-[90%] max-w-lg border-2 border-yellow-400/30">
            <h3 className="text-3xl font-bold mb-4 text-center text-yellow-300">🏁 First Innings Complete</h3>
            <div className="space-y-3 mb-6">
              <p className="text-lg text-center text-gray-300">
                <span className="font-bold text-cyan-300">{gameState.battingTeam}</span> scored
              </p>
              <p className="text-4xl font-bold text-center text-yellow-400 ss-font">
                {gameState.firstInningsScore}/{gameState.totalWickets - gameState.wicket}
              </p>
              <p className="text-center text-gray-400">
                in {gameState.totalOvers} overs
              </p>
            </div>
            <p className="text-center text-cyan-300 mb-6 font-semibold">
              ➜ Next: {gameState.battingTeam === gameState.team1 ? gameState.team2 : gameState.team1} batting
            </p>
            <button
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg active:scale-95"
              onClick={startSecondInnings}
            >
              ⚽ Start Second Innings
            </button>
          </div>
        </div>
      )}

      {gameState.isResultPopupVisible && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-40">
          <div className="bg-gradient-to-br from-slate-900 to-black text-white p-8 rounded-2xl shadow-2xl w-[90%] max-w-lg border-2 border-yellow-400/30">
            <div className="text-center space-y-6">
              <h3 className="text-4xl font-bold text-yellow-300">🏆</h3>
              <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                {gameState.resultMessage}
              </h3>
              <p className="text-lg text-gray-300 font-semibold">
                {gameState.resultDetails}
              </p>
              <div className="bg-slate-800/50 rounded-lg p-6 border border-yellow-400/20">
                <p className="text-5xl font-bold text-yellow-300 ss-font">
                  {gameState.score}/{gameState.totalWickets - gameState.wicket}
                </p>
              </div>
            </div>
            <button
              className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg active:scale-95"
              onClick={resetGame}
            >
              🔄 New Match
            </button>
          </div>
        </div>
      )}

      {gameState.isExtrasPopupVisible && (
        <Popup
          setPopupVisible={(value) => setGameState(prev => ({ ...prev, isExtrasPopupVisible: value }))}
          onScoreUpdate={handleScoreUpdate}
        />
      )}

    </>
  );
}

export default App;
