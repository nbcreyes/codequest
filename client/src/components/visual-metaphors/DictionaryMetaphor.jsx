// Dictionary — a filing cabinet with labeled drawers.

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import MetaphorWrapper from "./MetaphorWrapper";

const DictionaryMetaphor = ({ onStateChange, initialState = {} }) => {
  const [name, setName] = useState(initialState.name || "person");
  const [pairs, setPairs] = useState(
    initialState.keys
      ? initialState.keys.map((k, i) => ({ key: k, value: initialState.values[i] || "" }))
      : [{ key: "name", value: "Alex" }, { key: "age", value: "10" }]
  );
  const [openDrawer, setOpenDrawer] = useState(null);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    onStateChange({
      name,
      keys: pairs.map((p) => p.key),
      values: pairs.map((p) => p.value),
    });
  }, [name, pairs]);

  const addPair = () => {
    if (newKey.trim()) {
      setPairs((prev) => [...prev, { key: newKey.trim(), value: newValue.trim() }]);
      setNewKey("");
      setNewValue("");
    }
  };

  const removePair = (index) => {
    setPairs((prev) => prev.filter((_, i) => i !== index));
    if (openDrawer === index) setOpenDrawer(null);
  };

  return (
    <MetaphorWrapper title="Dictionary" subtitle="A filing cabinet with labeled drawers">
      <div className="flex flex-col gap-4 w-full max-w-xs">
        {/* Cabinet */}
        <div className="bg-amber-50 border-4 border-amber-300 rounded-3xl p-3 flex flex-col gap-2">
          {pairs.map((pair, index) => (
            <motion.div key={index} layout className="flex flex-col">
              {/* Drawer handle */}
              <button
                onClick={() => setOpenDrawer(openDrawer === index ? null : index)}
                className="flex items-center justify-between bg-amber-200 hover:bg-amber-300 border-2 border-amber-400 rounded-xl px-4 py-2 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-600 rounded-full" />
                  <span className="font-code text-sm text-amber-800 font-600">
                    "{pair.key}"
                  </span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removePair(index); }}
                  className="text-amber-500 hover:text-coral-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </button>

              {/* Drawer contents */}
              <AnimatePresence>
                {openDrawer === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white border-2 border-t-0 border-amber-300 rounded-b-xl px-4 py-3">
                      <input
                        value={pair.value}
                        onChange={(e) => {
                          const updated = [...pairs];
                          updated[index].value = e.target.value;
                          setPairs(updated);
                        }}
                        className="w-full px-2 py-1 border-2 border-slate-200 rounded-lg font-code text-sm outline-none"
                        placeholder="value"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Add pair */}
        <div className="flex gap-2">
          <input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="key"
            className="flex-1 px-3 py-2 rounded-xl border-2 border-slate-200 font-code text-sm outline-none"
          />
          <input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="value"
            className="flex-1 px-3 py-2 rounded-xl border-2 border-slate-200 font-code text-sm outline-none"
          />
          <button
            onClick={addPair}
            className="w-10 h-10 bg-amber-500 hover:bg-amber-600 text-white rounded-xl flex items-center justify-center"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Name */}
        <div>
          <label className="font-body text-xs text-slate-500 mb-1 block">Dictionary name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value.replace(/\s/g, "_").toLowerCase())}
            className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 font-code text-sm outline-none"
          />
        </div>
      </div>
    </MetaphorWrapper>
  );
};

export default DictionaryMetaphor;