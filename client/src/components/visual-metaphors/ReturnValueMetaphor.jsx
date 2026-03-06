// Return value — the finished product coming out of the machine.

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown } from "lucide-react";
import MetaphorWrapper from "./MetaphorWrapper";

const ReturnValueMetaphor = ({ onStateChange, initialState = {} }) => {
  const [funcName, setFuncName] = useState(initialState.funcName || "multiply");
  const [param1, setParam1] = useState(initialState.param1 || "x");
  const [param2, setParam2] = useState(initialState.param2 || "y");
  const [val1, setVal1] = useState("5");
  const [val2, setVal2] = useState("6");
  const [showReturn, setShowReturn] = useState(false);

  const result = parseFloat(val1) * parseFloat(val2);

  useEffect(() => {
    onStateChange({ funcName, param1, param2 });
  }, [funcName, param1, param2]);

  const triggerReturn = () => {
    setShowReturn(false);
    setTimeout(() => setShowReturn(true), 100);
  };

  return (
    <MetaphorWrapper title="Return Value" subtitle="The finished product coming out">
      <div className="flex flex-col items-center gap-4 w-full max-w-xs">
        <div className="flex gap-3 justify-center">
          <input
            value={val1}
            onChange={(e) => { setVal1(e.target.value); setShowReturn(false); }}
            className="w-14 h-14 text-center font-display text-2xl bg-quest-100 border-4 border-quest-400 rounded-2xl outline-none text-quest-700"
          />
          <div className="flex items-center font-display text-2xl text-slate-400">×</div>
          <input
            value={val2}
            onChange={(e) => { setVal2(e.target.value); setShowReturn(false); }}
            className="w-14 h-14 text-center font-display text-2xl bg-quest-100 border-4 border-quest-400 rounded-2xl outline-none text-quest-700"
          />
        </div>

        <ArrowDown className="w-5 h-5 text-slate-400" />

        {/* Factory */}
        <motion.div
          whileTap={{ scale: 0.97 }}
          onClick={triggerReturn}
          className="w-full bg-gradient-to-br from-violet-500 to-violet-700 rounded-3xl p-4 text-center cursor-pointer shadow-lg"
        >
          <p className="font-display text-white">
            def {funcName}({param1}, {param2}):
          </p>
          <p className="font-code text-violet-200 text-sm mt-1">
            return {param1} * {param2}
          </p>
        </motion.div>

        <ArrowDown className="w-5 h-5 text-slate-400" />

        {/* Return value box */}
        <AnimatePresence mode="wait">
          {showReturn ? (
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-24 h-24 bg-gold-100 border-4 border-gold-400 rounded-3xl flex flex-col items-center justify-center shadow-gold-glow"
            >
              <span className="font-display text-3xl text-gold-700">{isNaN(result) ? "?" : result}</span>
              <span className="font-body text-xs text-gold-500 mt-1">returned!</span>
            </motion.div>
          ) : (
            <div className="w-24 h-24 border-4 border-dashed border-slate-200 rounded-3xl flex items-center justify-center">
              <span className="font-body text-xs text-slate-300 text-center">click factory</span>
            </div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="flex gap-2 w-full">
          {[
            { label: "Function", val: funcName, set: setFuncName },
            { label: "Param 1", val: param1, set: setParam1 },
            { label: "Param 2", val: param2, set: setParam2 },
          ].map(({ label, val, set }) => (
            <div key={label} className="flex-1">
              <label className="font-body text-xs text-slate-500 mb-1 block">{label}</label>
              <input
                value={val}
                onChange={(e) => set(e.target.value)}
                className="w-full px-2 py-2 rounded-xl border-2 border-slate-200 font-code text-xs outline-none"
              />
            </div>
          ))}
        </div>
      </div>
    </MetaphorWrapper>
  );
};

export default ReturnValueMetaphor;