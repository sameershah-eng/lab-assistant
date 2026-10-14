import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, ShieldCheck, X, AlertCircle } from "lucide-react";
import { RegisteredModule } from "../registry";

interface AdultModeModalProps {
  module: RegisteredModule | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AdultModeModal: React.FC<AdultModeModalProps> = ({ module, isOpen, onClose }) => {
  const [clickedVerify, setClickedVerify] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setClickedVerify(false);
    }
  }, [isOpen]);

  if (!isOpen || !module) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#231E1A]/40 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-lg bg-[#FAF8F5] border border-[#ECE5DD] rounded-[24px] shadow-2xl p-6 sm:p-8 z-10 overflow-hidden text-[#2C2622]"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-[#EAE3DA]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F0EAE1] flex items-center justify-center text-[#5C5248]">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#8C7E72]">
                  Optional Architecture Module
                </span>
                <h3 className="font-editorial text-xl font-medium text-[#2C2622]">
                  {module.name}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#8C7E72] hover:text-[#2C2622] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CDBDF5]"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="py-5 space-y-4 text-sm text-[#5C5248] leading-relaxed">
            {module.detailedNotice.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}

            {/* Compliance box */}
            <div className="p-4 bg-[#F4EFE8] rounded-xl border border-[#E6DDD2] space-y-2 mt-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4A423A]">
                <ShieldCheck className="w-4 h-4 text-[#6A8B74]" />
                {module.detailedNotice.complianceTitle}
              </div>
              <ul className="space-y-1.5 text-xs text-[#5C5248]">
                {module.detailedNotice.compliancePoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#8C7E72] mt-0.5">·</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-[#EAE3DA] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs text-[#7A6F64]">
              <AlertCircle className="w-3.5 h-3.5 text-[#B68E65] shrink-0" />
              <span>{module.detailedNotice.actionNote}</span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium text-[#5C5248] hover:text-[#2C2622] rounded-xl border border-[#DDD5CB] bg-white transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setClickedVerify(true)}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-[#2C2622] rounded-xl bg-gradient-to-r from-[#FFD8C2] via-[#F7B9C8] to-[#CDBDF5] shadow-sm hover:opacity-95 transition-all active:scale-97 cursor-pointer"
              >
                {clickedVerify ? "Coming soon" : module.detailedNotice.actionLabel}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
