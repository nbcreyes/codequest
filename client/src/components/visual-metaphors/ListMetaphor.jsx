// List — a row of numbered boxes that can be reordered via drag and drop.

import { useState, useEffect } from "react";
import { motion, Reorder } from "framer-motion";
import { Plus, X } from "lucide-react";
import MetaphorWrapper from "./MetaphorWrapper";

const ListMetaphor = ({ onStateChange, initialState = {} }) => {
  const [name, setName] = useState(initialState.name || "fruits");
  const [items, setItems] = useState(initialState.values || ["apple", "banana", "cherry"]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    onStateChange({ name, values: items });
  }, [name, items]);

  const addItem = () => {
    if (newItem.trim()) {
      setItems((prev) => [...prev, newItem.trim()]);
      setNewItem("");
    }
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <MetaphorWrapper title="List" subtitle="Drag items to reorder them">
      <div className="flex flex-col gap-4 w-full max-w-xs">
        {/* List boxes */}
        <Reorder.Group
          axis="y"
          values={items}
          onReorder={setItems}
          className="flex flex-col gap-2"
        >
          {items.map((item, index) => (
            <Reorder.Item key={item + index} value={item}>
              <motion.div
                whileDrag={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}
                className="flex items-center gap-3 bg-quest-50 border-2 border-quest-200 rounded-2xl px-4 py-2 cursor-grab active:cursor-grabbing"
              >
                <span className="w-6 h-6 bg-quest-500 text-white rounded-lg flex items-center justify-center text-xs font-display">
                  {index}
                </span>
                <span className="flex-1 font-code text-sm text-slate-700">{item}</span>
                <button
                  onClick={() => removeItem(index)}
                  className="text-slate-400 hover:text-coral-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {/* Add item */}
        <div className="flex gap-2">
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder="Add item..."
            className="flex-1 px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-quest-400 font-code text-sm outline-none"
          />
          <button
            onClick={addItem}
            className="w-10 h-10 bg-quest-500 hover:bg-quest-600 text-white rounded-xl flex items-center justify-center transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Name input */}
        <div>
          <label className="font-body text-xs text-slate-500 mb-1 block">
            List name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value.replace(/\s/g, "_").toLowerCase())}
            className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-quest-400 font-code text-sm outline-none"
          />
        </div>
      </div>
    </MetaphorWrapper>
  );
};

export default ListMetaphor;