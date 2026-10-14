import React from "react";
import { MessageSquare, Bookmark, SlidersHorizontal } from "lucide-react";
import { ScreenId } from "../core/types";
import { CompanionOrb } from "./CompanionOrb";
import { OrbColorId } from "../core/types";

interface NavigationProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  companionName: string;
  orbColorId: OrbColorId;
  isThinking: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeScreen,
  onNavigate,
  companionName,
  orbColorId,
  isThinking,
}) => {
  const navItems: Array<{ id: ScreenId; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: "chat", label: "Chat", icon: MessageSquare },
    { id: "memory", label: "Memory", icon: Bookmark },
    { id: "settings", label: "Settings", icon: SlidersHorizontal },
  ];

  return (
    <>
      {/* Desktop Left Rail (Slim, elegant) */}
      <aside
        className="hidden md:flex flex-col items-center justify-between w-20 py-7 border-r border-[#ECE5DD] bg-[#FAF8F5]/80 backdrop-blur-md z-30 shrink-0 h-screen sticky top-0"
        aria-label="Main Navigation"
      >
        {/* Brand & Companion Presence Orb */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => onNavigate("chat")}
            className="group flex flex-col items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CDBDF5] rounded-2xl p-1"
            title={`${companionName} — Return to chat`}
          >
            <CompanionOrb colorId={orbColorId} size="md" isThinking={isThinking} />
            <span className="font-editorial text-sm font-semibold text-[#2C2622] tracking-tight">
              Kindred
            </span>
          </button>
        </div>

        {/* Middle Navigation Icons */}
        <nav className="flex flex-col items-center gap-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CDBDF5] ${
                  isActive
                    ? "bg-[#2C2622] text-[#FBF9F6] shadow-sm"
                    : "text-[#7A6F65] hover:text-[#2C2622] hover:bg-[#F0EBE2]"
                }`}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="w-5 h-5 stroke-[1.75]" />
                <span className="text-[10px] font-medium mt-0.5 tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Bottom subtle presence marker */}
        <div className="flex flex-col items-center text-center">
          <div className="w-2 h-2 rounded-full bg-[#8BB89A]" title="Companion steady and online" />
          <span className="text-[10px] text-[#9A8E83] mt-1">Ready</span>
        </div>
      </aside>

      {/* Mobile Minimal Bottom Bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-t border-[#ECE5DD] px-6 py-2.5 flex items-center justify-around safe-bottom"
        aria-label="Mobile Navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CDBDF5] ${
                isActive
                  ? "text-[#2C2622] font-semibold"
                  : "text-[#8C7E72] hover:text-[#2C2622]"
              }`}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <div
                className={`p-1.5 rounded-lg transition-colors ${
                  isActive ? "bg-[#2C2622] text-[#FBF9F6]" : "bg-transparent text-inherit"
                }`}
              >
                <Icon className="w-5 h-5 stroke-[1.8]" />
              </div>
              <span className="text-[11px] mt-1 tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
