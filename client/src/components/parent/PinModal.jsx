// Shown when the parent tries to switch to a child profile
// and a PIN is required.

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock } from "lucide-react";
import Button from "@/components/ui/Button";
import { clsx } from "clsx";

const PinModal = ({ isOpen, onClose, onSubmit, isLoading, error }) => {
  const [pin, setPin] = useState(["", "", "", ""]);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (isOpen) {
      setPin(["", "", "", ""]);
      setTimeout(() => inputRefs[0].current?.focus(), 100);
    }
  }, [isOpen]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);

    // Auto advance to next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto submit when all 4 digits are entered
    if (index === 3 && value) {
      const fullPin = [...newPin].join("");
      if (fullPin.length === 4) {
        onSubmit(fullPin);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-4xl shadow-quest-lg w-full max-w-sm pointer-events-auto p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-quest-100 rounded-2xl flex items-center justify-center">
                    <Lock className="w-5 h-5 text-quest-600" />
                  </div>
                  <h2 className="font-display text-xl text-slate-800">
                    Enter your PIN
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="font-body text-sm text-slate-500 mb-6 text-center">
                Enter your 4-digit profile switch PIN
              </p>

              {/* PIN input boxes */}
              <div className="flex gap-3 justify-center mb-6">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={clsx(
                      "w-14 h-14 text-center text-2xl font-display rounded-2xl border-2 outline-none transition-all",
                      error
                        ? "border-coral-400 bg-coral-50"
                        : digit
                          ? "border-quest-400 bg-quest-50"
                          : "border-slate-200 focus:border-quest-400 focus:ring-2 focus:ring-quest-100"
                    )}
                  />
                ))}
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-coral-500 text-sm text-center font-body mb-4"
                >
                  {error}
                </motion.p>
              )}

              <Button
                onClick={() => onSubmit(pin.join(""))}
                isLoading={isLoading}
                disabled={pin.join("").length < 4}
                className="w-full"
              >
                Confirm
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PinModal;