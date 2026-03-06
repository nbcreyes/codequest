// Conditional — a fork in the road with a sign.

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MetaphorWrapper from "./MetaphorWrapper";

const OPERATORS = [">=", "<=", ">", "<", "==", "!="];

const ConditionalMetaphor = ({ onStateChange, initialState = {} }) => {
  const [variable, setVariable] = useState(initialState.variable || "score");
  const [operator, setOperator] = useState(initialState.operator || ">=");
  const [threshold, setThreshold] = useState(initialState.threshold || "50");
  const [testValue, setTestValue] = useState("75");

  const meetsCondition = (() => {
    const a = parseFloat(testValue);
    const b = parseFloat(threshold);
    if (isNaN(a) || isNaN(b)) return false;
    switch (operator) {
      case ">=": return a >= b;
      case "<=": return a <= b;
      case ">":  return a > b;
      case "<":  return a < b;
      case "==": return a === b;
      case "!=": return a !== b;
      default:   return false;
    }
  })();

  useEffect(() => {
    onStateChange({ variable, operator, threshold,
      trueAction: 'print("Yes!")',
      falseAction: 'print("No!")',
    });
  }, [variable, operator, threshold]);

  return (
    <MetaphorWrapper title="Conditional" subtitle="The fork in the road">
      <div className="flex flex-col items-center gap-4 w-full max-w-xs">
        {/* Fork visualization */}
        <div className="relative w-full h-40 flex items-start justify-center">
          {/* Road */}
          <div className="absolute top-0 w-2 h-16 bg-slate-300 rounded-full mx-auto" />

          {/* Sign at fork */}
          <div className="absolute top-12 bg-white border-2 border-slate-300 rounded-2xl px-4 py-2 shadow-sm">
            <span className="font-code text-sm text-slate-700">
              {variable} {operator} {threshold}?
            </span>
          </div>

          {/* Left path — True */}
          <div className="absolute bottom-0 left-6 flex flex-col items-center gap-1">
            <motion.div
              animate={{
                scale: meetsCondition ? [1, 1.1, 1] : 1,
                backgroundColor: meetsCondition ? "#d1fae5" : "#f1f5f9",
              }}
              className="border-2 rounded-2xl px-4 py-2 border-emerald-300"
            >
              <span className="font-display text-sm text-emerald-700">
                True
              </span>
            </motion.div>
            <AnimatePresence>
              {meetsCondition && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xl"
                >
                  🎉
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Right path — False */}
          <div className="absolute bottom-0 right-6 flex flex-col items-center gap-1">
            <motion.div
              animate={{
                scale: !meetsCondition ? [1, 1.1, 1] : 1,
                backgroundColor: !meetsCondition ? "#ffe4e6" : "#f1f5f9",
              }}
              className="border-2 rounded-2xl px-4 py-2 border-coral-300"
            >
              <span className="font-display text-sm text-coral-700">
                False
              </span>
            </motion.div>
            <AnimatePresence>
              {!meetsCondition && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xl"
                >
                  😅
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3 w-full">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="font-body text-xs text-slate-500 mb-1 block">Variable</label>
              <input
                value={variable}
                onChange={(e) => setVariable(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-quest-400 font-code text-sm outline-none"
              />
            </div>
            <div>
              <label className="font-body text-xs text-slate-500 mb-1 block">Operator</label>
              <select
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-quest-400 font-code text-sm outline-none bg-white"
              >
                {OPERATORS.map((op) => (
                  <option key={op} value={op}>{op}</option>
                ))}
              </select>
            </div>
            <div className="w-20">
              <label className="font-body text-xs text-slate-500 mb-1 block">Value</label>
              <input
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-quest-400 font-code text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-body text-xs text-slate-500 mb-1 block">
              Test value (try different numbers)
            </label>
            <input
              value={testValue}
              onChange={(e) => setTestValue(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border-2 border-emerald-200 focus:border-emerald-400 font-code text-sm outline-none bg-emerald-50"
              placeholder="75"
            />
          </div>
        </div>
      </div>
    </MetaphorWrapper>
  );
};

export default ConditionalMetaphor;