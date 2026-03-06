// Wrapper around every visual metaphor component.
// Provides consistent padding, labels, and animation.

import { motion } from "framer-motion";

const MetaphorWrapper = ({ title, subtitle, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full gap-4 p-4"
    >
      {/* Label */}
      <div>
        <h3 className="font-display text-lg text-slate-700">{title}</h3>
        {subtitle && (
          <p className="font-body text-sm text-slate-400 mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Metaphor content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {children}
      </div>
    </motion.div>
  );
};

export default MetaphorWrapper;