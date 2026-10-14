export type Role = "user" | "assistant";

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  moodContext?: string;
  triggeredSafety?: boolean;
}

export type OrbColorId = "peach" | "rose" | "lavender" | "dawn" | "sage";

export interface OrbPalette {
  id: OrbColorId;
  name: string;
  gradient: string; // CSS gradient
  glowColor: string;
  accentBg: string;
  previewColor: string;
}

export interface Persona {
  name: string;
  warmth: number; // 0 = deeply warm & nurturing, 100 = witty & playful
  energy: number; // 0 = calm & tranquil, 100 = energetic & motivating
  talkativeness: number; // 0 = listener & concise, 100 = talker & expressive
  orbColorId: OrbColorId;
}

export interface MemoryItem {
  id: string;
  content: string;
  createdAt: number;
  extractedFromMessageId?: string;
  isManual?: boolean;
}

export type MoodType = "peaceful" | "grateful" | "thoughtful" | "overwhelmed" | "tired";

export interface MoodOption {
  id: MoodType;
  label: string;
  subtleColor: string;
  bgAtmosphere: string;
  description: string;
}

export interface UserProfile {
  name: string;
  goals: string[];
  onboarded: boolean;
  consentAccepted: boolean;
  consentTimestamp?: number;
}

export type ScreenId = "welcome" | "chat" | "memory" | "settings";

export interface ModuleDefinition {
  id: string;
  title: string;
  subtitle: string;
  isLocked: boolean;
  badgeText: string;
  complianceNote: string;
  description: string;
}
