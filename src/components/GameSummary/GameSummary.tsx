type GameSummaryProps = {
  calculateWPM: () => string | 0;
  points: number;
  mistakes: number;
  earnedPoints: number;
  handleReplay: () => void;
};

export default function GameSummary({
  calculateWPM,
  points,
  mistakes,
  earnedPoints,
  handleReplay,
}: GameSummaryProps) {
  return (
    <div className="flex flex-col gap-5 p-5 rounded-lg bg-white shadow-md dark:bg-[#2a2a2a] dark:text-[#e0e0e0]">
      <p className="w-full p-[15px] m-0 border border-gray-200 rounded-md font-sans text-gray-800 dark:border-none dark:bg-[#333] dark:text-gray-200 dark:shadow-[0_2px_4px_rgba(255,255,255,0.05)]">
        WPM: <span className="font-bold">{calculateWPM()}</span>
      </p>
      <p className="w-full p-[15px] m-0 border border-gray-200 rounded-md font-sans text-gray-800 dark:border-none dark:bg-[#333] dark:text-gray-200 dark:shadow-[0_2px_4px_rgba(255,255,255,0.05)]">
        Total Points: <span className="font-bold">{points - mistakes + earnedPoints}</span>
      </p>
      <p className="w-full p-[15px] m-0 border border-gray-200 rounded-md font-sans text-gray-800 dark:border-none dark:bg-[#333] dark:text-gray-200 dark:shadow-[0_2px_4px_rgba(255,255,255,0.05)]">
        Points Earned: <span className="font-bold">{earnedPoints}</span>
      </p>
      <p className="w-full p-[15px] m-0 border border-gray-200 rounded-md font-sans text-gray-800 dark:border-none dark:bg-[#333] dark:text-gray-200 dark:shadow-[0_2px_4px_rgba(255,255,255,0.05)]">
        Letter Mistakes: <span className="font-bold">{mistakes}</span>
      </p>
      <p className="w-full p-[15px] m-0 border border-gray-200 rounded-md font-sans text-gray-800 dark:border-none dark:bg-[#333] dark:text-gray-200 dark:shadow-[0_2px_4px_rgba(255,255,255,0.05)]">
        Total Points Calculation:{" "}
        <span className="font-bold">
          {`(${points} points) - (${mistakes} mistakes) + (${earnedPoints} earned points) = ${
            points - mistakes + earnedPoints
          }`}
        </span>
      </p>
      <button
        onClick={handleReplay}
        className="px-5 py-2.5 border-none rounded-md bg-blue-600 text-white font-semibold cursor-pointer transition-colors duration-300 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Play Again
      </button>
    </div>
  );
}