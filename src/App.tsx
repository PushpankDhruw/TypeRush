import React, { useEffect, useRef, useState } from "react";
import { useTypeRushStore } from "./util/store";
import { FocusWrapper, GameSummary } from "./components";
import { LuTimer, LuSkull, LuCaseSensitive, LuStar } from "react-icons/lu";
import { texts } from "./util/texts";
import { cn } from "./util/cn";

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
  const [activeFilter, setActiveFilter] = useState<string>("words");

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
    const basePoints = currentText.replace(/\s/g, "").length;
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
    const words = currentText.split(" ");
    
    return (
      <div className="flex flex-wrap justify-center gap-x-2">
        {words.map((word, wordIndex) => (
          <div key={wordIndex} className="inline-block">
            {word.split("").map((char, charIndex) => {
              const globalIndex = wordIndex === 0 
                ? charIndex 
                : words.slice(0, wordIndex).join(" ").length + wordIndex + charIndex;
              
              const inputChar = input[globalIndex];
              let statusClass = "text-muted";
              
              if (inputChar !== undefined) {
                statusClass = char === inputChar ? "text-valid" : "text-invalid";
              }

              return (
                <span
                  key={charIndex}
                  className={cn(statusClass)}
                >
                  {char}
                </span>
              );
            })}
            {wordIndex < words.length - 1 && (
              <span className="text-muted"> </span>
            )}
          </div>
        ))}
      </div>
    );
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
            <div className="flex items-center justify-center w-full gap-2 mb-8">
              <button 
                className={cn("filter-option", activeFilter === "punctuation" && "active")}
                onClick={() => setActiveFilter("punctuation")}
              >
                punctuation
              </button>
              <button 
                className={cn("filter-option", activeFilter === "numbers" && "active")}
                onClick={() => setActiveFilter("numbers")}
              >
                numbers
              </button>
              <button 
                className={cn("filter-option", activeFilter === "time" && "active")}
                onClick={() => setActiveFilter("time")}
              >
                time
              </button>
              <button 
                className={cn("filter-option", activeFilter === "words" && "active")}
                onClick={() => setActiveFilter("words")}
              >
                words
              </button>
              <button 
                className={cn("filter-option", activeFilter === "quote" && "active")}
                onClick={() => setActiveFilter("quote")}
              >
                quote
              </button>
              <button 
                className={cn("filter-option", activeFilter === "zen" && "active")}
                onClick={() => setActiveFilter("zen")}
              >
                zen
              </button>
              <button 
                className={cn("filter-option", activeFilter === "custom" && "active")}
                onClick={() => setActiveFilter("custom")}
              >
                custom
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-4 mb-4">
              <button className="filter-option">10</button>
              <button className="filter-option">25</button>
              <button className="filter-option">50</button>
              <button className="filter-option active">100</button>
              <button className="filter-option">∞</button>
            </div>

            <div className="flex items-center justify-center w-full mb-12">
              <div className="text-sub-text text-sm flex items-center gap-2">
                <span className="text-brand">english 1k</span>
              </div>
            </div>

            <div className="text-content w-full text-center text-2xl mb-8">
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
            
            <div className="text-sub-text text-xs mt-8">
              {capsLock && (
                <div className="flex items-center gap-2">
                  <LuCaseSensitive className="text-brand" />
                  <span>caps lock on</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}