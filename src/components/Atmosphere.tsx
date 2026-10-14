import React from "react";
import { motion } from "motion/react";
import { MoodType } from "../core/types";

interface AtmosphereProps {
  mood?: MoodType;
}

export const Atmosphere: React.FC<AtmosphereProps> = ({ mood = "peaceful" }) => {
  // Subtly adjust blob opacities and tints based on mood
  const getMoodAura = () => {
    switch (mood) {
      case "peaceful":
        return {
          blob1: "bg-[#FFD8C2]/45",
          blob2: "bg-[#F7B9C8]/40",
          blob3: "bg-[#CDBDF5]/40",
        };
      case "thoughtful":
        return {
          blob1: "bg-[#D8D4F7]/45",
          blob2: "bg-[#CDBDF5]/50",
          blob3: "bg-[#E2DEFA]/40",
        };
      case "grateful":
        return {
          blob1: "bg-[#FFE0CE]/55",
          blob2: "bg-[#FAD0B6]/45",
          blob3: "bg-[#F7B9C8]/40",
        };
      case "overwhelmed":
        return {
          blob1: "bg-[#FCE8ED]/50",
          blob2: "bg-[#F9D2DC]/45",
          blob3: "bg-[#EADBFA]/40",
        };
      case "tired":
        return {
          blob1: "bg-[#EFEAE2]/50",
          blob2: "bg-[#E6DEFC]/35",
          blob3: "bg-[#F0E6DD]/40",
        };
      default:
        return {
          blob1: "bg-[#FFD8C2]/45",
          blob2: "bg-[#F7B9C8]/40",
          blob3: "bg-[#CDBDF5]/40",
        };
    }
  };

  const aura = getMoodAura();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden -z-10 bg-[#FBF9F6]"
    >
      {/* Blob 1: Top-left / soft peach-rose drift */}
      <motion.div
        animate={{
          x: [0, 45, -30, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.08, 0.95, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full blur-[110px] transition-colors duration-1000 ${aura.blob1}`}
      />

      {/* Blob 2: Right-center / soft rose-lavender drift */}
      <motion.div
        animate={{
          x: [0, -50, 40, 0],
          y: [0, 45, -35, 0],
          scale: [1, 0.94, 1.06, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className={`absolute top-1/4 -right-28 w-[580px] h-[580px] rounded-full blur-[120px] transition-colors duration-1000 ${aura.blob2}`}
      />

      {/* Blob 3: Bottom-center / lavender drift */}
      <motion.div
        animate={{
          x: [0, 35, -45, 0],
          y: [0, -35, 25, 0],
          scale: [1, 1.05, 0.97, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        className={`absolute -bottom-40 left-1/3 w-[620px] h-[620px] rounded-full blur-[130px] transition-colors duration-1000 ${aura.blob3}`}
      />

      {/* Subtle fine paper texture overlay for warmth */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay bg-[radial-gradient(#2C2622_1px,transparent_1px)] [background-size:16px_16px]" />
    </div>
  );
};
