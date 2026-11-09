import React from "react";
import { BookOpen, Download, FileText, CheckCircle2 } from "lucide-react";

interface HeaderProps {
  activeTab: "studio" | "reader" | "guide";
  setActiveTab: (tab: "studio" | "reader" | "guide") => void;
  onOpenExport: () => void;
  draftedCount: number;
  totalSections: number;
  totalWords: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenExport,
  draftedCount,
  totalSections,
  totalWords,
}) => {
  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-xs">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
            ResearchMate
          </span>
          <span className="hidden sm:inline text-xs text-slate-400 font-medium">
            AI Research Assistant
          </span>
        </div>

        {/* Zone 2: Navigation Links / Segmented Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab("studio")}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === "studio"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Section Studio</span>
          </button>

          <button
            onClick={() => setActiveTab("reader")}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === "reader"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Document Reader</span>
          </button>

          <button
            onClick={() => setActiveTab("guide")}
            className={`hidden md:flex px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 items-center gap-1.5 ${
              activeTab === "guide"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Citation & Ethics</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 font-mono tabular-nums">
            <span>{draftedCount}/{totalSections} Drafted</span>
            <span aria-hidden="true">·</span>
            <span>{totalWords.toLocaleString()} Words</span>
          </div>

          <button
            onClick={onOpenExport}
            className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors shadow-xs flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Export Manuscript</span>
          </button>
        </div>
      </div>
    </header>
  );
};
