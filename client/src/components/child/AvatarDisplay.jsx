// Renders a child's avatar as a colored illustrated circle.
// Each avatar key maps to a unique color and initial letter combo
// until real avatar assets are added in the UI polish step.

import { clsx } from "clsx";

const AVATAR_COLORS = {
  explorer:   "bg-quest-400 text-white",
  scientist:  "bg-emerald-400 text-white",
  knight:     "bg-slate-500 text-white",
  wizard:     "bg-violet-500 text-white",
  astronaut:  "bg-blue-400 text-white",
  ninja:      "bg-slate-800 text-white",
  robot:      "bg-gold-400 text-white",
  pirate:     "bg-coral-500 text-white",
};

const AVATAR_EMOJI = {
  explorer:  "🧭",
  scientist: "🔬",
  knight:    "⚔️",
  wizard:    "🧙",
  astronaut: "🚀",
  ninja:     "🥷",
  robot:     "🤖",
  pirate:    "🏴‍☠️",
};

const sizes = {
  sm:  "w-10 h-10 text-lg",
  md:  "w-16 h-16 text-2xl",
  lg:  "w-24 h-24 text-4xl",
  xl:  "w-32 h-32 text-5xl",
};

const AvatarDisplay = ({ avatar = "explorer", size = "md", className = "" }) => {
  return (
    <div
      className={clsx(
        "rounded-full flex items-center justify-center font-display select-none",
        AVATAR_COLORS[avatar] || AVATAR_COLORS.explorer,
        sizes[size],
        className
      )}
    >
      {AVATAR_EMOJI[avatar] || "🧭"}
    </div>
  );
};

export default AvatarDisplay;