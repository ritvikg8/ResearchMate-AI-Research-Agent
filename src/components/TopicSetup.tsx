import React from "react";
import { PaperProject, AcademicDiscipline, AcademicLevel, PresetTopic } from "../types";
import { PRESET_TOPICS } from "../data/constants";
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  GraduationCap,
  Layers,
  FileCheck,
  AlertCircle,
} from "lucide-react";

interface TopicSetupProps {
  project: PaperProject;
  onUpdateProject: (updates: Partial<PaperProject>) => void;
  onStartDrafting: () => void;
  onGenerateAll: () => void;
  isGeneratingAll: boolean;
}

const DISCIPLINES: AcademicDiscipline[] = [
  "Computer Science & AI",
  "Environmental Sciences",
  "Biomedical & Health Sciences",
  "Economics & Business",
  "Social Sciences & Psychology",
  "Engineering & Robotics",
  "Interdisciplinary",
];

const LEVELS: AcademicLevel[] = [
  "Undergraduate Capstone",
  "Master's Thesis",
  "Doctoral Dissertation",
  "Journal Preprint",
  "Conference Workshop",
];

export const TopicSetup: React.FC<TopicSetupProps> = ({
  project,
  onUpdateProject,
  onStartDrafting,
  onGenerateAll,
  isGeneratingAll,
}) => {
  const handleSelectPreset = (preset: PresetTopic) => {
    onUpdateProject({
      topic: preset.title,
      discipline: preset.discipline,
      academicLevel: preset.academicLevel,
      description: preset.description,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md mb-3 border border-sky-100">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Paper Setup & Parameterization</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Define Your Research Scope
          </h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Enter your paper topic and conceptual framework below. ResearchMate uses tailored
            few-shot academic prompting via Gemini to craft rigorous, publication-grade sections.
          </p>
        </div>

        {/* Input Form */}
        <div className="mt-8 space-y-6">
          {/* Topic Title */}
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Research Topic / Working Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={project.topic}
              onChange={(e) => onUpdateProject({ topic: e.target.value })}
              placeholder="e.g., Privacy-Preserving Federated Learning for Decentralized Electronic Health Records"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm text-slate-900 placeholder:text-slate-400 bg-white shadow-xs"
            />
          </div>

          {/* Description & Scope */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                Research Description & Scope
              </label>
              <span className="text-xs text-slate-400">Brief context or hypotheses</span>
            </div>
            <textarea
              rows={3}
              value={project.description}
              onChange={(e) => onUpdateProject({ description: e.target.value })}
              placeholder="Describe the problem, intended methodology, target population or experimental system, and expected scholarly contribution..."
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm text-slate-900 placeholder:text-slate-400 bg-white shadow-xs"
            />
          </div>

          {/* Discipline & Academic Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Academic Discipline
              </label>
              <select
                value={project.discipline}
                onChange={(e) =>
                  onUpdateProject({ discipline: e.target.value as AcademicDiscipline })
                }
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm text-slate-800 bg-white shadow-xs"
              >
                {DISCIPLINES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Target Academic Level / Format
              </label>
              <select
                value={project.academicLevel}
                onChange={(e) =>
                  onUpdateProject({ academicLevel: e.target.value as AcademicLevel })
                }
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm text-slate-800 bg-white shadow-xs"
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Author & Affiliation Details (Optional for export) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Author / Lead Researcher Name (Optional)
              </label>
              <input
                type="text"
                value={project.authorName}
                onChange={(e) => onUpdateProject({ authorName: e.target.value })}
                placeholder="e.g., Alex Johnson"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-xs text-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                University / Institution Affiliation (Optional)
              </label>
              <input
                type="text"
                value={project.institution}
                onChange={(e) => onUpdateProject({ institution: e.target.value })}
                placeholder="e.g., Department of Computer Science, University of California"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-xs text-slate-900 bg-white"
              />
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onStartDrafting}
              disabled={!project.topic.trim()}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>Open Section Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onGenerateAll}
              disabled={isGeneratingAll || !project.topic.trim()}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>{isGeneratingAll ? "Drafting In Progress..." : "Draft Complete Paper Sequence"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preset Topics for Rapid Testing */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Quick Presets & Scholarly Benchmarks
            </h2>
            <p className="text-xs text-slate-500">
              Select a pre-configured research topic to explore few-shot academic generation immediately.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRESET_TOPICS.map((preset, idx) => {
            const isCurrent = project.topic === preset.title;
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all text-left flex flex-col justify-between ${
                  isCurrent
                    ? "bg-sky-50/60 border-sky-300 ring-1 ring-sky-300"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1.5">
                    <span className="font-medium text-sky-700">{preset.discipline}</span>
                    <span aria-hidden="true">·</span>
                    <span>{preset.academicLevel}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 leading-snug mb-2">
                    {preset.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {preset.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Few-Shot Ready
                  </span>
                  <button
                    onClick={() => handleSelectPreset(preset)}
                    className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1"
                  >
                    <span>{isCurrent ? "Active Topic" : "Load Preset"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Academic Integrity Reminder */}
      <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 leading-relaxed">
          <strong className="font-semibold text-slate-800">
            Responsible Scholarly Assistance:
          </strong>{" "}
          ResearchMate never invents fake literature citations or empirical datasets. All literature
          streams are synthesized thematically with explicit placeholder brackets{" "}
          <code className="text-[11px] font-mono bg-white px-1 py-0.5 rounded border border-slate-200">
            [Author, Year - Verify]
          </code>{" "}
          for you to link to verified peer-reviewed articles.
        </div>
      </div>
    </div>
  );
};
