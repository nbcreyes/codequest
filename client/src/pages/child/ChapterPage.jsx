// Entry point for a chapter — shows the first lesson's scenes,
// then transitions to the lesson/coding task.
// Full lesson logic is wired in Steps 11-16.

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { getChapter } from "@/services/storyService";
import SceneViewer from "@/components/lesson/SceneViewer";
import Spinner from "@/components/ui/Spinner";

// Seed scenes for development — replaced by real DB content once
// the admin dashboard populates chapters in Step 30
const SEED_SCENES = [
  {
    _id: "s1",
    order: 1,
    speaker: "mentor",
    speakerName: "Zara the Coder",
    dialogue: "Welcome, young coder! I am Zara, your guide through the world of Python. Our kingdom needs your help!",
    emotion: "excited",
  },
  {
    _id: "s2",
    order: 2,
    speaker: "narrator",
    speakerName: "Narrator",
    dialogue: "The ancient Code Scrolls have been scattered across the realm. Only by mastering Python can you restore them.",
    emotion: "neutral",
  },
  {
    _id: "s3",
    order: 3,
    speaker: "mentor",
    speakerName: "Zara the Coder",
    dialogue: "Your first task is simple — learn how variables work. Every great programmer starts here. Are you ready?",
    emotion: "happy",
  },
];

const ChapterPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scenesComplete, setScenesComplete] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["chapter", id],
    queryFn: () => getChapter(id),
    retry: false,
  });

  const chapter = data?.data?.chapter;

  const handleScenesComplete = () => {
    setScenesComplete(true);
    // Navigate to first lesson — full lesson routing built in Step 11
    const firstLesson = chapter?.lessons?.[0];
    if (firstLesson) {
      navigate(`/play/lesson/${firstLesson._id}`);
    } else {
      navigate("/play");
    }
  };

  if (isLoading) return <Spinner fullScreen />;

  return (
    <div className="min-h-screen bg-quest-950 flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4">
        <button
          onClick={() => navigate("/play")}
          className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <p className="font-body text-xs text-slate-400">Chapter {chapter?.order}</p>
          <h1 className="font-display text-xl text-white">
            {chapter?.title || "Loading..."}
          </h1>
        </div>
      </header>

      {/* Scene viewer */}
      <main className="flex-1 px-6 pb-8 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {!scenesComplete && (
            <motion.div
              key="scenes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full"
            >
              <SceneViewer
                scenes={SEED_SCENES}
                onComplete={handleScenesComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ChapterPage;