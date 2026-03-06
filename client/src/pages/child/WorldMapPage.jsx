import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Lock, Star, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { getChapters, getChildProgress } from "@/services/storyService";
import AvatarDisplay from "@/components/child/AvatarDisplay";
import Spinner from "@/components/ui/Spinner";
import { clsx } from "clsx";

const STAGE_COLORS = {
  1: "from-quest-400 to-quest-600",
  2: "from-emerald-400 to-emerald-600",
  3: "from-coral-400 to-coral-600",
  4: "from-gold-400 to-gold-600",
  5: "from-violet-400 to-violet-600",
};

const STAGE_BG = {
  1: "bg-quest-900",
  2: "bg-emerald-900",
  3: "bg-slate-900",
  4: "bg-amber-900",
  5: "bg-violet-900",
};

const ChapterNode = ({ chapter, progressData, index, onSelect }) => {
  const chapterProgress = progressData?.chapters?.find(
    (cp) => cp.chapter?._id === chapter._id || cp.chapter === chapter._id
  );

  const isUnlocked = chapterProgress?.isUnlocked || chapter.order === 1;
  const isCompleted = chapterProgress?.isCompleted || false;
  const isPremium = chapter.isPremium;

  const stageGradient = STAGE_COLORS[chapter.codingStage] || STAGE_COLORS[1];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
      className="flex flex-col items-center"
    >
      <button
        onClick={() => isUnlocked && onSelect(chapter)}
        disabled={!isUnlocked}
        className={clsx(
          "relative w-24 h-24 rounded-full flex items-center justify-center",
          "border-4 transition-all duration-300 shadow-lg",
          isCompleted
            ? "border-gold-400 shadow-gold-glow"
            : isUnlocked
              ? "border-white hover:scale-110 cursor-pointer"
              : "border-slate-600 opacity-50 cursor-not-allowed",
          `bg-gradient-to-br ${stageGradient}`
        )}
      >
        {isCompleted ? (
          <Star className="w-10 h-10 text-gold-300 fill-gold-300" />
        ) : isUnlocked ? (
          <span className="font-display text-3xl text-white">{chapter.order}</span>
        ) : (
          <Lock className="w-8 h-8 text-slate-400" />
        )}

        {isPremium && !isUnlocked && (
          <div className="absolute -top-2 -right-2 bg-gold-400 text-white text-xs font-display px-2 py-0.5 rounded-full">
            PRO
          </div>
        )}
      </button>

      <div className="mt-3 text-center max-w-24">
        <p className="font-display text-sm text-white leading-tight">
          {chapter.title}
        </p>
        {isUnlocked && !isCompleted && (
          <p className="font-body text-xs text-slate-400 mt-0.5">
            {chapter.worldName || "Adventure awaits"}
          </p>
        )}
        {isCompleted && (
          <p className="font-body text-xs text-gold-400 mt-0.5 font-600">
            Completed
          </p>
        )}
      </div>
    </motion.div>
  );
};

const WorldMapPage = () => {
  const navigate = useNavigate();
  const { currentChild, clearChildSession } = useAuthStore();

  const { data: chaptersData, isLoading: chaptersLoading } = useQuery({
    queryKey: ["chapters"],
    queryFn: getChapters,
  });

  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: ["progress"],
    queryFn: getChildProgress,
  });

  const chapters = chaptersData?.data?.chapters || [];
  const progress = progressData?.data?.progress;
  const isLoading = chaptersLoading || progressLoading;

  const handleChapterSelect = (chapter) => {
    navigate(`/play/chapter/${chapter._id}`);
  };

  const handleBackToParent = () => {
    clearChildSession();
    navigate("/parent/dashboard");
  };

  if (isLoading) return <Spinner fullScreen />;

  // Determine current stage from child profile
  const stageBg = STAGE_BG[currentChild?.currentStage] || STAGE_BG[1];

  return (
    <div className={`min-h-screen ${stageBg} relative overflow-hidden`}>
      {/* Decorative star background */}
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <AvatarDisplay avatar={currentChild?.avatar} size="sm" />
          <div>
            <p className="font-display text-white text-lg leading-none">
              {currentChild?.firstName}
            </p>
            <p className="font-body text-xs text-slate-300">
              {currentChild?.stageTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/10 rounded-2xl px-4 py-2">
            <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
            <span className="font-display text-white text-sm">
              {currentChild?.points || 0}
            </span>
          </div>

          <button
            onClick={handleBackToParent}
            className="font-body text-xs text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-xl hover:bg-white/10"
          >
            Exit
          </button>
        </div>
      </header>

      {/* Map title */}
      <div className="relative z-10 text-center py-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl text-white"
        >
          Adventure Map
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-body text-slate-300 mt-1 text-sm"
        >
          Choose your next chapter
        </motion.p>
      </div>

      {/* Chapter nodes */}
      <div className="relative z-10 px-6 pb-12">
        {chapters.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-2xl text-white mb-2">
              Chapters coming soon
            </p>
            <p className="font-body text-slate-400 text-sm">
              The admin has not published any chapters yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8 max-w-3xl mx-auto">
            {chapters.map((chapter, index) => (
              <ChapterNode
                key={chapter._id}
                chapter={chapter}
                progressData={progress}
                index={index}
                onSelect={handleChapterSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorldMapPage;