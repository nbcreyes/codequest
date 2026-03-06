// Boolean — a light switch that is on or off.

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MetaphorWrapper from "./MetaphorWrapper";

const BooleanMetaphor = ({ onStateChange, initialState = {} }) => {
  const [name, setName] = useState(initialState.name || "is_ready");
  const [value, setValue] = useState(initialState.value !== undefined ? initialState.value : true);

  useEffect(() => {
    onStateChange({ name, value });
  }, [name, value]);

  return (
    <MetaphorWrapper title="Boolean" subtitle="A switch — True or False">
      <div className="flex flex-col items-center gap-6 w-full max-w-xs">
        {/* Light bulb */}
        <motion.div
          animate={{
            boxShadow: value
              ? "0 0 30px 10px rgba(251, 191, 36, 0.4)"
              : "none",
          }}
          className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
            value
              ? "bg-gold-300 border-gold-500"
              : "bg-slate-200 border-slate-300"
          }`}
        >
          <span className="text-4xl">{value ? "💡" : "🌑"}</span>
        </motion.div>

        {/* Switch */}
        <div className="flex items-center gap-4">
          <span className={`font-body text-sm font-600 ${!value ? "text-slate-700" : "text-slate-400"}`}>
            False
          </span>

          <motion.button
            onClick={() => setValue((v) => !v)}
            className={`relative w-16 h-8 rounded-full border-2 transition-colors duration-300 ${
              value ? "bg-gold-400 border-gold-500" : "bg-slate-300 border-slate-400"
            }`}
          >
            <motion.div
              animate={{ x: value ? 32 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md"
            />
          </motion.button>

          <span className={`font-body text-sm font-600 ${value ? "text-gold-600" : "text-slate-400"}`}>
            True
          </span>
        </div>

        {/* Value display */}
        <div className={`px-6 py-2 rounded-2xl font-display text-lg ${
          value ? "bg-gold-100 text-gold-700" : "bg-slate-100 text-slate-500"
        }`}>
          {value ? "True" : "False"}
        </div>

        {/* Name input */}
        <div className="w-full">
          <label className="font-body text-xs text-slate-500 mb-1 block">
            Variable name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value.replace(/\s/g, "_").toLowerCase())}
            className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-gold-400 font-code text-sm outline-none"
          />
        </div>
      </div>
    </MetaphorWrapper>
  );
};

export default BooleanMetaphor;