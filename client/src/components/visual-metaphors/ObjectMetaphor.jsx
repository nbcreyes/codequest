// Object — a house built from the blueprint.

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MetaphorWrapper from "./MetaphorWrapper";

const ObjectMetaphor = ({ onStateChange, initialState = {} }) => {
  const [className, setClassName] = useState(initialState.className || "Animal");
  const [instanceName, setInstanceName] = useState(initialState.instanceName || "dog");
  const [arg1, setArg1] = useState(initialState.arg1 || "Rex");
  const [arg2, setArg2] = useState(initialState.arg2 || "Woof");

  useEffect(() => {
    onStateChange({ className, instanceName, arg1, arg2 });
  }, [className, instanceName, arg1, arg2]);

  return (
    <MetaphorWrapper title="Object" subtitle="A house built from the blueprint">
      <div className="flex flex-col items-center gap-5 w-full max-w-xs">
        {/* Blueprint mini */}
        <div className="w-full flex items-center gap-4">
          <div className="flex-1 bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl p-3 text-center">
            <p className="font-code text-xs text-slate-500">class {className}</p>
            <p className="font-body text-xs text-slate-400 mt-1">Blueprint</p>
          </div>

          <div className="flex flex-col items-center gap-1 text-slate-400">
            <div className="font-display text-2xl">→</div>
            <span className="font-body text-xs">build</span>
          </div>

          {/* The object — the house */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex-1 bg-quest-100 border-4 border-quest-400 rounded-3xl p-3 text-center shadow-quest-sm"
          >
            <div className="text-3xl mb-1">🏠</div>
            <p className="font-code text-xs text-quest-700 font-600">{instanceName}</p>
          </motion.div>
        </div>

        {/* Object properties */}
        <div className="w-full bg-quest-50 border-2 border-quest-200 rounded-2xl p-4">
          <p className="font-body text-xs text-slate-500 mb-2">Object properties:</p>
          <div className="space-y-1 font-code text-sm">
            <p className="text-slate-700">
              <span className="text-quest-600">{instanceName}</span>.name ={" "}
              <span className="text-emerald-600">"{arg1}"</span>
            </p>
            <p className="text-slate-700">
              <span className="text-quest-600">{instanceName}</span>.sound ={" "}
              <span className="text-emerald-600">"{arg2}"</span>
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {[
            { label: "Class", val: className, set: setClassName },
            { label: "Instance name", val: instanceName, set: setInstanceName },
            { label: "Arg 1 (name)", val: arg1, set: setArg1 },
            { label: "Arg 2 (sound)", val: arg2, set: setArg2 },
          ].map(({ label, val, set }) => (
            <div key={label}>
              <label className="font-body text-xs text-slate-500 mb-1 block">{label}</label>
              <input
                value={val}
                onChange={(e) => set(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 font-code text-sm outline-none"
              />
            </div>
          ))}
        </div>
      </div>
    </MetaphorWrapper>
  );
};

export default ObjectMetaphor;