// The main lesson experience.
// Stage 1: kid interacts with the visual, code updates live, kid hits Run.
// Later stages are wired in Steps 13-16.

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star, CheckCircle } from "lucide-react";
import LessonLayout from "@/components/lesson/LessonLayout";
import { executeCode } from "@/services/judge0Service";
import useAuthStore from "@/store/authStore";
import useToast from "@/hooks/useToast";

// Seed task for development — replaced by real DB tasks in later steps
const SEED_TASK = {
  _id: "task_seed_1",
  type: "visual",
  visualMetaphor: "variable",
  visualConfig: { name: "score", value: "42", valueType: "integer" },
  instruction: "Use the box on the left to create a variable called 'score' and set it to any number you like. Then hit Run to see it in action!",
  expectedOutput: null, // Stage 1 accepts any valid output
  solutionCode: "score = 42\nprint(score)",
};

const LessonPage = () => {
  const { id: lessonId } = useParams();
  const navigate = useNavigate();
  const { currentChild } = useAuthStore();
  const toast = useToast();

  const [outputResult, setOutputResult] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  // Execute code via Judge0 (stub for now, real in Step 12)
  const { mutate: runCode, isPending: isRunning } = useMutation({
    mutationFn: executeCode,
    onSuccess: (data) => {
      setOutputResult(data.data);

      // Stage 1 validation: any successful execution counts as a pass
      if (!data.data.isError) {
        setTimeout(() => {
          setIsComplete(true);
        }, 1500);
      }
    },
    onError: () => {
      toast.error("Could not execute code. Please try again.");
    },
  });

  const handleRunCode = (code) => {
    setOutputResult(null);
    runCode(code);
  };

  const handleContinue = () => {
    navigate("/play");
  };

  return (
    <div className="relative h-screen flex flex-col">
      {/* Lesson header */}
      <div className="flex items-center gap-4 px-6 py-3 bg-slate-900 border-b border-slate-700 z-10">
        <button
          onClick={() => navigate("/play")}
          className="p-2 rounded-xl hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex-1">
          <p className="font-body text-xs text-slate-400">
            Stage 1 — Visual Coder
          </p>
          <p className="font-display text-sm text-white">
            {SEED_TASK.instruction}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-gold-500/20 px-3 py-1.5 rounded-xl">
          <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
          <span className="font-display text-sm text-gold-300">
            {currentChild?.points || 0}
          </span>
        </div>
      </div>

      {/* Lesson layout */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <LessonLayout
          task={SEED_TASK}
          onRunCode={handleRunCode}
          isRunning={isRunning}
          outputResult={outputResult}
        />
      </div>

      {/* Success overlay */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white rounded-4xl p-8 text-center max-w-sm mx-4 shadow-quest-lg"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>

              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />

              <h2 className="font-display text-3xl text-slate-800 mb-2">
                You did it!
              </h2>
              <p className="font-body text-slate-500 text-sm mb-6">
                Your code ran successfully. You are a real programmer!
              </p>

              <div className="flex items-center justify-center gap-2 bg-gold-100 rounded-2xl py-3 mb-6">
                <Star className="w-5 h-5 text-gold-500 fill-gold-500" />
                <span className="font-display text-gold-700">+10 points earned</span>
              </div>

              <button
                onClick={handleContinue}
                className="w-full bg-quest-600 hover:bg-quest-700 text-white font-display text-lg py-4 rounded-2xl transition-colors"
              >
                Continue adventure
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LessonPage;