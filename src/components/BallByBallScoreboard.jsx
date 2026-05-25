import React from "react";

function BallByBallScoreboard({ ballByBall, fallOfWickets }) {
  if (!ballByBall || ballByBall.length === 0) {
    return (
      <div className="bg-slate-900 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-bold text-cyan-400 mb-4 uppercase tracking-wider">📊 Ball-by-Ball</h3>
        <div className="text-center text-slate-400 text-sm py-4">No deliveries yet</div>
      </div>
    );
  }

  // Get the last 10 deliveries (most recent first)
  const recentBalls = [...ballByBall].reverse().slice(0, 10).reverse();

  const getDeliveryIcon = (ball) => {
    if (ball.type === "wicket") return "🔴";
    if (ball.type === "dot") return "⚫";
    if (ball.type === "boundary") return "4️⃣";
    if (ball.type === "sixer") return "6️⃣";
    if (ball.type === "run") return `${ball.runs}️⃣`;
    if (ball.deliveryType === "wide") return "W";
    if (ball.deliveryType === "noball") return "NB";
    return "•";
  };

  const getDeliveryColor = (ball) => {
    if (ball.type === "wicket") return "bg-red-600/20 border-red-500/50 text-red-300";
    if (ball.type === "dot") return "bg-slate-700/50 border-slate-600 text-slate-200";
    if (ball.type === "boundary") return "bg-cyan-600/20 border-cyan-500/50 text-cyan-300";
    if (ball.type === "sixer") return "bg-yellow-600/20 border-yellow-500/50 text-yellow-300";
    if (ball.deliveryType === "wide" || ball.deliveryType === "noball") return "bg-purple-600/20 border-purple-500/50 text-purple-300";
    return "bg-emerald-600/20 border-emerald-500/50 text-emerald-300";
  };

  return (
    <div className="bg-slate-900 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <h3 className="text-lg font-bold text-cyan-400 mb-4 uppercase tracking-wider">📊 Ball-by-Ball</h3>

      {/* Recent Deliveries Grid */}
      <div className="grid grid-cols-6 md:grid-cols-8 gap-2 mb-6">
        {recentBalls.map((ball, idx) => (
          <div
            key={idx}
            className={`aspect-square flex items-center justify-center rounded-lg border font-bold text-sm transition-all hover:scale-110 ${getDeliveryColor(
              ball
            )}`}
            title={`${ball.over} - ${ball.batsman} (${ball.bowler})`}
          >
            {getDeliveryIcon(ball)}
          </div>
        ))}
      </div>

      {/* Detailed View of Last 3 Deliveries */}
      <div className="space-y-2 border-t border-slate-700/50 pt-4 mt-4">
        <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-3">Recent Deliveries</div>
        {ballByBall.slice(-3).reverse().map((ball, idx) => (
          <div
            key={idx}
            className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/40 flex justify-between items-start text-sm"
          >
            <div className="flex-1">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                {ball.over} - {ball.batsman} vs {ball.bowler}
              </div>
              {ball.type === "wicket" ? (
                <div className="text-red-300 font-semibold">🔴 WICKET - {ball.dismissal}</div>
              ) : (
                <div className="text-slate-200">
                  {ball.type === "dot" && "Dot ball"}
                  {ball.type === "boundary" && "Boundary 4"}
                  {ball.type === "sixer" && "Sixer 6"}
                  {ball.type === "run" && `${ball.runs} run${ball.runs > 1 ? "s" : ""}`}
                  {ball.deliveryType === "wide" && `Wide + ${ball.runs} runs`}
                  {ball.deliveryType === "noball" && `No Ball + ${ball.runs} runs`}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Runs</div>
              <div className="text-lg font-bold text-yellow-400">{ball.runs}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Fall of Wickets */}
      {fallOfWickets && fallOfWickets.length > 0 && (
        <div className="border-t border-slate-700/50 pt-4 mt-4">
          <div className="text-xs uppercase tracking-widest text-rose-400 font-semibold mb-3">🔴 Fall of Wickets</div>
          <div className="space-y-2">
            {fallOfWickets.slice(-3).reverse().map((wicket, idx) => (
              <div key={idx} className="bg-rose-900/20 rounded-lg p-2 border border-rose-700/30 text-sm">
                <div className="text-xs text-rose-300">
                  Wicket #{wicket.wicketNumber} at {wicket.over}
                </div>
                <div className="text-slate-200">
                  {wicket.batsman} ({wicket.dismissal}) - Score: {wicket.runs}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BallByBallScoreboard;
