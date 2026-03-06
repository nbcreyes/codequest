// Variable — a labeled storage box with a value inside.
// Kid types the variable name and value, code updates live.

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MetaphorWrapper from "./MetaphorWrapper";

const VALUE_TYPES = ["integer", "string", "boolean"];

const VariableMetaphor = ({ onStateChange, initialState = {} }) => {
  const [name, setName] = useState(initialState.name || "score");
  const [value, setValue] = useState(initialState.value || "42");
  const [valueType, setValueType] = useState(initialState.valueType || "integer");

  useEffect(() => {
    onStateChange({ name, value, valueType });
  }, [name, value, valueType]);

  return (
    <MetaphorWrapper
      title="Variable"
      subtitle="A box that stores a value"
    >
      <div className="flex flex-col items-center gap-6 w-full max-w-xs">
        {/* The box */}
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative w-48 h-32 bg-quest-100 border-4 border-quest-400 rounded-3xl flex flex-col items-center justify-center shadow-quest-sm"
        >
          {/* Label on top */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-quest-500 text-white px-4 py-1 rounded-full text-xs font-display whitespace-nowrap">
            {name || "variable_name"}
          </div>

          {/* Value inside */}
          <span className="font-display text-3xl text-quest-700">
            {valueType === "string" ? `"${value}"` : value}
          </span>

          {/* Type badge */}
          <span className="absolute bottom-2 right-3 text-xs font-body text-quest-400">
            {valueType}
          </span>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-col gap-3 w-full">
          <div>
            <label className="font-body text-xs text-slate-500 mb-1 block">
              Variable name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value.replace(/\s/g, "_").toLowerCase())}
              className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-quest-400 font-code text-sm outline-none"
              placeholder="my_variable"
            />
          </div>

          <div>
            <label className="font-body text-xs text-slate-500 mb-1 block">
              Value
            </label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-quest-400 font-code text-sm outline-none"
              placeholder="42"
            />
          </div>

          <div>
            <label className="font-body text-xs text-slate-500 mb-1 block">
              Type
            </label>
            <div className="flex gap-2">
              {VALUE_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setValueType(t)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-body font-600 transition-all ${
                    valueType === t
                      ? "bg-quest-500 text-white"
                      : "bg-slate-100 text-slate-500 hover:bg-quest-100"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MetaphorWrapper>
  );
};

export default VariableMetaphor;