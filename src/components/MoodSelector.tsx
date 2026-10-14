import React from "react";
import { MoodType } from "../core/types";

interface MoodSelectorProps {
  activeMood: MoodType;
  onSelectMood: (mood: MoodType) => void;
}

const MOODS: Array<{ id: MoodType; label: string; helper: string }> = [
  { id: "peaceful", label: "Peaceful", helper: "Steady & grounded" },
  { id: "thoughtful", label: "Thoughtful", helper: "Reflecting deeply" },
  { id: "grateful", label: "Grateful", helper: "Appreciative warmth" },
  { id: "overwhelmed", label: "Overwhelmed", helper: "Seeking gentle space" },
  { id: "tired", label: "Low Energy", helper: "Quiet presence" },
];

export const MoodSelector: React.FC<MoodSelectorProps> = ({ activeMood, onSelectMood }) => {
  return (
    <div className="w-full flex items-center justify-between gap-1.5 py-1.5 px-2 bg-white/70 backdrop-blur-xs border border-[#ECE5DD] rounded-xl text-xs">
      <span className="text-[#8C7E72] font-medium hidden sm:inline-block px-1.5 text-[11px] tracking-wide uppercase">
        Mood check-in
      </span>
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto justify-start sm:justify-end">
        {MOODS.map((mood) => {
          const isSelected = activeMood === mood.id;
          return (
            <button
              key={mood.id}
              type="button"
              onClick={() => onSelectMood(mood.id)}
              title={mood.helper}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CDBDF5] cursor-pointer ${
                isSelected
                  ? "bg-[#2C2622] text-[#FBF9F6] shadow-xs"
                  : "text-[#6E6359] hover:text-[#2C2622] hover:bg-[#F2ECE3]"
              }`}
            >
              {mood.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
