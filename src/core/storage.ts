import { MemoryItem, Message, Persona, UserProfile } from "./types";
import { DEFAULT_PERSONA } from "./persona/personaConfig";

const STORAGE_KEYS = {
  PROFILE: "kindred_user_profile_v1",
  PERSONA: "kindred_persona_v1",
  MEMORIES: "kindred_memories_v1",
  MESSAGES: "kindred_messages_v1",
  CURRENT_MOOD: "kindred_current_mood_v1",
};

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: "",
  goals: ["someone_to_talk_to", "reflection"],
  onboarded: false,
  consentAccepted: false,
};

export const INITIAL_SEEDED_MEMORIES: MemoryItem[] = [
  {
    id: "mem_welcome_1",
    content: "Prefers quiet mornings and feels most centered when journaling or sipping tea.",
    createdAt: Date.now() - 86400000 * 2,
    isManual: false,
  },
  {
    id: "mem_welcome_2",
    content: "Appreciates honest, thoughtful conversations without rushed answers.",
    createdAt: Date.now() - 86400000,
    isManual: false,
  },
];

export function getStoredProfile(): UserProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return data ? JSON.parse(data) : DEFAULT_USER_PROFILE;
  } catch {
    return DEFAULT_USER_PROFILE;
  }
}

export function saveStoredProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error("Failed to save profile:", e);
  }
}

export function getStoredPersona(): Persona {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PERSONA);
    return data ? JSON.parse(data) : DEFAULT_PERSONA;
  } catch {
    return DEFAULT_PERSONA;
  }
}

export function saveStoredPersona(persona: Persona): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PERSONA, JSON.stringify(persona));
  } catch (e) {
    console.error("Failed to save persona:", e);
  }
}

export function getStoredMemories(): MemoryItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MEMORIES);
    if (!data) return INITIAL_SEEDED_MEMORIES;
    return JSON.parse(data);
  } catch {
    return INITIAL_SEEDED_MEMORIES;
  }
}

export function saveStoredMemories(memories: MemoryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(memories));
  } catch (e) {
    console.error("Failed to save memories:", e);
  }
}

export function getStoredMessages(): Message[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveStoredMessages(messages: Message[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  } catch (e) {
    console.error("Failed to save messages:", e);
  }
}

export function clearAllKindredData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.PERSONA);
    localStorage.removeItem(STORAGE_KEYS.MEMORIES);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_MOOD);
  } catch (e) {
    console.error("Failed to clear data:", e);
  }
}

export function exportAllKindredData(): string {
  const exportPayload = {
    app: "Kindred",
    exportedAt: new Date().toISOString(),
    profile: getStoredProfile(),
    persona: getStoredPersona(),
    memories: getStoredMemories(),
    messages: getStoredMessages(),
    privacyNotice: "Kindred stores your information strictly on your local device. This file contains all your exported data.",
  };
  return JSON.stringify(exportPayload, null, 2);
}
