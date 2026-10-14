import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Download,
  Trash2,
  Lock,
  ChevronRight,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { useKindred } from "../core/context";
import { CompanionOrb } from "../components/CompanionOrb";
import { ORB_PALETTES, getSliderLabels } from "../core/persona/personaConfig";
import { OrbColorId } from "../core/types";
import { REGISTERED_MODULES, RegisteredModule } from "../modules/registry";
import { AdultModeModal } from "../modules/adultMode";

export const SettingsScreen: React.FC = () => {
  const {
    persona,
    updatePersona,
    profile,
    updateProfile,
    clearAllData,
    exportData,
    clearConversation,
  } = useKindred();

  // Selected module for modal
  const [selectedModule, setSelectedModule] = useState<RegisteredModule | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isClearChatModalOpen, setIsClearChatModalOpen] = useState(false);

  // Persona edit states
  const [name, setName] = useState(persona.name);
  const [userName, setUserName] = useState(profile.name);
  const [warmth, setWarmth] = useState(persona.warmth);
  const [energy, setEnergy] = useState(persona.energy);
  const [talkativeness, setTalkativeness] = useState(persona.talkativeness);
  const [orbColor, setOrbColor] = useState<OrbColorId>(persona.orbColorId);
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSaveCompanion = () => {
    updatePersona({
      name: name.trim() || "Rowan",
      warmth,
      energy,
      talkativeness,
      orbColorId: orbColor,
    });
    if (userName.trim()) {
      updateProfile({ name: userName.trim() });
    }
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2400);
  };

  const warmthLabels = getSliderLabels("warmth", warmth);
  const energyLabels = getSliderLabels("energy", energy);
  const talkLabels = getSliderLabels("talkativeness", talkativeness);

  const adultModule = REGISTERED_MODULES.find((m) => m.id === "adult_mode_18") || REGISTERED_MODULES[0];

  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-8 py-8 pb-24 md:pb-12 space-y-10">
      {/* Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C7E72]">
          <SlidersHorizontal className="w-4 h-4 text-[#CDBDF5]" />
          <span>Preferences & Control</span>
        </div>
        <h1 className="font-editorial text-2xl sm:text-3xl font-medium text-[#2C2622]">
          Settings
        </h1>
        <p className="text-sm text-[#7A6F65]">
          Manage your companion's traits, personal privacy, and modular extensions.
        </p>
      </div>

      {/* SECTION 1: COMPANION CUSTOMIZATION */}
      <section className="bg-white border border-[#ECE5DD] rounded-[24px] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE3]">
          <div>
            <h2 className="font-editorial text-xl font-medium text-[#2C2622]">
              Companion Calibration
            </h2>
            <p className="text-xs text-[#7A6F65] mt-0.5">
              Tune your companion's presence to fit your current season of life.
            </p>
          </div>
          <CompanionOrb colorId={orbColor} size="md" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Companion Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="settings-companion-name"
              className="block text-xs font-semibold text-[#5C5248] uppercase tracking-wider"
            >
              Companion's Name
            </label>
            <input
              id="settings-companion-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E6DDD2] text-sm text-[#2C2622] focus:ring-1 focus:ring-[#CDBDF5]"
            />
          </div>

          {/* User Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="settings-user-name"
              className="block text-xs font-semibold text-[#5C5248] uppercase tracking-wider"
            >
              What they call you
            </label>
            <input
              id="settings-user-name"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E6DDD2] text-sm text-[#2C2622] focus:ring-1 focus:ring-[#CDBDF5]"
            />
          </div>
        </div>

        {/* Avatar Color */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#5C5248] uppercase tracking-wider">
            Presence Orb Atmosphere
          </label>
          <div className="flex items-center gap-2.5 overflow-x-auto py-1">
            {Object.values(ORB_PALETTES).map((pal) => (
              <button
                key={pal.id}
                type="button"
                onClick={() => setOrbColor(pal.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  orbColor === pal.id
                    ? "bg-[#FAF7F2] border-[#2C2622] text-[#2C2622] shadow-xs"
                    : "bg-[#FAF8F5] border-[#E6DDD2] text-[#7A6F65] hover:bg-[#F2ECE3]"
                }`}
              >
                <div
                  className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
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
              aria-label="Companion warmth versus wit"
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
              aria-label="Companion calm versus energetic"
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
              aria-label="Companion listener versus talker"
              className="w-full accent-[#CDBDF5] cursor-pointer h-2 bg-[#EFE9E0] rounded-lg"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedNotification ? (
            <span className="text-xs font-semibold text-[#5A876B]">
              Preferences saved smoothly.
            </span>
          ) : (
            <span className="text-xs text-[#9A8E83]">Changes apply immediately to next conversation.</span>
          )}
          <button
            type="button"
            onClick={handleSaveCompanion}
            className="px-5 py-2.5 rounded-xl bg-[#2C2622] text-[#FBF9F6] text-xs font-semibold hover:bg-[#3D352F] transition-all cursor-pointer"
          >
            Save changes
          </button>
        </div>
      </section>

      {/* SECTION 2: OPTIONAL MODULES (Feature flag architecture demo) */}
      <section className="bg-white border border-[#ECE5DD] rounded-[24px] p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <h2 className="font-editorial text-xl font-medium text-[#2C2622]">
            Optional Modules
          </h2>
          <p className="text-xs text-[#7A6F65] mt-0.5">
            Kindred's core is decoupled from optional extensions through an isolated feature-flag registry.
          </p>
        </div>

        {/* Adult Mode (18+) Card */}
        <div
          onClick={() => setSelectedModule(adultModule)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setSelectedModule(adultModule)}
          className="group p-5 rounded-[20px] bg-[#FAF8F5] border border-[#E6DDD2] hover:border-[#DACFC2] hover:bg-[#F7F4EF] transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CDBDF5]"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#EBE4DC] flex items-center justify-center shrink-0 text-[#6E6359] group-hover:text-[#2C2622] transition-colors">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial text-base font-semibold text-[#2C2622]">
                  {adultModule.name}
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 bg-[#EFE8DF] text-[#6E6359] rounded-md tracking-wider">
                  LOCKED
                </span>
              </div>
              <p className="text-xs text-[#7A6F65] mt-1 leading-relaxed max-w-lg">
                {adultModule.summary}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8C7E72] group-hover:text-[#2C2622] transition-colors shrink-0 self-end sm:self-center">
            <span>View Architecture Notice</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        <p className="text-[11px] text-[#9A8E83]">
          New modules can be added by registering a configuration definition without altering core chat or memory subsystems.
        </p>
      </section>

      {/* SECTION 3: PRIVACY & DATA SOVEREIGNTY */}
      <section className="bg-white border border-[#ECE5DD] rounded-[24px] p-6 sm:p-8 shadow-xs space-y-5">
        <div>
          <h2 className="font-editorial text-xl font-medium text-[#2C2622]">
            Privacy & Data Sovereignty
          </h2>
          <p className="text-xs text-[#7A6F65] mt-0.5">
            Your data is never trapped. You can export or destroy your local records at any moment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Export Data */}
          <button
            type="button"
            onClick={exportData}
            className="flex items-center justify-between p-4 rounded-xl border border-[#ECE5DD] bg-[#FAF8F5] hover:bg-[#F2ECE3] hover:border-[#DACFC2] text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CDBDF5]"
          >
            <div>
              <span className="font-medium text-sm text-[#2C2622] flex items-center gap-2">
                <Download className="w-4 h-4 text-[#7A6F65]" />
                Export my data
              </span>
              <p className="text-xs text-[#7A6F65] mt-0.5">
                Download a clean JSON archive of all chats and memories.
              </p>
            </div>
          </button>

          {/* Clear Current Chat */}
          <button
            type="button"
            onClick={() => setIsClearChatModalOpen(true)}
            className="flex items-center justify-between p-4 rounded-xl border border-[#ECE5DD] bg-[#FAF8F5] hover:bg-[#F2ECE3] hover:border-[#DACFC2] text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CDBDF5]"
          >
            <div>
              <span className="font-medium text-sm text-[#2C2622] flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#7A6F65]" />
                Clear current chat
              </span>
              <p className="text-xs text-[#7A6F65] mt-0.5">
                Reset chat view while keeping saved memory cards intact.
              </p>
            </div>
          </button>
        </div>

        {/* Delete All Data */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="w-full p-4 rounded-xl border border-[#F5D8D0] bg-[#FFF8F6] hover:bg-[#FDECEB] text-left transition-all cursor-pointer group flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7B9C8]"
          >
            <div>
              <span className="font-medium text-sm text-[#A74444] flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete all data
              </span>
              <p className="text-xs text-[#8C6D68] mt-0.5">
                Permanently purge companion personality, memories, and chat logs from this browser.
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* Adult Mode Modal */}
      <AdultModeModal
        module={selectedModule}
        isOpen={Boolean(selectedModule)}
        onClose={() => setSelectedModule(null)}
      />

      {/* Delete All Data Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="fixed inset-0 bg-[#231E1A]/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white border border-[#ECE5DD] rounded-[24px] p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="w-10 h-10 rounded-full bg-[#FCEBE7] flex items-center justify-center text-[#C85A5A]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-editorial text-xl font-medium text-[#2C2622]">
                  Delete all stored data?
                </h3>
                <p className="text-xs text-[#7A6F65] mt-1.5 leading-relaxed">
                  This will completely clear your companion setup, all remembered facts, and conversation transcripts from your browser. This action cannot be reversed.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#7A6F65] hover:text-[#2C2622]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clearAllData();
                    setIsDeleteModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#A74444] text-white hover:bg-[#923838] transition-colors"
                >
                  Yes, delete everything
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Clear Chat Confirmation Modal */}
      <AnimatePresence>
        {isClearChatModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsClearChatModalOpen(false)}
              className="fixed inset-0 bg-[#231E1A]/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white border border-[#ECE5DD] rounded-[24px] p-6 shadow-2xl z-10 space-y-4"
            >
              <h3 className="font-editorial text-xl font-medium text-[#2C2622]">
                Clear conversation?
              </h3>
              <p className="text-xs text-[#7A6F65] leading-relaxed">
                This will clear the current conversation screen for a fresh start. What your companion remembers about you on the Memory tab will remain safely intact.
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsClearChatModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#7A6F65] hover:text-[#2C2622]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clearConversation();
                    setIsClearChatModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2C2622] text-[#FBF9F6] hover:bg-[#3D352F] transition-colors"
                >
                  Clear conversation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
