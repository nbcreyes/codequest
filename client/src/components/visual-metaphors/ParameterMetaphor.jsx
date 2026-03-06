// Parameter — ingredients going into a machine.

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import MetaphorWrapper from "./MetaphorWrapper";

const OPERATIONS = ["+", "-", "*", "/"];

const ParameterMetaphor = ({ onStateChange, initialState = {} }) => {
  const [funcName, setFuncName] = useState(initialState.funcName || "add");
  const [param1, setParam1] = useState(initialState.param1 || "a");
  const [param2, setParam2] = useState(initialState.param2 || "b");
  const [operation, setOperation] = useState(initialState.operation || "+");
  const [val1, setVal1] = useState("3");
  const [val2, setVal2] = useState("4");

  const result = (() => {
    const a = parseFloat(val1);
    const b = parseFloat(val2);
    if (isNaN(a) || isNaN(b)) return "?";
    switch (operation) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b !== 0 ? (a / b).toFixed(2) : "Error";
      default: return "?";
    }
  })();

  useEffect(() => {
    onStateChange({ funcName, param1, param2, operation });
  }, [funcName, param1, param2, operation]);

  return (
    <MetaphorWrapper title="Parameters" subtitle="Ingredients going into the function">
      <div className="flex flex-col items-center gap-5 w-full max-w-xs">
        {/* Ingredient slots */}
        <div className="flex items-end gap-4 justify-center">
          <div className="flex flex-col items-center gap-2">
            <input
              value={val1}
              onChange={(e) => setVal1(e.target.value)}
              className="w-16 h-16 text-center font-display text-2xl text-quest-700 bg-quest-100 border-4 border-quest-400 rounded-2xl outline-none"
            />
            <span className="font-code text-xs text-slate-500">{param1}</span>
          </div>

          <div className="flex flex-col items-center gap-2 pb-6">
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              className="w-12 h-12 text-center font-display text-xl bg-violet-100 border-4 border-violet-400 rounded-2xl outline-none text-violet-700 cursor-pointer"
            >
              {OPERATIONS.map((op) => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col items-center gap-2">
            <input
              value={val2}
              onChange={(e) => setVal2(e.target.value)}
              className="w-16 h-16 text-center font-display text-2xl text-quest-700 bg-quest-100 border-4 border-quest-400 rounded-2xl outline-none"
            />
            <span className="font-code text-xs text-slate-500">{param2}</span>
          </div>
        </div>

        <ArrowDown className="w-6 h-6 text-slate-400" />

        {/* Machine */}
        <div className="w-full bg-gradient-to-br from-violet-400 to-violet-600 rounded-3xl p-4 text-center">
          <p className="font-display text-white text-sm">
            {funcName}({val1}, {val2})
          </p>
        </div>

        <ArrowDown className="w-6 h-6 text-slate-400" />

        {/* Result */}
        <motion.div
          key={result}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-emerald-100 border-4 border-emerald-400 rounded-3xl flex items-center justify-center"
        >
          <span className="font-display text-3xl text-emerald-700">{result}</span>
        </motion.div>

        {/* Controls */}
        <div className="flex gap-2 w-full">
          <div className="flex-1">
            <label className="font-body text-xs text-slate-500 mb-1 block">Function</label>
            <input
              value={funcName}
              onChange={(e) => setFuncName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 font-code text-sm outline-none"
            />
          </div>
          <div className="w-16">
            <label className="font-body text-xs text-slate-500 mb-1 block">Param 1</label>
            <input
              value={param1}
              onChange={(e) => setParam1(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 font-code text-sm outline-none"
            />
          </div>
          <div className="w-16">
            <label className="font-body text-xs text-slate-500 mb-1 block">Param 2</label>
            <input
              value={param2}
              onChange={(e) => setParam2(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 font-code text-sm outline-none"
            />
          </div>
        </div>
      </div>
    </MetaphorWrapper>
  );
};

export default ParameterMetaphor;