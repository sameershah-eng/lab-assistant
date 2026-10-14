import React from "react";
import { motion } from "motion/react";
import { OrbColorId } from "../core/types";
import { ORB_PALETTES } from "../core/persona/personaConfig";

interface CompanionOrbProps {
  colorId?: OrbColorId;
  size?: "sm" | "md" | "lg" | "xl";
  isThinking?: boolean;
  className?: string;
  onClick?: () => void;
}

export const CompanionOrb: React.FC<CompanionOrbProps> = ({
  colorId = "dawn",
  size = "md",
  isThinking = false,
  className = "",
  onClick,
}) => {
  const palette = ORB_PALETTES[colorId] || ORB_PALETTES.dawn;

  const sizeDimensions = {
    sm: "w-8 h-8",
    md: "w-14 h-14",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
  };

  const glowSizes = {
    sm: "blur-md -inset-1",
    md: "blur-lg -inset-2",
    lg: "blur-xl -inset-3",
    xl: "blur-2xl -inset-4",
  };

  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-center shrink-0 ${sizeDimensions[size]} ${className}`}
      role="img"
      aria-label={`${palette.name} companion presence orb${isThinking ? ", currently thinking" : ""}`}
    >
      {/* Outer ambient glow */}
      <motion.div
        animate={
          isThinking
            ? {
                scale: [1, 1.25, 0.98, 1.2],
                opacity: [0.65, 0.95, 0.6, 0.95],
              }
            : {
                scale: [1, 1.08, 1],
                opacity: [0.45, 0.65, 0.45],
              }
        }
        transition={
          isThinking
            ? {
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
              }
            : {
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
        className={`absolute rounded-full pointer-events-none transition-colors duration-700 ${glowSizes[size]}`}
        style={{
          background: palette.gradient,
        }}
      />

      {/* Main Core Orb */}
      <motion.div
        animate={
          isThinking
            ? {
                scale: [1, 1.07, 0.96, 1.05, 1],
                rotate: [0, 90, 180, 270, 360],
              }
            : {
                scale: [1, 1.04, 1],
                rotate: [0, 15, -10, 0],
              }
        }
        transition={
          isThinking
            ? {
                scale: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              }
            : {
                scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 24, repeat: Infinity, ease: "easeInOut" },
              }
        }
        className="relative w-full h-full rounded-full overflow-hidden shadow-inner cursor-pointer"
        style={{
          background: palette.gradient,
          boxShadow: `
            inset 0 2px 4px rgba(255, 255, 255, 0.8),
            inset 0 -4px 8px rgba(0, 0, 0, 0.08),
            0 4px 14px ${palette.glowColor}
          `,
        }}
      >
        {/* Soft specular highlight for depth */}
        <div className="absolute top-[12%] left-[18%] w-[38%] h-[32%] rounded-full bg-white/50 blur-[2px] pointer-events-none" />

        {/* Inner floating light shimmer */}
        <motion.div
          animate={{
            x: ["-20%", "20%", "-20%"],
            y: ["-10%", "15%", "-10%"],
            opacity: isThinking ? [0.6, 0.9, 0.6] : [0.3, 0.55, 0.3],
          }}
          transition={{
            duration: isThinking ? 2 : 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-radial from-white/70 via-transparent to-transparent pointer-events-none"
        />
      </motion.div>
    </div>
  );
};
