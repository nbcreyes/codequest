// Class — a blueprint or template.

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MetaphorWrapper from "./MetaphorWrapper";

const ClassMetaphor = ({ onStateChange, initialState = {} }) => {
  const [className, setClassName] = useState(initialState.className || "Animal");
  const [attribute1, setAttribute1] = useState(initialState.attribute1 || "name");
  const [attribute2, setAttribute2] = useState(initialState.attribute2 || "sound");

  useEffect(() => {
    onStateChange({ className, attribute1, attribute2 });
  }, [className, attribute1, attribute2]);

  return (
    <MetaphorWrapper title="Class" subtitle="A blueprint — defines what objects look like">
      <div className="flex flex-col items-center gap-5 w-full max-w-xs">
        {/* Blueprint */}
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-full bg-slate-800 border-4 border-quest-400 rounded-3xl p-5 shadow-quest-md"
        >
          {/* Blueprint header */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-coral-400" />
            <div className="w-3 h-3 rounded-full bg-gold-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="font-code text-quest-300 text-xs ml-2">blueprint.py</span>
          </div>

          <div className="font-code text-sm space-y-1">
            <p className="text-violet-400">
              class <span className="text-gold-300">{className}</span>:
            </p>
            <p className="text-slate-400 pl-4">
              def <span className="text-emerald-300">__init__</span>
              (self, <span className="text-quest-300">{attribute1}</span>,{" "}
              <span className="text-quest-300">{attribute2}</span>):
            </p>
            <p className="text-white pl-8">
              self.<span className="text-quest-300">{attribute1}</span> = {attribute1}
            </p>
            <p className="text-white pl-8">
              self.<span className="text-quest-300">{attribute2}</span> = {attribute2}
            </p>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-col gap-3 w-full">
          <div>
            <label className="font-body text-xs text-slate-500 mb-1 block">Class name</label>
            <input
              value={className}
              onChange={(e) => setClassName(e.target.value.replace(/\s/g, ""))}
              className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 font-code text-sm outline-none"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="font-body text-xs text-slate-500 mb-1 block">Attribute 1</label>
              <input
                value={attribute1}
                onChange={(e) => setAttribute1(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 font-code text-sm outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="font-body text-xs text-slate-500 mb-1 block">Attribute 2</label>
              <input
                value={attribute2}
                onChange={(e) => setAttribute2(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 font-code text-sm outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </MetaphorWrapper>
  );
};

export default ClassMetaphor;