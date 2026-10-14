/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { KindredProvider, useKindred } from "./core/context";
import { Atmosphere } from "./components/Atmosphere";
import { Navigation } from "./components/Navigation";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { ChatScreen } from "./components/ChatScreen";
import { MemoryScreen } from "./components/MemoryScreen";
import { SettingsScreen } from "./settings/SettingsScreen";

const KindredApp: React.FC = () => {
  const {
    profile,
    persona,
    activeMood,
    activeScreen,
    setActiveScreen,
    isThinking,
    completeOnboarding,
  } = useKindred();

  // If user hasn't completed onboarding, render the 3-step onboarding flow
  if (!profile.onboarded) {
    return (
      <main className="min-h-screen relative flex items-center justify-center">
        <Atmosphere mood="peaceful" />
        <WelcomeScreen onComplete={completeOnboarding} />
      </main>
    );
  }

  // Page transition animation curve
  const pageVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  };

  const pageTransition = {
    duration: 0.35,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <div className="min-h-screen relative flex flex-col md:flex-row bg-[#FBF9F6] text-[#2C2622]">
      {/* Background Atmosphere Blobs */}
      <Atmosphere mood={activeMood} />

      {/* Navigation (Left Rail on Desktop, Bottom Bar on Mobile) */}
      <Navigation
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
        companionName={persona.name}
        orbColorId={persona.orbColorId}
        isThinking={isThinking}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col">
        <AnimatePresence mode="wait">
          {activeScreen === "chat" && (
            <motion.div
              key="screen-chat"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="flex-1 flex flex-col h-full"
            >
              <ChatScreen />
            </motion.div>
          )}

          {activeScreen === "memory" && (
            <motion.div
              key="screen-memory"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="flex-1 overflow-y-auto"
            >
              <MemoryScreen />
            </motion.div>
          )}

          {activeScreen === "settings" && (
            <motion.div
              key="screen-settings"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="flex-1 overflow-y-auto"
            >
              <SettingsScreen />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <KindredProvider>
      <KindredApp />
    </KindredProvider>
  );
}
