// Loop — a character walking in a circle with a counter.

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import MetaphorWrapper from "./MetaphorWrapper";

const LoopMetaphor = ({ onStateChange, initialState = {} }) => {
  const [count, setCount] = useState(initialState.count || 3);
  const [variable, setVariable] = useState(initialState.variable || "i");
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    onStateChange({ count, variable, action: "print" });
  }, [count, variable]);

  // Animate the loop steps
  const runAnimation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStep(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCurrentStep(step);
      if (step >= count) {
        clearInterval(interval);
        setIsRunning(false);
        setTimeout(() => setCurrentStep(0), 1000);
      }
    }, 600);
  };

  // Generate circle positions for the walker
  const steps = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
    const radius = 70;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  });

  const walkerPos = currentStep > 0 && currentStep <= steps.length
    ? steps[currentStep - 1]
    : steps[0];

  return (
    <MetaphorWrapper title="Loop" subtitle="Press play to watch the loop run">
      <div className="flex flex-col items-center gap-6 w-full max-w-xs">
        {/* Circle path visualization */}
        <div className="relative w-48 h-48">
          {/* Path circle */}
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-quest-300" />

          {/* Step markers */}
          {steps.map((pos, i) => (
            <div
              key={i}
              className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-xs font-display transition-all duration-300 ${
                i < currentStep
                  ? "bg-quest-500 text-white"
                  : "bg-quest-100 text-quest-400 border-2 border-quest-300"
              }`}
              style={{
                left: `calc(50% + ${pos.x}px - 16px)`,
                top: `calc(50% + ${pos.y}px - 16px)`,
              }}
            >
              {i}
            </div>
          ))}

          {/* Walker character */}
          <motion.div
            animate={walkerPos ? { x: walkerPos.x - 16, y: walkerPos.y - 16 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute text-2xl"
            style={{ left: "calc(50%)", top: "calc(50%)" }}
          >
            🏃
          </motion.div>

          {/* Center counter */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-2xl px-3 py-1 shadow-sm border border-quest-200">
              <span className="font-display text-quest-600 text-sm">
                {variable} = {Math.max(0, currentStep)}
              </span>
            </div>
          </div>
        </div>

        {/* Play button */}
        <button
          onClick={runAnimation}
          disabled={isRunning}
          className="px-6 py-2 bg-quest-500 hover:bg-quest-600 disabled:opacity-50 text-white rounded-2xl font-display transition-colors"
        >
          {isRunning ? "Running..." : "Play loop"}
        </button>

        {/* Controls */}
        <div className="flex flex-col gap-3 w-full">
          <div className="flex items-center justify-between">
            <span className="font-body text-sm text-slate-600">Repeat count</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCount((c) => Math.max(1, c - 1))}
                className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-display text-xl text-quest-600 w-8 text-center">{count}</span>
              <button
                onClick={() => setCount((c) => Math.min(10, c + 1))}
                className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div>
            <label className="font-body text-xs text-slate-500 mb-1 block">
              Loop variable
            </label>
            <input
              value={variable}
              onChange={(e) => setVariable(e.target.value.replace(/\s/g, ""))}
              maxLength={4}
              className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-quest-400 font-code text-sm outline-none"
            />
          </div>
        </div>
      </div>
    </MetaphorWrapper>
  );
};

export default LoopMetaphor;