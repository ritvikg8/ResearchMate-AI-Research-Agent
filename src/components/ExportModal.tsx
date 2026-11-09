import React, { useState } from "react";
import { PaperProject } from "../types";
import { SECTION_METAS, SECTION_ORDER } from "../data/constants";
import {
  X,
  Download,
  Copy,
  Check,
  FileText,
  Printer,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface ExportModalProps {
  project: PaperProject;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const [copiedFull, setCopiedFull] = useState(false);
  const [copiedDisclosure, setCopiedDisclosure] = useState(false);

  if (!isOpen) return null;

  const totalWords = SECTION_ORDER.reduce((acc, key) => {
    const text = project.sections[key] || "";
    return acc + (text ? text.split(/\s+/).filter(Boolean).length : 0);
  }, 0);

  const fullText = buildFullPaperText(project);

  const handleCopyFull = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedFull(true);
      setTimeout(() => setCopiedFull(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed", err);
    }
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slugify(project.topic || "research-paper")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMd = () => {
    const blob = new Blob([fullText], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slugify(project.topic || "research-paper")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    onClose();
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const disclosureStatement = `Academic AI Declaration:
The initial structural outline and preparatory drafts for this research paper ("${
    project.topic || "Untitled Study"
  }") were formulated with the assistance of ResearchMate (powered by Google Gemini 3.8 Flash). The author conducted independent critical review, empirical validation of all research gaps, primary literature citation verification, and rigorous revisions to ensure academic integrity and factual accuracy.`;

  const handleCopyDisclosure = async () => {
    try {
      await navigator.clipboard.writeText(disclosureStatement);
      setCopiedDisclosure(true);
      setTimeout(() => setCopiedDisclosure(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-sky-600" />
            <h2 className="text-base font-bold text-slate-900">
              Export Research Manuscript
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Paper Summary Pill */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs space-y-1">
            <div className="font-semibold text-slate-900 truncate">
              {project.topic || "Untitled Research Paper"}
            </div>
            <div className="flex items-center gap-2 text-slate-500 font-mono tabular-nums">
              <span>{totalWords.toLocaleString()} Words</span>
              <span aria-hidden="true">·</span>
              <span>{project.discipline}</span>
              <span aria-hidden="true">·</span>
              <span>{project.academicLevel}</span>
            </div>
          </div>

          {/* Download Options */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              File Export Formats
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleDownloadTxt}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-sky-50 text-sky-700 group-hover:bg-sky-100 transition-colors">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Plain Text (.txt)</div>
                  <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    Universal text file, formatted with clear section dividers.
                  </div>
                </div>
              </button>

              <button
                onClick={handleDownloadMd}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700 group-hover:bg-indigo-100 transition-colors">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Markdown (.md)</div>
                  <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    Structured headings and tables, ideal for Obsidian or Notion.
                  </div>
                </div>
              </button>

              <button
                onClick={handlePrint}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100 transition-colors">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Print / Save as PDF</div>
                  <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    Opens formatted print layout ready for PDF generation.
                  </div>
                </div>
              </button>

              <button
                onClick={handleCopyFull}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-slate-200 transition-colors">
                  {copiedFull ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {copiedFull ? "Copied to Clipboard!" : "Copy Full Text"}
                  </div>
                  <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    Instantly paste into Microsoft Word or Google Docs.
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Academic AI Disclosure Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                Formal AI Assistance Declaration
              </span>
              <button
                onClick={handleCopyDisclosure}
                className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1"
              >
                {copiedDisclosure ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedDisclosure ? "Copied!" : "Copy Declaration"}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed italic bg-white p-2.5 rounded border border-slate-200">
              "{disclosureStatement}"
            </p>
            <p className="text-[10px] text-slate-400">
              Most universities and journals recommend including a formal acknowledgement when AI tools are utilized for ideation and drafting.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

function buildFullPaperText(project: PaperProject): string {
  let output = "";
  output += `# ${project.topic || "Untitled Research Study"}\n\n`;
  output += `Discipline: ${project.discipline}\n`;
  output += `Academic Level: ${project.academicLevel}\n`;
  if (project.authorName) output += `Author: ${project.authorName}\n`;
  if (project.institution) output += `Institution: ${project.institution}\n`;
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
  output += `Generated via ResearchMate – AI Research Paper Assistant (Google Gemini)\n`;
  return output;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 50);
}
