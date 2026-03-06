// Integer — a number tile with increment/decrement controls.

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import MetaphorWrapper from "./MetaphorWrapper";

const IntegerMetaphor = ({ onStateChange, initialState = {} }) => {
  const [name, setName] = useState(initialState.name || "score");
  const [value, setValue] = useState(initialState.value || 0);

  useEffect(() => {
    onStateChange({ name, value: String(value) });
  }, [name, value]);

  const increment = () => setValue((v) => v + 1);
  const decrement = () => setValue((v) => v - 1);

  return (
    <MetaphorWrapper title="Integer" subtitle="A whole number tile">
      <div className="flex flex-col items-center gap-6 w-full max-w-xs">
        {/* Number tile */}
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={decrement}
            className="w-12 h-12 bg-coral-100 hover:bg-coral-200 border-2 border-coral-300 rounded-2xl flex items-center justify-center transition-colors"
          >
            <Minus className="w-5 h-5 text-coral-600" />
          </motion.button>

          <AnimatePresence mode="wait">
            <motion.div
              key={value}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-28 h-28 bg-gold-100 border-4 border-gold-400 rounded-3xl flex items-center justify-center shadow-md"
            >
              <span className="font-display text-5xl text-gold-700">{value}</span>
            </motion.div>
          </AnimatePresence>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={increment}
            className="w-12 h-12 bg-emerald-100 hover:bg-emerald-200 border-2 border-emerald-300 rounded-2xl flex items-center justify-center transition-colors"
          >
            <Plus className="w-5 h-5 text-emerald-600" />
          </motion.button>
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

export default IntegerMetaphor;