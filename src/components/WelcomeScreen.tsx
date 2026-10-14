import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, ShieldCheck, HeartHandshake, Database } from "lucide-react";
import { CompanionOrb } from "./CompanionOrb";
import { GOAL_OPTIONS, ORB_PALETTES, getSliderLabels } from "../core/persona/personaConfig";
import { OrbColorId, Persona } from "../core/types";

interface WelcomeScreenProps {
  onComplete: (name: string, goals: string[], companionPersona: Persona) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 state
  const [userName, setUserName] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["someone_to_talk_to", "reflection"]);

  // Step 2 state: companion creation
  const [companionName, setCompanionName] = useState("Rowan");
  const [warmth, setWarmth] = useState(30);
  const [energy, setEnergy] = useState(25);
  const [talkativeness, setTalkativeness] = useState(35);
  const [orbColor, setOrbColor] = useState<OrbColorId>("dawn");

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((g) => g !== id) : prev) : [...prev, id]
    );
  };

  const handleFinish = () => {
    const finalPersona: Persona = {
      name: companionName.trim() || "Rowan",
      warmth,
      energy,
      talkativeness,
      orbColorId: orbColor,
    };
    onComplete(userName.trim() || "Friend", selectedGoals, finalPersona);
  };

  const warmthLabels = getSliderLabels("warmth", warmth);
  const energyLabels = getSliderLabels("energy", energy);
  const talkLabels = getSliderLabels("talkativeness", talkativeness);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 max-w-2xl mx-auto w-full">
      {/* Header Brand */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center text-center mb-6"
      >
        <span className="font-editorial text-2xl sm:text-3xl font-medium tracking-tight text-[#2C2622]">
          Kindred
        </span>
        <span className="text-xs uppercase tracking-widest text-[#8C7E72] mt-1 font-medium">
          A Calm Companion
        </span>
      </motion.div>

      {/* Progress Line */}
      <div className="w-full max-w-md h-1 bg-[#ECE5DD] rounded-full overflow-hidden mb-8">
        <motion.div
          className="h-full bg-gradient-to-r from-[#FFD8C2] via-[#F7B9C8] to-[#CDBDF5]"
          initial={{ width: "33%" }}
          animate={{
            width: step === 1 ? "33%" : step === 2 ? "66%" : "100%",
          }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Card Container */}
      <div className="w-full bg-[#FFFFFF]/90 backdrop-blur-sm border border-[#ECE5DD] rounded-[24px] p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <AnimatePresence mode="wait">
          {/* STEP 1: Your Name & Goals */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-7"
            >
              <div>
                <span className="text-xs font-semibold text-[#8C7E72] uppercase tracking-wider">
                  Step 1 of 3
                </span>
                <h1 className="font-editorial text-2xl sm:text-3xl text-[#2C2622] mt-1">
                  What should we call you?
                </h1>
                <p className="text-sm text-[#7A6F65] mt-1.5 leading-relaxed">
                  Kindred gives you a quiet, attentive space to reflect and be yourself.
                </p>
              </div>

              {/* Name Input */}
              <div className="space-y-2">
                <label
                  htmlFor="user-name-input"
                  className="block text-xs font-semibold text-[#5C5248] uppercase tracking-wider"
                >
                  Your preferred name
                </label>
                <input
                  id="user-name-input"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Maya, Julian, Chris"
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#E6DDD2] text-[#2C2622] placeholder:text-[#AAA096] text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CDBDF5] transition-all"
                  autoFocus
                />
              </div>

              {/* What do you want from a companion */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-[#5C5248] uppercase tracking-wider">
                  What would you like from your companion?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {GOAL_OPTIONS.map((g) => {
                    const isSelected = selectedGoals.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => toggleGoal(g.id)}
                        className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CDBDF5] ${
                          isSelected
                            ? "bg-[#FAF7F2] border-[#2C2622] text-[#2C2622] shadow-xs"
                            : "bg-[#FAF8F5] border-[#E6DDD2] text-[#6E6359] hover:bg-[#F2ECE3] hover:text-[#2C2622]"
                        }`}
                      >
                        <span className="text-sm font-medium">{g.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#2C2622]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Next Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FFD8C2] via-[#F7B9C8] to-[#CDBDF5] text-[#2C2622] font-semibold text-sm shadow-sm hover:opacity-95 active:scale-97 transition-all cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Create Companion */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <div>
                <span className="text-xs font-semibold text-[#8C7E72] uppercase tracking-wider">
                  Step 2 of 3
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-[#2C2622] mt-1">
                  Design your companion
                </h2>
                <p className="text-sm text-[#7A6F65] mt-1 leading-relaxed">
                  Calibrate their persona and choose an avatar orb that feels comforting.
                </p>
              </div>

              {/* Orb Preview & Companion Name */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-[#FAF8F5] border border-[#ECE5DD]">
                <CompanionOrb colorId={orbColor} size="lg" />
                <div className="w-full space-y-1.5 text-center sm:text-left">
                  <label
                    htmlFor="companion-name-input"
                    className="block text-xs font-semibold text-[#5C5248] uppercase tracking-wider"
                  >
                    Companion's Name
                  </label>
                  <input
                    id="companion-name-input"
                    type="text"
                    value={companionName}
                    onChange={(e) => setCompanionName(e.target.value)}
                    placeholder="e.g. Rowan, Aria, Ellis"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E0D8CE] text-[#2C2622] font-medium text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CDBDF5]"
                  />
                  <span className="text-xs text-[#8C7E72] block">
                    You can rename or recalibrate anytime in Settings.
                  </span>
                </div>
              </div>

              {/* Color Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#5C5248] uppercase tracking-wider">
                  Orb Atmosphere Tint
                </label>
                <div className="flex items-center gap-3 overflow-x-auto py-1">
                  {Object.values(ORB_PALETTES).map((pal) => (
                    <button
                      key={pal.id}
                      type="button"
                      onClick={() => setOrbColor(pal.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        orbColor === pal.id
                          ? "bg-white border-[#2C2622] shadow-xs text-[#2C2622]"
                          : "bg-[#FAF8F5] border-[#E6DDD2] text-[#7A6F65] hover:bg-[#F2ECE3]"
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-black/10"
                        style={{ background: pal.gradient }}
                      />
                      <span>{pal.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Personality Sliders */}
              <div className="space-y-5 pt-2">
                {/* Warmth vs Wit */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#5C5248]">{warmthLabels.left}</span>
                    <span className="text-[#8C7E72] italic">{warmthLabels.current}</span>
                    <span className="font-medium text-[#5C5248]">{warmthLabels.right}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={warmth}
                    onChange={(e) => setWarmth(parseInt(e.target.value))}
                    aria-label="Personality warmth versus wit"
                    className="w-full accent-[#F7B9C8] cursor-pointer h-2 bg-[#EFE9E0] rounded-lg"
                  />
                </div>

                {/* Calm vs Energetic */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#5C5248]">{energyLabels.left}</span>
                    <span className="text-[#8C7E72] italic">{energyLabels.current}</span>
                    <span className="font-medium text-[#5C5248]">{energyLabels.right}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={energy}
                    onChange={(e) => setEnergy(parseInt(e.target.value))}
                    aria-label="Personality calm versus energetic"
                    className="w-full accent-[#FFD8C2] cursor-pointer h-2 bg-[#EFE9E0] rounded-lg"
                  />
                </div>

                {/* Listener vs Talker */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#5C5248]">{talkLabels.left}</span>
                    <span className="text-[#8C7E72] italic">{talkLabels.current}</span>
                    <span className="font-medium text-[#5C5248]">{talkLabels.right}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={talkativeness}
                    onChange={(e) => setTalkativeness(parseInt(e.target.value))}
                    aria-label="Personality listener versus talker"
                    className="w-full accent-[#CDBDF5] cursor-pointer h-2 bg-[#EFE9E0] rounded-lg"
                  />
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-[#6E6359] hover:text-[#2C2622] transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FFD8C2] via-[#F7B9C8] to-[#CDBDF5] text-[#2C2622] font-semibold text-sm shadow-sm hover:opacity-95 active:scale-97 transition-all cursor-pointer"
                >
                  <span>Next: Consent & Safety</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Transparent Consent Screen */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <div>
                <span className="text-xs font-semibold text-[#8C7E72] uppercase tracking-wider">
                  Step 3 of 3 · Plain Language Agreement
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-[#2C2622] mt-1">
                  How Kindred respects you
                </h2>
                <p className="text-sm text-[#7A6F65] mt-1 leading-relaxed">
                  Before we begin, we want to be completely open about what happens when you use Kindred.
                </p>
              </div>

              {/* Three Pillars */}
              <div className="space-y-3.5">
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#FAF8F5] border border-[#ECE5DD]">
                  <div className="w-8 h-8 rounded-xl bg-[#EBE4DC] flex items-center justify-center shrink-0 text-[#4A423A]">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-base font-semibold text-[#2C2622]">
                      You are talking with an AI
                    </h3>
                    <p className="text-xs text-[#6E6359] mt-0.5 leading-relaxed">
                      {companionName} is an empathetic artificial intelligence, not a human being. It will never pretend to have physical reality or deceive you. It exists to support, listen, and encourage genuine reflection in your everyday life.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#FAF8F5] border border-[#ECE5DD]">
                  <div className="w-8 h-8 rounded-xl bg-[#EBE4DC] flex items-center justify-center shrink-0 text-[#4A423A]">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-base font-semibold text-[#2C2622]">
                      Your data stays on your device
                    </h3>
                    <p className="text-xs text-[#6E6359] mt-0.5 leading-relaxed">
                      Your conversation history and memories are saved securely in your browser's private local storage. No tracking cookies or advertising profiles are attached to you.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#FAF8F5] border border-[#ECE5DD]">
                  <div className="w-8 h-8 rounded-xl bg-[#EBE4DC] flex items-center justify-center shrink-0 text-[#4A423A]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-base font-semibold text-[#2C2622]">
                      You can delete everything anytime
                    </h3>
                    <p className="text-xs text-[#6E6359] mt-0.5 leading-relaxed">
                      You maintain complete sovereignty. You can view, edit, or delete any memory cards on the Memory tab, and delete all stored conversations in Settings with one tap.
                    </p>
                  </div>
                </div>
              </div>

              {/* Single I understand button */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-[#6E6359] hover:text-[#2C2622] transition-colors order-2 sm:order-1"
                >
                  Adjust companion settings
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FFD8C2] via-[#F7B9C8] to-[#CDBDF5] text-[#2C2622] font-semibold text-sm shadow-md hover:opacity-95 active:scale-97 transition-all cursor-pointer order-1 sm:order-2"
                >
                  I understand
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
