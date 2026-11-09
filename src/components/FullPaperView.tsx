import React, { useState } from "react";
import { PaperProject, SectionKey } from "../types";
import { SECTION_METAS, SECTION_ORDER } from "../data/constants";
import { MarkdownRenderer } from "./MarkdownRenderer";
import {
  Download,
  Copy,
  Printer,
  Check,
  FileText,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface FullPaperViewProps {
  project: PaperProject;
  onNavigateToSection: (section: SectionKey) => void;
  onOpenExport: () => void;
}

export const FullPaperView: React.FC<FullPaperViewProps> = ({
  project,
  onNavigateToSection,
  onOpenExport,
}) => {
  const [copied, setCopied] = useState(false);

  // Calculate full text and word count
  const allDrafts = SECTION_ORDER.map((key) => {
    const meta = SECTION_METAS.find((m) => m.key === key)!;
    const text = project.sections[key] || "";
    return { key, meta, text };
  });

  const draftedSections = allDrafts.filter((d) => d.text.trim().length > 0);
  const totalWords = allDrafts.reduce((acc, d) => {
    return acc + (d.text ? d.text.split(/\s+/).filter(Boolean).length : 0);
  }, 0);

  const handleCopyFull = async () => {
    const fullText = buildFullPaperText(project);
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed", err);
    }
  };

  const handleDownloadTxt = () => {
    const fullText = buildFullPaperText(project);
    const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slugify(project.topic || "research-paper")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Document Controls Bar */}
      <div className="no-print bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>FULL MANUSCRIPT ASSEMBLY</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-slate-800">
              {draftedSections.length} of {SECTION_ORDER.length} Sections Complete
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Total Length: <strong className="text-slate-700 font-mono tabular-nums">{totalWords.toLocaleString()}</strong> words (~{Math.ceil(totalWords / 200)} min read)
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyFull}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied Full Text</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Full Manuscript</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadTxt}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .txt</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={onOpenExport}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-md transition-colors shadow-xs"
          >
            Export Options
          </button>
        </div>
      </div>

      {/* Manuscript Container (Paper Sheet Aesthetic) */}
      <article className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-8 sm:p-14 space-y-10 print:border-none print:shadow-none print:p-0">
        {/* Academic Header */}
        <header className="border-b border-slate-200 pb-8 space-y-4 text-center">
          <div className="text-xs uppercase tracking-widest font-semibold text-sky-700 font-mono">
            {project.discipline} · {project.academicLevel}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight max-w-3xl mx-auto" style={{ textWrap: "balance" }}>
            {project.topic || "Untitled Academic Research Paper"}
          </h1>

          <div className="text-xs sm:text-sm text-slate-600 space-y-1 pt-1">
            <div className="font-medium text-slate-900">
              {project.authorName || "Principal Investigator / Author Name"}
            </div>
            <div className="text-slate-500">
              {project.institution || "University / Academic Research Department"}
            </div>
            <div className="text-slate-400 text-xs font-mono">
              Working Draft generated on {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Paper Sections */}
        {allDrafts.map(({ key, meta, text }, index) => {
          const hasContent = Boolean(text && text.trim().length > 0);

          return (
            <section key={key} className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-sky-600">
                    §{meta.number}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    {meta.title}
                  </h2>
                </div>

                <button
                  onClick={() => onNavigateToSection(key)}
                  className="no-print text-xs font-medium text-sky-700 hover:text-sky-900 flex items-center gap-1 transition-colors"
                >
                  <span>Edit in Studio</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {hasContent ? (
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base">
                  <MarkdownRenderer content={text} />
                </div>
              ) : (
                <div className="no-print p-6 rounded-lg bg-slate-50 border border-dashed border-slate-300 text-center space-y-2">
                  <p className="text-xs text-slate-500">
                    This section has not been drafted yet.
                  </p>
                  <button
                    onClick={() => onNavigateToSection(key)}
                    className="text-xs font-semibold text-sky-700 hover:text-sky-800"
                  >
                    Draft {meta.shortTitle} now →
                  </button>
                </div>
              )}
            </section>
          );
        })}

        {/* Concluding Academic Disclaimer */}
        <footer className="border-t border-slate-200 pt-8 text-xs text-slate-400 leading-relaxed">
          <p className="font-semibold text-slate-600 mb-1">
            Scholarly Attribution & Verification Note:
          </p>
          <p>
            This research manuscript blueprint was generated with the assistance of ResearchMate using
            Google's Gemini model. Literature citations in brackets indicate synthesized thematic frameworks
            and must be verified with primary scholarly sources prior to formal submission.
          </p>
        </footer>
      </article>
    </div>
  );
};

function buildFullPaperText(project: PaperProject): string {
  let output = "";
  output += `# ${project.topic || "Untitled Research Study"}\n\n`;
  output += `Discipline: ${project.discipline}\n`;
  output += `Format / Level: ${project.academicLevel}\n`;
  if (project.authorName) output += `Author: ${project.authorName}\n`;
  if (project.institution) output += `Affiliation: ${project.institution}\n`;
  output += `Date: ${new Date().toLocaleDateString()}\n\n`;
  output += `==================================================\n\n`;

  for (const key of SECTION_ORDER) {
    const meta = SECTION_METAS.find((m) => m.key === key)!;
    const content = project.sections[key];
    output += `## ${meta.number}. ${meta.title}\n\n`;
    if (content && content.trim()) {
      output += `${content.trim()}\n\n`;
    } else {
      output += `[Section not yet drafted]\n\n`;
    }
  }

  output += `==================================================\n`;
  output += `Generated via ResearchMate (Gemini Academic Assistant)\n`;
  return output;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 50);
}
