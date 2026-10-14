import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp, Sparkles, AlertCircle } from "lucide-react";
import { useKindred } from "../core/context";
import { CompanionOrb } from "./CompanionOrb";
import { MoodSelector } from "./MoodSelector";
import { CrisisCard } from "../safety/CrisisCard";

export const ChatScreen: React.FC = () => {
  const {
    profile,
    persona,
    messages,
    activeMood,
    setActiveMood,
    isThinking,
    sendMessage,
    setActiveScreen,
  } = useKindred();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages, isThinking]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isThinking) return;
    const msg = input.trim();
    setInput("");
    sendMessage(msg);
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Adjust textarea height dynamically
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
  };

  const quickPrompts = [
    "I'm feeling a little overwhelmed today",
    "Can we reflect on something that went well?",
    "Tell me an honest thought about slowing down",
    "What do you remember about my routine?",
  ];

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto w-full px-4 sm:px-8 pb-20 md:pb-6 pt-4 sm:pt-6">
      {/* Top Header with Companion Orb Presence */}
      <header className="flex items-center justify-between pb-3.5 border-b border-[#ECE5DD] shrink-0">
        <div className="flex items-center gap-3.5">
          <CompanionOrb
            colorId={persona.orbColorId}
            size="md"
            isThinking={isThinking}
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-editorial text-lg sm:text-xl font-medium text-[#2C2622]">
                {persona.name}
              </h1>
              <span className="w-1.5 h-1.5 rounded-full bg-[#8BB89A]" />
            </div>
            <p className="text-xs text-[#7A6F65]">
              {isThinking ? "Reflecting with care..." : "Calm and present"}
            </p>
          </div>
        </div>

        {/* Quick link to Memory */}
        <button
          onClick={() => setActiveScreen("memory")}
          className="text-xs font-medium text-[#7A6F65] hover:text-[#2C2622] px-3 py-1.5 rounded-xl border border-[#ECE5DD] bg-white/60 hover:bg-white transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CDBDF5]"
        >
          View memories
        </button>
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-6 space-y-5 pr-1">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <CompanionOrb colorId={persona.orbColorId} size="lg" />
            <div className="max-w-md">
              <h2 className="font-editorial text-2xl text-[#2C2622]">
                A quiet space for you
              </h2>
              <p className="text-sm text-[#7A6F65] mt-1.5 leading-relaxed">
                {persona.name} is ready whenever you are. Say hello, discuss how your morning unfolded, or unpack any thoughts you are carrying.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="px-3.5 py-2 text-xs font-medium rounded-xl bg-white border border-[#ECE5DD] hover:border-[#DACFC2] text-[#4A423A] transition-all hover:bg-[#FAF8F5] cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.role === "user";
            return (
              <motion.div
                key={msg.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 24,
                }}
                className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
              >
                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[78%] px-5 py-4 rounded-[20px] text-[15px] sm:text-base leading-relaxed tracking-normal ${
                    isUser
                      ? "bg-[#2C2622] text-[#FBF9F6] rounded-br-xs shadow-xs"
                      : "bg-[#FFFFFF] text-[#2C2622] border border-[#ECE5DD] rounded-bl-xs shadow-xs"
                  }`}
                >
                  {/* Assistant Message Content */}
                  <div className="whitespace-pre-wrap break-words">
                    {msg.content}
                    {msg.isStreaming && (
                      <span className="inline-block w-1.5 h-4 ml-1 bg-[#F7B9C8] animate-pulse align-middle" />
                    )}
                  </div>
                </div>

                {/* Subtext info (e.g. mood indicator for user or timestamp) */}
                <div
                  className={`flex items-center gap-2 mt-1.5 text-[11px] text-[#9A8E83] px-1 ${
                    isUser ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {msg.moodContext && isUser && (
                    <span className="text-[#8C7E72] font-medium">
                      · feeling {msg.moodContext}
                    </span>
                  )}
                </div>

                {/* Inline Crisis Card when safety triggers on self-harm or crisis */}
                {msg.triggeredSafety && !isUser && (
                  <div className="w-full max-w-[92%] sm:max-w-[85%]">
                    <CrisisCard />
                  </div>
                )}
              </motion.div>
            );
          })
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Tray Area (fixed above mobile nav or desktop bottom) */}
      <div className="shrink-0 pt-2 space-y-2">
        {/* Quick Mood Selector Pill above input */}
        <MoodSelector activeMood={activeMood} onSelectMood={setActiveMood} />

        {/* Input Box Container */}
        <form
          onSubmit={handleSubmit}
          className="relative flex items-end gap-2 p-2 sm:p-2.5 bg-white border border-[#ECE5DD] rounded-[22px] shadow-sm focus-within:border-[#DACFC2] focus-within:ring-2 focus-within:ring-[#CDBDF5]/40 transition-all"
        >
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={`Talk to ${persona.name}... (Press Enter to send)`}
            className="flex-1 max-h-36 px-3 py-2 bg-transparent text-[#2C2622] placeholder:text-[#A69B90] text-sm sm:text-base resize-none focus:outline-none leading-relaxed"
          />

          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            aria-label="Send message"
            className={`p-3 rounded-full shrink-0 flex items-center justify-center transition-all ${
              input.trim() && !isThinking
                ? "bg-gradient-to-r from-[#FFD8C2] via-[#F7B9C8] to-[#CDBDF5] text-[#2C2622] shadow-sm hover:opacity-95 active:scale-95 cursor-pointer"
                : "bg-[#F2ECE3] text-[#A69B90] cursor-not-allowed"
            }`}
          >
            <ArrowUp className="w-4 h-4 stroke-[2.2]" />
          </button>
        </form>

        <p className="text-[11px] text-center text-[#9A8E83] pt-0.5">
          Kindred stores your conversations locally in your browser.
        </p>
      </div>
    </div>
  );
};
