import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import Editor from "@monaco-editor/react";
import { METAPHOR_COMPONENTS } from "@/components/visual-metaphors";
import { generateCode } from "@/lib/codeGenerator";
import Button from "@/components/ui/Button";
import { clsx } from "clsx";

const OUTPUT_STATES = {
  idle:    { label: "Output",     color: "text-slate-400" },
  running: { label: "Running...", color: "text-gold-400" },
  success: { label: "Output",     color: "text-emerald-400" },
  error:   { label: "Error",      color: "text-coral-400" },
};

const LessonLayout = ({
  task,
  onRunCode,
  isRunning,
  outputResult,
  children,
}) => {
  const [metaphorState, setMetaphorState] = useState({});
  const [outputOpen, setOutputOpen] = useState(false);
  const [code, setCode] = useState("");

  const handleMetaphorChange = useCallback((newState) => {
    setMetaphorState(newState);
    if (task?.type === "visual" && task?.visualMetaphor) {
      const generated = generateCode(task.visualMetaphor, newState);
      setCode(generated);
    }
  }, [task]);

  const outputStatus = isRunning
    ? "running"
    : outputResult?.isError
      ? "error"
      : outputResult
        ? "success"
        : "idle";

  const MetaphorComponent = task?.visualMetaphor
    ? METAPHOR_COMPONENTS[task.visualMetaphor]
    : null;

  return (
    // Use h-full instead of h-screen — fills whatever the parent gives it
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden">

      {/* Main split area — takes all remaining space above output */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Left panel */}
        <div className="w-1/2 border-r border-slate-700 overflow-y-auto bg-white">
          {MetaphorComponent ? (
            <MetaphorComponent
              onStateChange={handleMetaphorChange}
              initialState={task?.visualConfig || {}}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 font-body">
              No visual metaphor configured for this task.
            </div>
          )}
          {children && (
            <div className="border-t border-slate-200 p-4">
              {children}
            </div>
          )}
        </div>

        {/* Right panel */}
        {/* min-h-0 is critical — without it flex children won't shrink below content size */}
        <div className="w-1/2 flex flex-col min-h-0">

          {/* Editor header */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700 flex-shrink-0">
            <span className="font-code text-xs text-slate-400">main.py</span>
            <button
              onClick={() => {
                if (task?.visualMetaphor) {
                  setCode(generateCode(task.visualMetaphor, metaphorState));
                }
              }}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Reset code"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Monaco editor — flex-1 with min-h-0 so it shrinks correctly */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <Editor
              height="100%"
              language="python"
              value={code}
              onChange={(val) => setCode(val || "")}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: "JetBrains Mono, Fira Code, monospace",
                minimap: { enabled: false },
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                wordWrap: "on",
                readOnly: task?.type === "visual",
                padding: { top: 16, bottom: 16 },
                renderLineHighlight: "gutter",
                smoothScrolling: true,
              }}
            />
          </div>

          {/* Run button — flex-shrink-0 so it is never squeezed out */}
          <div className="flex-shrink-0 px-4 py-3 bg-slate-900 border-t border-slate-700">
            <Button
              onClick={() => {
                setOutputOpen(true);
                onRunCode(code);
              }}
              isLoading={isRunning}
              disabled={!code.trim()}
              className="w-full"
              size="md"
            >
              <Play className="w-4 h-4" />
              Run code
            </Button>
          </div>
        </div>
      </div>

      {/* Output panel */}
      <AnimatePresence>
        {outputOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 200 }}
            exit={{ height: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="flex-shrink-0 bg-slate-900 border-t border-slate-700 overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 flex-shrink-0">
              <span className={`font-code text-xs font-600 ${OUTPUT_STATES[outputStatus].color}`}>
                {OUTPUT_STATES[outputStatus].label}
              </span>
              <button
                onClick={() => setOutputOpen(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              {isRunning ? (
                <div className="flex items-center gap-2 text-gold-400 font-code text-sm">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full"
                  />
                  Executing...
                </div>
              ) : outputResult ? (
                <pre className={`font-code text-sm whitespace-pre-wrap ${
                  outputResult.isError ? "text-coral-400" : "text-emerald-300"
                }`}>
                  {outputResult.output || outputResult.error || "No output"}
                </pre>
              ) : (
                <p className="font-code text-slate-500 text-sm">
                  Run your code to see the output here.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Output toggle bar when panel is closed */}
      {!outputOpen && outputResult && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setOutputOpen(true)}
          className={clsx(
            "flex-shrink-0 flex items-center justify-center gap-2 py-2 font-code text-xs border-t transition-colors",
            outputResult.isError
              ? "bg-coral-950 border-coral-800 text-coral-400 hover:bg-coral-900"
              : "bg-emerald-950 border-emerald-800 text-emerald-400 hover:bg-emerald-900"
          )}
        >
          <ChevronUp className="w-3 h-3" />
          {outputResult.isError ? "Show error" : "Show output"}
        </motion.button>
      )}
    </div>
  );
};

export default LessonLayout;