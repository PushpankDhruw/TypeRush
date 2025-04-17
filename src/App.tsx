import React, { useEffect, useRef, useState } from "react";
import { useTypeRushStore } from "./util/store";
import { FocusWrapper, GameSummary } from "./components";
import { LuTimer, LuSkull, LuCaseSensitive, LuStar } from "react-icons/lu";
import { texts } from "./util/texts";
import { cn } from "./util/cn"; // Assume you have a className utility

export default function App() {
  const { points, earnedPoints, setPoints, setEarnedPoints } = useTypeRushStore();
  const [mistakes, setMistakes] = useState<number>(0);
  const [input, setInput] = useState<string>("");
  const [capsLock, setCapsLock] = useState<boolean>(false);
  const [currentText, setCurrentText] = useState<string>(texts[0]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [timer, setTimer] = useState<number>(30);

  useEffect(() => {
    setCurrentText(texts[Math.floor(Math.random() * texts.length)]);
    const handleFocus = () => {
      setIsFocused(true);
      inputRef.current?.focus();
    };
    
    const handleKeyPress = (e: KeyboardEvent) => {
      setCapsLock(e.getModifierState("CapsLock"));
      if (!isFocused) handleFocus();
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("click", handleFocus);
    
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("click", handleFocus);
    };
  }, [isFocused]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isFocused && !isCompleted && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer <= 0) {
      setIsCompleted(true);
      setEndTime(Date.now());
    }
    return () => clearInterval(interval);
  }, [isFocused, isCompleted, timer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!startTime) setStartTime(Date.now());
    if (isCompleted || timer <= 0) return;

    const newValue = e.target.value.slice(0, currentText.length);
    let currentMistakes = mistakes;

    // Track mistakes
    if (newValue.length > input.length) {
      const lastChar = newValue[newValue.length - 1];
      const correctChar = currentText[newValue.length - 1];
      if (lastChar !== correctChar) currentMistakes += 1;
    }

    // Update state
    setInput(newValue);
    setMistakes(currentMistakes);

    // Check completion
    if (newValue.length >= currentText.length) {
      setIsCompleted(true);
      setEndTime(Date.now());
      calculatePoints(currentMistakes);
    }
  };

  const calculateWPM = () => {
    if (!startTime || !endTime) return "0.00";
    const minutes = (endTime - startTime) / 60000;
    return (currentText.split(" ").length / minutes).toFixed(2);
  };

  const calculatePoints = (mistakes: number) => {
    const basePoints = currentText.replace(/\s/g, length).length;
    let multiplier = 1;
    
    if (mistakes === 0) multiplier = 2;
    else if (mistakes <= 5) multiplier = 1.5;
    else if (mistakes <= 10) multiplier = 1.2;
    
    setEarnedPoints(Math.floor(basePoints * multiplier));
  };

  const handleReplay = () => {
    setInput("");
    setMistakes(0);
    setIsCompleted(false);
    setTimer(30);
    setStartTime(null);
    setEndTime(null);
    setPoints(points + earnedPoints);
    setCurrentText(texts[Math.floor(Math.random() * texts.length)]);
    inputRef.current?.focus();
  };

  const renderText = () => {
    return currentText.split("").map((char, index) => {
      const inputChar = input[index];
      let statusClass = "text-muted";
      
      if (inputChar) {
        statusClass = char === inputChar ? "text-valid" : "text-invalid";
      }

      return (
        <span
          key={index}
          className={cn(
            "text-[1.75rem] leading-[1.6] [word-spacing:5px]",
            statusClass,
            char === " " && "!text-muted" // Force space character styling
          )}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen w-full bg-bg">
      <div className="container mx-auto flex h-screen flex-col items-center justify-center p-4">
        {!isFocused && <FocusWrapper />}
        
        {isCompleted ? (
          <GameSummary
            calculateWPM={calculateWPM}
            points={points + earnedPoints}
            mistakes={mistakes}
            earnedPoints={earnedPoints}
            handleReplay={handleReplay}
          />
        ) : (
          <div className="flex flex-col items-center gap-8 w-full max-w-4xl">
            <div className="game-status-bar">
              <div>
                <LuTimer className="text-icon" />
                Timer <span className="text-accent">{timer}</span>
              </div>
              <div>
                <LuSkull className="text-icon" />
                Mistakes <span className="text-accent">{mistakes}</span>
              </div>
              <div>
                <LuStar className="text-icon" />
                Points <span className="text-accent">{points}</span>
              </div>
              <div>
                <LuCaseSensitive className="text-icon-lg" />
                Caps Lock <span className="text-accent">{capsLock ? "On" : "Off"}</span>
              </div>
            </div>

            <div className="text-content w-full text-center">
              {renderText()}
            </div>

            <input
              type="text"
              ref={inputRef}
              value={input}
              onChange={handleChange}
              className="sr-only"
              aria-label="Type the text here"
              readOnly={isCompleted}
            />
          </div>
        )}
      </div>
    </div>
  );
}