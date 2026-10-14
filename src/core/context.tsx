import React, { createContext, useContext, useEffect, useState } from "react";
import { MemoryItem, Message, MoodType, Persona, ScreenId, UserProfile } from "./types";
import {
  clearAllKindredData,
  DEFAULT_USER_PROFILE,
  exportAllKindredData,
  getStoredMemories,
  getStoredMessages,
  getStoredPersona,
  getStoredProfile,
  saveStoredMemories,
  saveStoredMessages,
  saveStoredPersona,
  saveStoredProfile,
} from "./storage";
import { detectCrisisIntent } from "../safety/safetyRules";

interface KindredContextType {
  profile: UserProfile;
  updateProfile: (partial: Partial<UserProfile>) => void;
  persona: Persona;
  updatePersona: (partial: Partial<Persona>) => void;
  memories: MemoryItem[];
  addMemory: (content: string, isManual?: boolean) => void;
  editMemory: (id: string, content: string) => void;
  deleteMemory: (id: string) => void;
  messages: Message[];
  activeMood: MoodType;
  setActiveMood: (mood: MoodType) => void;
  activeScreen: ScreenId;
  setActiveScreen: (screen: ScreenId) => void;
  isThinking: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearConversation: () => void;
  clearAllData: () => void;
  exportData: () => void;
  completeOnboarding: (name: string, goals: string[], companionPersona: Persona) => void;
}

const KindredContext = createContext<KindredContextType | null>(null);

export const KindredProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(getStoredProfile);
  const [persona, setPersona] = useState<Persona>(getStoredPersona);
  const [memories, setMemories] = useState<MemoryItem[]>(getStoredMemories);
  const [messages, setMessages] = useState<Message[]>(getStoredMessages);
  const [activeMood, setActiveMood] = useState<MoodType>("peaceful");
  const [isThinking, setIsThinking] = useState(false);
  const [activeScreen, setActiveScreen] = useState<ScreenId>(() => {
    const saved = getStoredProfile();
    return saved.onboarded ? "chat" : "welcome";
  });

  // Sync state to localStorage on changes
  useEffect(() => {
    saveStoredProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveStoredPersona(persona);
  }, [persona]);

  useEffect(() => {
    saveStoredMemories(memories);
  }, [memories]);

  useEffect(() => {
    saveStoredMessages(messages);
  }, [messages]);

  const updateProfile = (partial: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...partial }));
  };

  const updatePersona = (partial: Partial<Persona>) => {
    setPersona((prev) => ({ ...prev, ...partial }));
  };

  const addMemory = (content: string, isManual = true) => {
    const trimmed = content.trim();
    if (!trimmed) return;
    const newItem: MemoryItem = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      content: trimmed,
      createdAt: Date.now(),
      isManual,
    };
    setMemories((prev) => [newItem, ...prev]);
  };

  const editMemory = (id: string, newContent: string) => {
    const trimmed = newContent.trim();
    if (!trimmed) return;
    setMemories((prev) =>
      prev.map((item) => (item.id === id ? { ...item, content: trimmed } : item))
    );
  };

  const deleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((item) => item.id !== id));
  };

  const completeOnboarding = (name: string, goals: string[], companionPersona: Persona) => {
    const updatedProfile: UserProfile = {
      name: name.trim() || "Friend",
      goals,
      onboarded: true,
      consentAccepted: true,
      consentTimestamp: Date.now(),
    };
    setProfile(updatedProfile);
    setPersona(companionPersona);

    // Initial warm greeting message
    const initialGreeting: Message = {
      id: `msg_welcome_${Date.now()}`,
      role: "assistant",
      content: `Hello ${updatedProfile.name}. It is genuinely wonderful to meet you. I'm ${companionPersona.name}, your companion here on Kindred. Whether you want to reflect on how today felt, talk through a knotty problem, or just share a quiet minute—I'm right here with you. How is your day feeling so far?`,
      timestamp: Date.now(),
      moodContext: "peaceful",
    };

    setMessages([initialGreeting]);
    setActiveScreen("chat");
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isThinking) return;

    const isCrisis = detectCrisisIntent(trimmed);

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
      moodContext: activeMood,
      triggeredSafety: isCrisis,
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsThinking(true);

    const assistantMsgId = `asst_${Date.now()}`;
    const initialAssistantMsg: Message = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      isStreaming: true,
      triggeredSafety: isCrisis,
    };

    setMessages([...newHistory, initialAssistantMsg]);

    try {
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          persona,
          userName: profile.name,
          userGoals: profile.goals,
          mood: activeMood,
          memories: memories.map((m) => m.content),
        }),
      });

      if (!response.body) {
        throw new Error("No response stream body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });
        const lines = textChunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6).trim();
            if (dataStr === "[DONE]") {
              break;
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.chunk) {
                accumulated += parsed.chunk;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? { ...m, content: accumulated, isStreaming: true }
                      : m
                  )
                );
              }
            } catch {
              // Ignore partial JSON chunks
            }
          }
        }
      }

      // Mark final message as not streaming
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId ? { ...m, content: accumulated, isStreaming: false } : m
        )
      );

      // Async memory extraction trigger
      try {
        fetch("/api/extract-memory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userMessage: trimmed,
            existingMemories: memories.map((m) => m.content),
          }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data?.memory) {
              addMemory(data.memory, false);
            }
          })
          .catch(() => {});
      } catch {
        // Safe silence for extraction
      }
    } catch (err) {
      console.error("Streaming error:", err);
      // Fallback message
      const fallbackContent = `I'm listening closely, ${profile.name || "friend"}. Whatever is unfolding today, remember to take it one moment at a time. I'm right here beside you.`;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId ? { ...m, content: fallbackContent, isStreaming: false } : m
        )
      );
    } finally {
      setIsThinking(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
  };

  const clearAllData = () => {
    clearAllKindredData();
    setProfile(DEFAULT_USER_PROFILE);
    setMemories([]);
    setMessages([]);
    setActiveMood("peaceful");
    setActiveScreen("welcome");
  };

  const exportData = () => {
    const jsonStr = exportAllKindredData();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kindred-data-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <KindredContext.Provider
      value={{
        profile,
        updateProfile,
        persona,
        updatePersona,
        memories,
        addMemory,
        editMemory,
        deleteMemory,
        messages,
        activeMood,
        setActiveMood,
        activeScreen,
        setActiveScreen,
        isThinking,
        sendMessage,
        clearConversation,
        clearAllData,
        exportData,
        completeOnboarding,
      }}
    >
      {children}
    </KindredContext.Provider>
  );
};

export function useKindred(): KindredContextType {
  const context = useContext(KindredContext);
  if (!context) {
    throw new Error("useKindred must be used within a KindredProvider");
  }
  return context;
}
