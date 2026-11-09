import React, { useState } from "react";
import { SectionMeta, PaperProject } from "../types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import {
  Sparkles,
  RotateCw,
  Copy,
  Check,
  Edit3,
  Eye,
  Trash2,
  AlertCircle,
  HelpCircle,
  Wand2,
  Loader2,
  ChevronDown,
  ChevronUp,
  FileCheck,
} from "lucide-react";

interface SectionEditorProps {
  meta: SectionMeta;
  project: PaperProject;
  onUpdateContent: (content: string) => void;
  onGenerate: (customInstruction?: string) => Promise<void>;
  onRefine: (refinementType: string, customNote?: string) => Promise<void>;
  isGenerating: boolean;
  error: string | null;
  onClearError: () => void;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({
  meta,
  project,
  onUpdateContent,
  onGenerate,
  onRefine,
  isGenerating,
  error,
  onClearError,
}) => {
  const content = project.sections[meta.key] || "";
  const [viewMode, setViewMode] = useState<"preview" | "edit">("preview");
  const [copied, setCopied] = useState(false);
  const [showGuidance, setShowGuidance] = useState(true);
  const [showRefineOptions, setShowRefineOptions] = useState(false);
  const [customDirective, setCustomDirective] = useState("");
  const [isRefining, setIsRefining] = useState(false);

  const words = content ? content.split(/\s+/).filter(Boolean).length : 0;
  const readingTimeMinutes = Math.ceil(words / 200);

  const handleCopy = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed", err);
    }
  };

  const handleCustomRefine = async () => {
    if (!customDirective.trim()) return;
    setIsRefining(true);
    await onRefine("custom", customDirective);
    setCustomDirective("");
    setIsRefining(false);
  };

  const handleQuickRefine = async (type: string) => {
    setIsRefining(true);
    await onRefine(type);
    setIsRefining(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Section Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>SECTION {meta.number}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-sky-700">{project.discipline}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {meta.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {meta.description}
            </p>
          </div>

          {/* Section Stats & View Switcher */}
          <div className="flex items-center gap-2 shrink-0 self-start">
            <div className="text-right mr-2 hidden sm:block">
              <div className="text-xs font-semibold font-mono text-slate-800 tabular-nums">
                {words} Words
              </div>
              <div className="text-[11px] text-slate-400">
                ~{readingTimeMinutes} min read
              </div>
            </div>

            <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/80">
              <button
                onClick={() => setViewMode("preview")}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  viewMode === "preview"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="View formatted academic prose"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Formatted</span>
              </button>
              <button
                onClick={() => setViewMode("edit")}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  viewMode === "edit"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Edit markdown raw text"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Source</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Generate or Regenerate button */}
            <button
              onClick={() => onGenerate()}
              disabled={isGenerating || isRefining || !project.topic.trim()}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors rounded-lg shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating with Gemini...</span>
                </>
              ) : content ? (
                <>
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Regenerate Section</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>Generate with Gemini</span>
                </>
              )}
            </button>

            {/* Refinement Menu Toggle */}
            {content && (
              <button
                onClick={() => setShowRefineOptions(!showRefineOptions)}
                disabled={isGenerating || isRefining}
                className="px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Wand2 className="w-3.5 h-3.5 text-sky-600" />
                <span>Refine Drafting</span>
                {showRefineOptions ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
            )}

            {/* Guidance Toggle */}
            <button
              onClick={() => setShowGuidance(!showGuidance)}
              className="px-2.5 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showGuidance ? "Hide Advice" : "Academic Advice"}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              disabled={!content}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-40"
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Section</span>
                </>
              )}
            </button>

            {/* Clear Button */}
            {content && (
              <button
                onClick={() => {
                  if (window.confirm("Clear this section draft?")) {
                    onUpdateContent("");
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-md"
                title="Clear section content"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Refinement Subpanel */}
        {showRefineOptions && content && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Scholarly Polish Directives
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleQuickRefine("academic_tone")}
                disabled={isRefining}
                className="px-3 py-1.5 text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-slate-800 transition-colors"
              >
                Elevate Academic Diction
              </button>
              <button
                onClick={() => handleQuickRefine("expand_depth")}
                disabled={isRefining}
                className="px-3 py-1.5 text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-slate-800 transition-colors"
              >
                Expand Theoretical Depth
              </button>
              <button
                onClick={() => handleQuickRefine("concise")}
                disabled={isRefining}
                className="px-3 py-1.5 text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-slate-800 transition-colors"
              >
                Tighten Conciseness
              </button>
              <button
                onClick={() => handleQuickRefine("counterarguments")}
                disabled={isRefining}
                className="px-3 py-1.5 text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-slate-800 transition-colors"
              >
                Add Limitations & Counterarguments
              </button>
            </div>

            {/* Custom Instruction Box */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={customDirective}
                onChange={(e) => setCustomDirective(e.target.value)}
                placeholder="Or specify a custom revision directive (e.g., 'Emphasize GDPR compliance in methodology')..."
                className="flex-1 px-3 py-1.5 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCustomRefine();
                }}
              />
              <button
                onClick={handleCustomRefine}
                disabled={isRefining || !customDirective.trim()}
                className="px-3 py-1.5 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-md transition-colors disabled:opacity-40"
              >
                {isRefining ? "Applying..." : "Apply"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Academic Guidance Box */}
      {showGuidance && (
        <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200/80 space-y-2 text-xs">
          <div className="font-semibold text-sky-950 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-sky-700" />
            <span>Academic Writing Standard for {meta.shortTitle}</span>
          </div>
          <p className="text-sky-900 leading-relaxed">{meta.guidance}</p>
          {meta.ethicalNotice && (
            <div className="pt-2 border-t border-sky-200/60 text-sky-950 font-medium">
              {meta.ethicalNotice}
            </div>
          )}
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start justify-between gap-3 text-xs text-red-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Generation Failed:</strong> {error}
            </div>
          </div>
          <button
            onClick={onClearError}
            className="text-red-600 hover:text-red-800 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Content Canvas */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {viewMode === "preview" ? (
          <div className="p-6 sm:p-8 min-h-[380px]">
            {isGenerating || isRefining ? (
              <div className="py-24 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-sky-600 animate-spin mx-auto" />
                <div className="text-sm font-semibold text-slate-800">
                  {isRefining ? "Refining Academic Prose..." : "Consulting Gemini Scholarly Model..."}
                </div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Applying few-shot academic structure, thematic alignment, and verified styling.
                </p>
              </div>
            ) : content ? (
              <MarkdownRenderer content={content} />
            ) : (
              <div className="py-20 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                  <Edit3 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Section Not Drafted Yet
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Click <strong>"Generate with Gemini"</strong> above to draft this section based on your
                  research topic and disciplinary scope, or switch to <strong>"Edit Source"</strong> to write manually.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2 text-xs text-slate-500 font-mono">
              <span>MARKDOWN SOURCE EDITOR</span>
              <span>{words} words</span>
            </div>
            <textarea
              value={content}
              onChange={(e) => onUpdateContent(e.target.value)}
              rows={18}
              placeholder="Write or edit your academic draft here in Markdown..."
              className="w-full p-4 font-mono text-xs sm:text-sm text-slate-800 bg-slate-50/50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 leading-relaxed resize-y"
            />
            <div className="mt-2 text-right">
              <button
                onClick={() => setViewMode("preview")}
                className="text-xs font-semibold text-sky-700 hover:text-sky-800"
              >
                Switch back to Formatted View →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
