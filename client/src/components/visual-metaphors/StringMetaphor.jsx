// String — a speech bubble with text inside.

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MetaphorWrapper from "./MetaphorWrapper";

const StringMetaphor = ({ onStateChange, initialState = {} }) => {
  const [name, setName] = useState(initialState.name || "greeting");
  const [value, setValue] = useState(initialState.value || "Hello, world!");

  useEffect(() => {
    onStateChange({ name, value });
  }, [name, value]);

  return (
    <MetaphorWrapper
      title="String"
      subtitle="A speech bubble that holds text"
    >
      <div className="flex flex-col items-center gap-6 w-full max-w-xs">
        {/* Speech bubble */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="relative"
        >
          <div className="bg-emerald-100 border-4 border-emerald-400 rounded-3xl px-6 py-4 max-w-xs shadow-md">
            <p className="font-code text-emerald-800 text-lg text-center break-all">
              "{value}"
            </p>
          </div>
          {/* Bubble tail */}
          <div className="absolute -bottom-4 left-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-emerald-400" />
        </motion.div>

        {/* Label tag */}
        <div className="bg-emerald-500 text-white px-4 py-1 rounded-full font-display text-sm mt-2">
          {name}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3 w-full">
          <div>
            <label className="font-body text-xs text-slate-500 mb-1 block">
              Variable name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value.replace(/\s/g, "_").toLowerCase())}
              className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-emerald-400 font-code text-sm outline-none"
            />
          </div>
          <div>
            <label className="font-body text-xs text-slate-500 mb-1 block">
              Text content
            </label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-emerald-400 font-code text-sm outline-none"
            />
          </div>
        </div>
      </div>
    </MetaphorWrapper>
  );
};

export default StringMetaphor;