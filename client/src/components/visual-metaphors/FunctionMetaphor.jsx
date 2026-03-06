// Function — a machine with an input slot and output slot.

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import MetaphorWrapper from "./MetaphorWrapper";

const FunctionMetaphor = ({ onStateChange, initialState = {} }) => {
  const [name, setName] = useState(initialState.name || "greet");
  const [paramName, setParamName] = useState(initialState.paramName || "name");
  const [inputValue, setInputValue] = useState("World");
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState(null);

  useEffect(() => {
    onStateChange({ name, paramName, body: `print("Hello, " + ${paramName})` });
  }, [name, paramName]);

  const runMachine = () => {
    if (isRunning || !inputValue) return;
    setIsRunning(true);
    setOutput(null);

    setTimeout(() => {
      setOutput(`Hello, ${inputValue}`);
      setIsRunning(false);
    }, 1200);
  };

  return (
    <MetaphorWrapper title="Function" subtitle="A machine that takes input and gives output">
      <div className="flex flex-col items-center gap-5 w-full max-w-xs">
        {/* Machine visualization */}
        <div className="flex items-center gap-3 w-full">
          {/* Input */}
          <div className="flex flex-col items-center gap-1">
            <span className="font-body text-xs text-slate-500">Input</span>
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-20 px-2 py-2 rounded-xl border-2 border-quest-300 font-code text-sm text-center outline-none bg-quest-50"
            />
          </div>

          <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />

          {/* Machine box */}
          <motion.div
            animate={isRunning ? { scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] } : {}}
            transition={{ duration: 0.6, repeat: isRunning ? Infinity : 0 }}
            className="flex-1 h-20 bg-gradient-to-br from-violet-400 to-violet-600 rounded-3xl flex flex-col items-center justify-center shadow-lg cursor-pointer"
            onClick={runMachine}
          >
            <span className="font-display text-white text-sm">{name}()</span>
            <span className="font-body text-violet-200 text-xs mt-1">
              {isRunning ? "Processing..." : "Click to run"}
            </span>
          </motion.div>

          <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />

          {/* Output */}
          <div className="flex flex-col items-center gap-1">
            <span className="font-body text-xs text-slate-500">Output</span>
            <AnimatePresence mode="wait">
              {output ? (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="w-20 px-2 py-2 rounded-xl border-2 border-emerald-300 bg-emerald-50 font-code text-xs text-center text-emerald-700"
                >
                  {output}
                </motion.div>
              ) : (
                <div className="w-20 h-10 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center">
                  <span className="text-slate-300 text-xs">?</span>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 w-full">
          <div className="flex-1">
            <label className="font-body text-xs text-slate-500 mb-1 block">
              Function name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value.replace(/\s/g, "_"))}
              className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-violet-400 font-code text-sm outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="font-body text-xs text-slate-500 mb-1 block">
              Parameter
            </label>
            <input
              value={paramName}
              onChange={(e) => setParamName(e.target.value.replace(/\s/g, "_"))}
              className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-violet-400 font-code text-sm outline-none"
            />
          </div>
        </div>
      </div>
    </MetaphorWrapper>
  );
};

export default FunctionMetaphor;