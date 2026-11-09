import React from "react";
import { SECTION_METAS } from "../data/constants";
import { SectionKey, PaperProject } from "../types";
import {
  FileText,
  Settings,
  Sparkles,
  Check,
  Loader2,
  ChevronRight,
  BookMarked,
  ScrollText,
} from "lucide-react";

interface SidebarProps {
  project: PaperProject;
  activeSection: "setup" | SectionKey;
  onSelectSection: (section: "setup" | SectionKey) => void;
  onGenerateAll: () => void;
  isGeneratingAll: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  project,
  activeSection,
  onSelectSection,
  onGenerateAll,
  isGeneratingAll,
}) => {
  const draftedSections = SECTION_METAS.filter(
    (meta) => project.sections[meta.key] && project.sections[meta.key].trim().length > 0
  );

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-white border-r border-slate-200 shrink-0 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto no-print">
      <div className="p-4 space-y-6">
        {/* Project Context Summary */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Current Research Project
          </div>
          <div
            className="text-xs font-semibold text-slate-900 line-clamp-2 leading-snug cursor-pointer hover:text-sky-600"
            onClick={() => onSelectSection("setup")}
            title={project.topic || "Untitled Research Study"}
          >
            {project.topic || "Untitled Research Study"}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
            <span>{project.discipline}</span>
            <span aria-hidden="true">·</span>
            <span>{project.academicLevel}</span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-1">
          <div className="px-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Paper Blueprint
          </div>

          {/* Setup item */}
          <button
            onClick={() => onSelectSection("setup")}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between group ${
              activeSection === "setup"
                ? "bg-sky-50 text-sky-900 border border-sky-200/60"
                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <Settings className={`w-3.5 h-3.5 ${activeSection === "setup" ? "text-sky-600" : "text-slate-400"}`} />
              <span className="truncate">00. Topic & Scope Setup</span>
            </div>
            <ChevronRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* 7 Academic Sections */}
          {SECTION_METAS.map((meta) => {
            const isDrafted = Boolean(
              project.sections[meta.key] && project.sections[meta.key].trim().length > 0
            );
            const isGenerating = project.sectionStatuses[meta.key] === "generating";
            const wordCount = project.sections[meta.key]
              ? project.sections[meta.key].split(/\s+/).filter(Boolean).length
              : 0;

            const isSelected = activeSection === meta.key;

            return (
              <button
                key={meta.key}
                onClick={() => onSelectSection(meta.key)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between group ${
                  isSelected
                    ? "bg-sky-50 text-sky-900 border border-sky-200/60"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate min-w-0">
                  <div className="w-4 h-4 flex items-center justify-center shrink-0">
                    {isGenerating ? (
                      <Loader2 className="w-3.5 h-3.5 text-sky-600 animate-spin" />
                    ) : isDrafted ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className="text-[11px] font-mono text-slate-400">
                        {meta.number}
                      </span>
                    )}
                  </div>
                  <span className="truncate">{meta.shortTitle}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 pl-2">
                  {wordCount > 0 && (
                    <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                      {wordCount}w
                    </span>
                  )}
                  <ChevronRight
                    className={`w-3 h-3 text-slate-400 transition-opacity ${
                      isSelected ? "opacity-100 text-sky-600" : "opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Batch Automation Card */}
        <div className="pt-2">
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                Draft Sequence
              </span>
              <span className="text-[11px] font-mono tabular-nums text-slate-500">
                {draftedSections.length}/{SECTION_METAS.length} Done
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-sky-600 h-full transition-all duration-300"
                style={{
                  width: `${(draftedSections.length / SECTION_METAS.length) * 100}%`,
                }}
              />
            </div>

            <p className="text-[11px] text-slate-500 leading-tight">
              Draft all incomplete sections sequentially using few-shot academic prompting.
            </p>

            <button
              onClick={onGenerateAll}
              disabled={isGeneratingAll || !project.topic.trim()}
              className="w-full py-1.5 px-3 rounded-md text-xs font-medium text-sky-700 bg-sky-100/70 hover:bg-sky-100 border border-sky-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              {isGeneratingAll ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Drafting Sequence...</span>
                </>
              ) : (
                <>
                  <ScrollText className="w-3.5 h-3.5" />
                  <span>Draft Remaining Sections</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center gap-1 font-medium text-slate-600">
            <BookMarked className="w-3 h-3 text-sky-500" />
            <span>Academic Integrity Protected</span>
          </div>
          <p className="text-[10px] leading-relaxed text-slate-400">
            Literature citations strictly mapped via thematic synthesis. Verify with primary sources.
          </p>
        </div>
      </div>
    </aside>
  );
};
