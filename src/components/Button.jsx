import React from "react";

/**
 * Button Component with multiple variants
 * @param {string} label - Button label text
 * @param {Function} onClick - Click handler function
 * @param {boolean} disabled - Whether button is disabled
 * @param {string} variant - Button style variant (default, dot, runs, boundary, sixer, extra, wicket, undo)
 */
function Button({
  label,
  onClick,
  disabled = false,
  variant = "default",
  run,
  type,
  onScoreUpdate,
}) {
  const handleClick = () => {
    if (disabled) return;
    if (onScoreUpdate) {
      if (type !== undefined && run !== undefined) {
        onScoreUpdate({ type, runs: run });
      } else if (run !== undefined) {
        onScoreUpdate(run);
      }
    }
    onClick?.();
  };

  const variantStyles = {
    default: "bg-gradient-to-br from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 active:scale-95",
    dot: "bg-gradient-to-br from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700",
    runs: "bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 transform hover:scale-105",
    boundary: "bg-gradient-to-br from-cyan-500 to-cyan-700 hover:from-cyan-400 hover:to-cyan-600 transform hover:scale-105 shadow-lg shadow-cyan-500/50",
    sixer: "bg-gradient-to-br from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 transform hover:scale-110 shadow-lg shadow-yellow-500/50 font-bold",
    extra: "bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-400 hover:to-purple-600",
    wicket: "bg-gradient-to-br from-red-600 to-red-800 hover:from-red-500 hover:to-red-700",
    undo: "bg-gradient-to-br from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600",
  };

  const selectedStyle = variantStyles[variant] || variantStyles.default;

  return (
    <button
      type="button"
      disabled={disabled}
      className={`
        flex justify-center items-center p-2 rounded-xl transition-all duration-150 ease-in-out
        shadow-lg font-semibold text-white text-sm lg:text-base
        ${selectedStyle}
        ${disabled ? "bg-gray-500 cursor-not-allowed opacity-60" : "cursor-pointer"}
      `}
      onClick={handleClick}
      aria-label={label}
    >
      {label}
    </button>
  );
}

export default Button;
