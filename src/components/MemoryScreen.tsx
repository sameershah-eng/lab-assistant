import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Pencil, Trash2, Check, X, ShieldCheck, Bookmark, Sparkles } from "lucide-react";
import { useKindred } from "../core/context";
import { MemoryItem } from "../core/types";

export const MemoryScreen: React.FC = () => {
  const { memories, addMemory, editMemory, deleteMemory, persona } = useKindred();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [newMemoryText, setNewMemoryText] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);

  const startEdit = (item: MemoryItem) => {
    setEditingId(item.id);
    setEditText(item.content);
  };

  const saveEdit = (id: string) => {
    if (editText.trim()) {
      editMemory(id, editText);
    }
    setEditingId(null);
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemoryText.trim()) {
      addMemory(newMemoryText, true);
      setNewMemoryText("");
      setIsAddingNew(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-8 py-8 pb-24 md:pb-12 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C7E72]">
          <Bookmark className="w-4 h-4 text-[#CDBDF5]" />
          <span>Transparency & Trust</span>
        </div>
        <h1 className="font-editorial text-2xl sm:text-3xl font-medium text-[#2C2622]">
          What {persona.name} remembers about you
        </h1>
        <p className="text-sm text-[#7A6F65] leading-relaxed max-w-xl">
          As you talk, your companion gently notes meaningful details to make your conversations feel steady and personal. You have complete authority to edit or remove anything here.
        </p>
      </div>

      {/* Trust Notice Box */}
      <div className="p-4 sm:p-5 rounded-[20px] bg-[#FFFFFF] border border-[#ECE5DD] flex items-start gap-3.5 shadow-xs">
        <div className="w-8 h-8 rounded-xl bg-[#F4EFE8] flex items-center justify-center shrink-0 text-[#60554A]">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xs uppercase tracking-wider font-semibold text-[#4A423A]">
            Zero External Tracking
          </h2>
          <p className="text-xs text-[#7A6F65] leading-relaxed">
            These memory cards are stored strictly inside your browser's private storage. They are only referenced when generating thoughtful replies for you.
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-medium text-[#8C7E72]">
          {memories.length} {memories.length === 1 ? "recollection" : "recollections"}
        </span>

        {!isAddingNew && (
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-[#2C2622] text-[#FBF9F6] hover:bg-[#3D352F] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CDBDF5]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add a recollection</span>
          </button>
        )}
      </div>

      {/* Inline Add Form */}
      <AnimatePresence>
        {isAddingNew && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleAddNew}
            className="p-4 sm:p-5 bg-white border border-[#DACFC2] rounded-[20px] shadow-sm space-y-3"
          >
            <label
              htmlFor="new-recollection-input"
              className="block text-xs font-semibold text-[#5C5248] uppercase tracking-wider"
            >
              What should {persona.name} keep in mind?
            </label>
            <textarea
              id="new-recollection-input"
              value={newMemoryText}
              onChange={(e) => setNewMemoryText(e.target.value)}
              placeholder="e.g. Loves drinking earl grey tea in the afternoon; works as a landscape architect; prefers gentle accountability."
              rows={2}
              className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#E6DDD2] text-sm text-[#2C2622] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CDBDF5]"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-[#7A6F65] hover:text-[#2C2622]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newMemoryText.trim()}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2C2622] text-[#FBF9F6] disabled:opacity-40 cursor-pointer"
              >
                Save Recollection
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Memory Cards Grid / List */}
      {memories.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white/70 border border-[#ECE5DD] rounded-[24px] space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF5EE] mx-auto flex items-center justify-center text-[#9A8E83]">
            <Bookmark className="w-5 h-5" />
          </div>
          <h2 className="font-editorial text-xl text-[#2C2622]">
            No recollections yet
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6F65] max-w-sm mx-auto leading-relaxed">
            As you chat with {persona.name}, meaningful facts will appear here softly. Or you can add one right now.
          </p>
          <button
            onClick={() => setIsAddingNew(true)}
            className="mt-3 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#FFD8C2] via-[#F7B9C8] to-[#CDBDF5] text-[#2C2622] shadow-xs cursor-pointer"
          >
            Add first recollection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <AnimatePresence>
            {memories.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="group relative p-4 sm:p-5 bg-white border border-[#ECE5DD] hover:border-[#DACFC2] rounded-[20px] shadow-xs flex flex-col justify-between transition-all"
              >
                {editingId === item.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 rounded-lg bg-[#FAF8F5] border border-[#DACFC2] text-xs sm:text-sm text-[#2C2622] focus:outline-none focus:ring-1 focus:ring-[#CDBDF5]"
                      autoFocus
                    />
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1.5 rounded-lg text-[#8C7E72] hover:text-[#2C2622]"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => saveEdit(item.id)}
                        className="p-1.5 rounded-lg bg-[#2C2622] text-[#FBF9F6]"
                        title="Save changes"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-[#2C2622] leading-relaxed font-normal">
                      "{item.content}"
                    </p>

                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#F5EFE8] text-[11px] text-[#9A8E83]">
                      <span>
                        {new Date(item.createdAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(item)}
                          className="p-1.5 rounded-lg text-[#8C7E72] hover:text-[#2C2622] hover:bg-[#F4EFE8] transition-colors"
                          title="Edit recollection"
                          aria-label="Edit recollection"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteMemory(item.id)}
                          className="p-1.5 rounded-lg text-[#8C7E72] hover:text-[#A74444] hover:bg-[#FDECEB] transition-colors"
                          title="Delete recollection"
                          aria-label="Delete recollection"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
