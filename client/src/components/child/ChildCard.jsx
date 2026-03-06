// Card displayed on the parent dashboard for each child profile.

import { motion } from "framer-motion";
import { Pencil, Trash2, Play } from "lucide-react";
import AvatarDisplay from "./AvatarDisplay";
import Button from "@/components/ui/Button";

const STAGE_COLORS = {
  1: "bg-quest-100 text-quest-700",
  2: "bg-emerald-100 text-emerald-700",
  3: "bg-coral-100 text-coral-700",
  4: "bg-gold-100 text-gold-700",
  5: "bg-violet-100 text-violet-700",
};

const ChildCard = ({ child, onPlay, onEdit, onDelete, isSwitching }) => {
  const stageBadgeClass = STAGE_COLORS[child.currentStage] || STAGE_COLORS[1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-4xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300 border border-quest-100"
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <AvatarDisplay avatar={child.avatar} size="md" />
          <div>
            <h3 className="font-display text-xl text-slate-800">
              {child.firstName}
            </h3>
            <p className="font-body text-sm text-slate-400">
              @{child.username}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(child)}
            className="p-2 rounded-xl hover:bg-quest-50 text-slate-400 hover:text-quest-600 transition-colors"
            title="Edit profile"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(child)}
            className="p-2 rounded-xl hover:bg-coral-50 text-slate-400 hover:text-coral-500 transition-colors"
            title="Remove profile"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <span className={`px-3 py-1 rounded-full text-xs font-body font-700 ${stageBadgeClass}`}>
          {child.stageTitle}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-body font-700 bg-gold-100 text-gold-700">
          {child.points} pts
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-body font-700 bg-slate-100 text-slate-600">
          Level {child.level}
        </span>
        {child.streakDays > 0 && (
          <span className="px-3 py-1 rounded-full text-xs font-body font-700 bg-coral-100 text-coral-700">
            {child.streakDays} day streak
          </span>
        )}
      </div>

      {/* Time limit */}
      <p className="font-body text-xs text-slate-400 mb-4">
        Daily limit:{" "}
        {child.dailyTimeLimitMinutes === 0
          ? "No limit"
          : `${child.dailyTimeLimitMinutes} minutes`}
      </p>

      {/* Play button */}
      <Button
        onClick={() => onPlay(child)}
        isLoading={isSwitching}
        className="w-full"
        size="md"
      >
        <Play className="w-4 h-4" />
        Start playing as {child.firstName}
      </Button>
    </motion.div>
  );
};

export default ChildCard;