import { OrbColorId, OrbPalette, Persona } from "../types";

export const ORB_PALETTES: Record<OrbColorId, OrbPalette> = {
  dawn: {
    id: "dawn",
    name: "Dawn Horizon",
    gradient: "linear-gradient(135deg, #FFD8C2 0%, #F7B9C8 50%, #CDBDF5 100%)",
    glowColor: "rgba(247, 185, 200, 0.45)",
    accentBg: "from-[#FFD8C2]/40 via-[#F7B9C8]/30 to-[#CDBDF5]/40",
    previewColor: "#F7B9C8",
  },
  peach: {
    id: "peach",
    name: "Warm Peach",
    gradient: "linear-gradient(135deg, #FFE2D1 0%, #FFD8C2 50%, #F7C5B0 100%)",
    glowColor: "rgba(255, 216, 194, 0.5)",
    accentBg: "from-[#FFE2D1]/40 via-[#FFD8C2]/30 to-[#F7C5B0]/30",
    previewColor: "#FFD8C2",
  },
  rose: {
    id: "rose",
    name: "Tender Rose",
    gradient: "linear-gradient(135deg, #FDE2E8 0%, #F7B9C8 50%, #EDA3B5 100%)",
    glowColor: "rgba(247, 185, 200, 0.5)",
    accentBg: "from-[#FDE2E8]/40 via-[#F7B9C8]/30 to-[#EDA3B5]/30",
    previewColor: "#F7B9C8",
  },
  lavender: {
    id: "lavender",
    name: "Serene Lavender",
    gradient: "linear-gradient(135deg, #E6DCFA 0%, #CDBDF5 50%, #B9A4EA 100%)",
    glowColor: "rgba(205, 189, 245, 0.5)",
    accentBg: "from-[#E6DCFA]/40 via-[#CDBDF5]/30 to-[#B9A4EA]/30",
    previewColor: "#CDBDF5",
  },
  sage: {
    id: "sage",
    name: "Quiet Sage",
    gradient: "linear-gradient(135deg, #E2ECE5 0%, #C8DACF 50%, #B4CBBF 100%)",
    glowColor: "rgba(200, 218, 207, 0.5)",
    accentBg: "from-[#E2ECE5]/40 via-[#C8DACF]/30 to-[#B4CBBF]/30",
    previewColor: "#C8DACF",
  },
};

export const DEFAULT_PERSONA: Persona = {
  name: "Rowan",
  warmth: 30, // 0-100: leans towards warm & nurturing
  energy: 25, // 0-100: leans towards calm & grounded
  talkativeness: 35, // 0-100: attentive listener
  orbColorId: "dawn",
};

export const GOAL_OPTIONS = [
  { id: "someone_to_talk_to", label: "Someone to talk to" },
  { id: "daily_checkins", label: "Daily check-ins" },
  { id: "motivation", label: "Motivation & focus" },
  { id: "reflection", label: "Gentle reflection" },
];

export function getSliderLabels(trait: "warmth" | "energy" | "talkativeness", value: number) {
  if (trait === "warmth") {
    if (value < 35) return { left: "Deeply warm", right: "Witty & playful", current: "Tender, nurturing & gentle" };
    if (value > 65) return { left: "Deeply warm", right: "Witty & playful", current: "Playful, witty & sharp" };
    return { left: "Deeply warm", right: "Witty & playful", current: "Harmonious warmth with gentle wit" };
  }
  if (trait === "energy") {
    if (value < 35) return { left: "Calm & tranquil", right: "Energetic & bright", current: "Peaceful, grounded & soothing" };
    if (value > 65) return { left: "Calm & tranquil", right: "Energetic & bright", current: "Uplifting, vibrant & encouraging" };
    return { left: "Calm & tranquil", right: "Energetic & bright", current: "Steady, attentive & relaxed" };
  }
  // talkativeness
  if (value < 35) return { left: "Deep listener", right: "Expressive talker", current: "Patient listener, concise questions" };
  if (value > 65) return { left: "Deep listener", right: "Expressive talker", current: "Thoughtful talker, shares rich reflections" };
  return { left: "Deep listener", right: "Expressive talker", current: "Balanced flow of listening and speaking" };
}
