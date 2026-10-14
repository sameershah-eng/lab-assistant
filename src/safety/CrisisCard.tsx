import React from "react";
import { Phone, HeartHandshake, ShieldAlert } from "lucide-react";
import { UK_CRISIS_RESOURCES } from "./safetyRules";

interface CrisisCardProps {
  onDismiss?: () => void;
}

export const CrisisCard: React.FC<CrisisCardProps> = () => {
  return (
    <div
      role="region"
      aria-label="Support and crisis resources"
      className="my-4 p-5 sm:p-6 bg-[#FFF8F6] border border-[#F5D8D0] rounded-[20px] shadow-sm text-[#3E342F]"
    >
      <div className="flex items-start gap-3.5 mb-3">
        <div className="w-10 h-10 rounded-full bg-[#FCEBE7] flex items-center justify-center shrink-0 text-[#C85A5A]">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-editorial text-lg font-semibold text-[#2C2420]">
            You matter, and support is right here
          </h3>
          <p className="text-sm text-[#6C5E57] mt-0.5 leading-relaxed">
            I am an AI companion, and while I care deeply about listening, please know you do not have to carry heavy pain alone. Human care, warmth, and confidential guidance are always available to you in the UK:
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
        {UK_CRISIS_RESOURCES.map((resource) => (
          <a
            key={resource.name}
            href={resource.actionUri}
            className="flex flex-col p-3 rounded-xl bg-white border border-[#F0E4DE] hover:border-[#E8BDB2] hover:bg-[#FFFDFB] transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7B9C8]"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm text-[#2C2420] group-hover:text-[#A74444] transition-colors">
                {resource.name}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-[#FAF2EE] text-[#8C4646] rounded-md flex items-center gap-1">
                <Phone className="w-3 h-3 inline" />
                {resource.contact}
              </span>
            </div>
            <p className="text-xs text-[#7A6B63] mt-1.5 leading-normal">
              {resource.description}
            </p>
            <span className="text-[11px] text-[#A6978F] mt-1">
              {resource.availability}
            </span>
          </a>
        ))}
      </div>

      <div className="mt-3.5 pt-3 border-t border-[#F5E2DC] flex items-center gap-2 text-xs text-[#8A7970]">
        <ShieldAlert className="w-3.5 h-3.5 text-[#B6766B] shrink-0" />
        <span>In an immediate emergency or risk of harm, please dial 999 or visit your nearest A&E department.</span>
      </div>
    </div>
  );
};
