import { GAME_CONSTANTS } from "../constants";

/**
 * Determines the winner based on scores
 * @param {number} battingTeamScore - Score of batting team
 * @param {number} opponentScore - Score of opponent team
 * @returns {string} - 'win', 'tie', or 'loss'
 */
export const determineWinner = (battingTeamScore, opponentScore) => {
  if (battingTeamScore > opponentScore) {
    return "win";
  } else if (battingTeamScore === opponentScore) {
    return "tie";
  } else {
    return "loss";
  }
};

/**
 * Formats score display
 * @param {number} runs - Runs scored
 * @param {number} wickets - Wickets lost
 * @returns {string} - Formatted score like "45/3"
 */
export const formatScore = (runs, wickets) => {
  return `${runs}/${wickets}`;
};

/**
 * Formats overs display
 * @param {number} overs - Complete overs
 * @param {number} balls - Remaining balls (0-5)
 * @returns {string} - Formatted overs like "5.3"
 */
export const formatOvers = (overs, balls) => {
  return `${overs}.${balls}`;
};

/**
 * Validates team input
 * @param {string} team1 - Team 1 name
 * @param {string} team2 - Team 2 name
 * @returns {object} - Validation result {isValid: boolean, error?: string}
 */
export const validateTeamNames = (team1, team2) => {
  if (!team1.trim() || !team2.trim()) {
    return { isValid: false, error: "Both team names are required." };
  }
  if (team1.trim() === team2.trim()) {
    return { isValid: false, error: "Team names must be different." };
  }
  return { isValid: true };
};

/**
 * Validates overs input
 * @param {number} overs - Number of overs
 * @returns {object} - Validation result {isValid: boolean, error?: string}
 */
export const validateOvers = (overs) => {
  if (overs < GAME_CONSTANTS.MIN_OVERS || overs > GAME_CONSTANTS.MAX_OVERS) {
    return {
      isValid: false,
      error: `Overs must be between ${GAME_CONSTANTS.MIN_OVERS} and ${GAME_CONSTANTS.MAX_OVERS}.`,
    };
  }
  return { isValid: true };
};

/**
 * Validates wickets input
 * @param {number} wickets - Number of wickets
 * @returns {object} - Validation result {isValid: boolean, error?: string}
 */
export const validateWickets = (wickets) => {
  if (wickets < GAME_CONSTANTS.MIN_WICKETS || wickets > GAME_CONSTANTS.MAX_WICKETS) {
    return {
      isValid: false,
      error: `Wickets must be between ${GAME_CONSTANTS.MIN_WICKETS} and ${GAME_CONSTANTS.MAX_WICKETS}.`,
    };
  }
  return { isValid: true };
};
