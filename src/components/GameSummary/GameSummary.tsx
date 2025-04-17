import React from "react";

interface GameSummaryProps {
  calculateWPM: () => string;
  points: number;
  mistakes: number;
  earnedPoints: number;
  handleReplay: () => void;
}

export default function GameSummary({
  calculateWPM,
  points,
  mistakes,
  earnedPoints,
  handleReplay,
}: GameSummaryProps) {
  return (
    <div className="flex flex-col items-center gap-6 p-8 rounded-lg bg-[rgba(255,255,255,0.05)] max-w-md w-full">
      <h2 className="text-2xl font-medium text-brand">Test Complete!</h2>
      
      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="bg-[rgba(255,255,255,0.03)] p-4 rounded-md">
          <div className="text-sub-text text-sm">WPM</div>
          <div className="text-2xl text-text">{calculateWPM()}</div>
        </div>
        
        <div className="bg-[rgba(255,255,255,0.03)] p-4 rounded-md">
          <div className="text-sub-text text-sm">Accuracy</div>
          <div className="text-2xl text-text">
            {mistakes === 0 ? "100%" : `${Math.max(0, 100 - (mistakes * 5)).toFixed(1)}%`}
          </div>
        </div>
        
        <div className="bg-[rgba(255,255,255,0.03)] p-4 rounded-md">
          <div className="text-sub-text text-sm">Mistakes</div>
          <div className="text-2xl text-text">{mistakes}</div>
        </div>
        
        <div className="bg-[rgba(255,255,255,0.03)] p-4 rounded-md">
          <div className="text-sub-text text-sm">Points</div>
          <div className="text-2xl text-text">{points}</div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="text-sub-text text-sm mb-2">Points earned this round</div>
        <div className="text-xl text-brand">+{earnedPoints}</div>
      </div>
      
      <button
        onClick={handleReplay}
        className="mt-4 px-6 py-3 bg-brand text-bg font-medium rounded-md hover:bg-opacity-90 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}