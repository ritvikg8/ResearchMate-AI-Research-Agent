import React from "react";
import {
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Search,
  FileCheck2,
  HelpCircle,
} from "lucide-react";

export const IntegrityGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md mb-3 border border-emerald-100">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Academic Honesty & Scholarly Standards</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Citation & Verification Protocol
        </h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-2xl">
          ResearchMate enforces strict anti-hallucination protocols. Here is how college students and
          researchers should transition from AI-generated draft frameworks to peer-reviewed scholarly submissions.
        </p>
      </div>

      {/* 3 Core Ethical Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            No Fabricated Citations
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Standard AI models frequently invent plausible-sounding authors, journals, and DOIs.
            ResearchMate instead synthesizes <strong>thematic literature streams</strong> and explicitly leaves
            attribution tags like <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono">[Study on X - Verify]</code> for you to verify.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Hypothesized Research Gaps
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Identified research gaps represent logical scholarly deductions based on theoretical boundaries.
            Always confirm that a recent journal paper hasn't already resolved the gap by running targeted
            keyword queries on Google Scholar or Scopus.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Transparent Disclosure
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Academic guidelines (such as APA 7, IEEE, and Nature) permit AI tools for structuring and
            language refinement provided researchers disclose the model utilized and take full responsibility for
            factual contents.
          </p>
        </div>
      </div>

      {/* Step-by-Step Pre-Submission Checklist */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900">
          Pre-Submission Verification Checklist for Students
        </h2>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900 font-semibold block mb-0.5">
                Step 1: Replace Thematic Brackets with Indexed Citations
              </strong>
              Review every occurrence of <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200 text-amber-900">[... - Verify]</code> in the Literature Review and Introduction. Search your university library database (IEEE, ACM, PubMed, JSTOR) and insert real, published citations.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900 font-semibold block mb-0.5">
                Step 2: Check Methodological Feasibility & Ethics
              </strong>
              Verify that the sample sizes, statistical assays, instruments, and software libraries proposed in the Methodology are accessible to your research group and comply with your institution's Institutional Review Board (IRB) or safety guidelines.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900 font-semibold block mb-0.5">
                Step 3: Align Objectives with Proposed Analysis
              </strong>
              Check that your Research Questions (RQ1, RQ2, RQ3) correspond directly to the quantitative statistical tests or qualitative thematic codes outlined in your Methodology section.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900 font-semibold block mb-0.5">
                Step 4: Include AI Acknowledgment Statement
              </strong>
              Use the built-in <strong>"Formal AI Assistance Declaration"</strong> in the Export Manuscript modal to attach an ethical acknowledgement footnote in your paper's introduction or acknowledgments section.
            </div>
          </div>
        </div>
      </div>

      {/* Guide on How to Cite AI in Common Formats */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900">
          How to Reference AI Assistance in Different Styles
        </h2>

        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-lg border border-slate-200">
            <div className="font-bold text-slate-900 mb-1">APA 7th Edition</div>
            <div className="text-slate-600 font-mono text-[11px] bg-slate-50 p-2 rounded">
              Google. (2026). Gemini 3.8 Flash [Large language model]. https://gemini.google.com/
            </div>
          </div>

          <div className="p-3 rounded-lg border border-slate-200">
            <div className="font-bold text-slate-900 mb-1">IEEE Style</div>
            <div className="text-slate-600 font-mono text-[11px] bg-slate-50 p-2 rounded">
              "ResearchMate (incorporating Gemini 3.8 Flash, Google, 2026) was utilized to assist with section outline formulation and preliminary stylistic synthesis."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
