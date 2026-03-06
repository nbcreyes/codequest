// Animated story scene viewer.
// Displays character dialogue one scene at a time.
// Kid clicks Next to advance through all scenes before the coding task appears.

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";

const SPEAKER_COLORS = {
  narrator:  "bg-slate-700 text-white",
  character: "bg-quest-600 text-white",
  mentor:    "bg-emerald-600 text-white",
  villain:   "bg-coral-700 text-white",
  kid:       "bg-gold-500 text-white",
};

const SceneViewer = ({ scenes = [], onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const currentScene = scenes[currentIndex];
  const isLastScene = currentIndex === scenes.length - 1;

  // Typewriter effect for dialogue
  useEffect(() => {
    if (!currentScene) return;

    setDisplayedText("");
    setIsTyping(true);

    const text = currentScene.dialogue;
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 28); // Typing speed in ms per character

    return () => clearInterval(interval);
  }, [currentIndex, currentScene]);

  const handleNext = () => {
    if (isTyping) {
      // Skip typewriter — show full text immediately
      setDisplayedText(currentScene.dialogue);
      setIsTyping(false);
      return;
    }

    if (isLastScene) {
      onComplete();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  if (!currentScene) return null;

  const speakerColorClass = SPEAKER_COLORS[currentScene.speaker] || SPEAKER_COLORS.narrator;

  return (
    <div className="relative w-full h-full min-h-64 flex flex-col">
      {/* Background */}
      <div className="flex-1 relative bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl overflow-hidden">

        {/* Scene illustration placeholder — replaced with real art in Step 33 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-48 h-48 bg-white rounded-full" />
        </div>

        {/* Scene counter */}
        <div className="absolute top-4 right-4 flex gap-1.5">
          {scenes.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex
                  ? "bg-white scale-125"
                  : i < currentIndex
                    ? "bg-white/50"
                    : "bg-white/20"
              }`}
            />
          ))}
        </div>

        {/* Character area — placeholder */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2"
          >
            <div className="w-32 h-32 bg-quest-500/30 rounded-full flex items-center justify-center border-2 border-quest-400/30">
              <span className="text-5xl">
                {currentScene.speaker === "villain" ? "😈"
                  : currentScene.speaker === "mentor" ? "🧙"
                  : currentScene.speaker === "kid" ? "🧒"
                  : "🤖"}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dialogue box */}
      <div className="mt-4 bg-white rounded-3xl p-5 shadow-card border border-quest-100">
        {/* Speaker label */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-display ${speakerColorClass}`}>
            {currentScene.speakerName || currentScene.speaker}
          </span>
        </div>

        {/* Dialogue text with typewriter */}
        <div className="min-h-16">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-body text-slate-700 text-base leading-relaxed"
            >
              {displayedText}
              {isTyping && (
                <span className="inline-block w-0.5 h-4 bg-slate-400 ml-0.5 animate-blink" />
              )}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Next button */}
        <div className="flex justify-end mt-4">
          <Button onClick={handleNext} size="sm" className="flex items-center gap-2">
            {isTyping
              ? "Skip"
              : isLastScene
                ? "Start coding"
                : "Next"}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SceneViewer;