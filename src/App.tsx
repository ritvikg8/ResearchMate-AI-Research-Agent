import React, { useState, useEffect } from "react";
import { PaperProject, SectionKey, AcademicDiscipline, AcademicLevel } from "./types";
import { SECTION_METAS, SECTION_ORDER, PRESET_TOPICS } from "./data/constants";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { TopicSetup } from "./components/TopicSetup";
import { SectionEditor } from "./components/SectionEditor";
import { FullPaperView } from "./components/FullPaperView";
import { IntegrityGuide } from "./components/IntegrityGuide";
import { ExportModal } from "./components/ExportModal";

const STORAGE_KEY = "researchmate_project_v1";

const DEFAULT_PROJECT: PaperProject = {
  id: "proj_default",
  topic: PRESET_TOPICS[0].title,
  description: PRESET_TOPICS[0].description,
  discipline: PRESET_TOPICS[0].discipline,
  academicLevel: PRESET_TOPICS[0].academicLevel,
  authorName: "Academic Researcher",
  institution: "Faculty of Graduate Studies",
  createdAt: new Date().toISOString(),
  sections: {
    abstract: "",
    introduction: "",
    literature_review: "",
    objectives: "",
    research_gap: "",
    methodology: "",
    conclusion: "",
  },
  sectionStatuses: {
    abstract: "idle",
    introduction: "idle",
    literature_review: "idle",
    objectives: "idle",
    research_gap: "idle",
    methodology: "idle",
    conclusion: "idle",
  },
};

export default function App() {
  const [project, setProject] = useState<PaperProject>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to restore saved project", e);
    }
    return DEFAULT_PROJECT;
  });

  const [activeTab, setActiveTab] = useState<"studio" | "reader" | "guide">("studio");
  const [activeSection, setActiveSection] = useState<"setup" | SectionKey>("setup");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [sectionErrors, setSectionErrors] = useState<Record<string, string | null>>({});

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    } catch (e) {
      console.error("Failed to persist project", e);
    }
  }, [project]);

  const updateProject = (updates: Partial<PaperProject>) => {
    setProject((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const updateSectionContent = (key: SectionKey, content: string) => {
    setProject((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [key]: content,
      },
      sectionStatuses: {
        ...prev.sectionStatuses,
        [key]: content.trim().length > 0 ? "edited" : "idle",
      },
    }));
  };

  // Generate single section via backend Gemini API
  const handleGenerateSection = async (
    sectionKey: SectionKey,
    customInstruction?: string
  ) => {
    if (!project.topic.trim()) {
      setActiveSection("setup");
      return;
    }

    setSectionErrors((prev) => ({ ...prev, [sectionKey]: null }));
    setProject((prev) => ({
      ...prev,
      sectionStatuses: { ...prev.sectionStatuses, [sectionKey]: "generating" },
    }));

    try {
      const response = await fetch("/api/generate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: sectionKey,
          topic: project.topic,
          description: project.description,
          discipline: project.discipline,
          academicLevel: project.academicLevel,
          currentDraft: project.sections,
          customInstruction,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate section.");
      }

      setProject((prev) => ({
        ...prev,
        sections: {
          ...prev.sections,
          [sectionKey]: data.content,
        },
        sectionStatuses: {
          ...prev.sectionStatuses,
          [sectionKey]: "drafted",
        },
      }));
    } catch (err: any) {
      console.error(`Error generating section ${sectionKey}:`, err);
      const errMsg = err?.message || "Generation error. Please verify your connection.";
      setSectionErrors((prev) => ({ ...prev, [sectionKey]: errMsg }));
      setProject((prev) => ({
        ...prev,
        sectionStatuses: {
          ...prev.sectionStatuses,
          [sectionKey]: prev.sections[sectionKey] ? "drafted" : "idle",
        },
      }));
    }
  };

  // Refine existing section
  const handleRefineSection = async (
    sectionKey: SectionKey,
    refinementType: string,
    customNote?: string
  ) => {
    const current = project.sections[sectionKey];
    if (!current || !current.trim()) return;

    setSectionErrors((prev) => ({ ...prev, [sectionKey]: null }));

    try {
      const response = await fetch("/api/refine-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: sectionKey,
          topic: project.topic,
          currentContent: current,
          refinementType,
          customNote,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to refine section.");
      }

      setProject((prev) => ({
        ...prev,
        sections: {
          ...prev.sections,
          [sectionKey]: data.content,
        },
        sectionStatuses: {
          ...prev.sectionStatuses,
          [sectionKey]: "edited",
        },
      }));
    } catch (err: any) {
      console.error(`Error refining section ${sectionKey}:`, err);
      setSectionErrors((prev) => ({
        ...prev,
        [sectionKey]: err?.message || "Refinement failed. Try again.",
      }));
    }
  };

  // Batch generation for all remaining un-drafted sections
  const handleGenerateAll = async () => {
    if (!project.topic.trim()) {
      setActiveSection("setup");
      return;
    }

    setIsGeneratingAll(true);
    setActiveTab("studio");

    for (const key of SECTION_ORDER) {
      // If not drafted, generate it
      if (!project.sections[key] || project.sections[key].trim().length === 0) {
        setActiveSection(key);
        await handleGenerateSection(key);
      }
    }

    setIsGeneratingAll(false);
  };

  // Calculated stats
  const draftedCount = SECTION_ORDER.filter(
    (key) => project.sections[key] && project.sections[key].trim().length > 0
  ).length;

  const totalWords = SECTION_ORDER.reduce((acc, key) => {
    const text = project.sections[key] || "";
    return acc + (text ? text.split(/\s+/).filter(Boolean).length : 0);
  }, 0);

  const activeMeta = SECTION_METAS.find((m) => m.key === activeSection);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenExport={() => setIsExportModalOpen(true)}
        draftedCount={draftedCount}
        totalSections={SECTION_ORDER.length}
        totalWords={totalWords}
      />

      {/* Main Workspace Canvas */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar (Only in Section Studio tab) */}
        {activeTab === "studio" && (
          <Sidebar
            project={project}
            activeSection={activeSection}
            onSelectSection={(sec) => setActiveSection(sec)}
            onGenerateAll={handleGenerateAll}
            isGeneratingAll={isGeneratingAll}
          />
        )}

        {/* Central Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {activeTab === "studio" && (
            <>
              {activeSection === "setup" ? (
                <TopicSetup
                  project={project}
                  onUpdateProject={updateProject}
                  onStartDrafting={() => setActiveSection("abstract")}
                  onGenerateAll={handleGenerateAll}
                  isGeneratingAll={isGeneratingAll}
                />
              ) : activeMeta ? (
                <SectionEditor
                  key={activeMeta.key}
                  meta={activeMeta}
                  project={project}
                  onUpdateContent={(content) =>
                    updateSectionContent(activeMeta.key, content)
                  }
                  onGenerate={(customInstruction) =>
                    handleGenerateSection(activeMeta.key, customInstruction)
                  }
                  onRefine={(type, note) =>
                    handleRefineSection(activeMeta.key, type, note)
                  }
                  isGenerating={
                    project.sectionStatuses[activeMeta.key] === "generating"
                  }
                  error={sectionErrors[activeMeta.key] || null}
                  onClearError={() =>
                    setSectionErrors((prev) => ({
                      ...prev,
                      [activeMeta.key]: null,
                    }))
                  }
                />
              ) : null}
            </>
          )}

          {activeTab === "reader" && (
            <FullPaperView
              project={project}
              onNavigateToSection={(sec) => {
                setActiveTab("studio");
                setActiveSection(sec);
              }}
              onOpenExport={() => setIsExportModalOpen(true)}
            />
          )}

          {activeTab === "guide" && <IntegrityGuide />}
        </main>
      </div>

      {/* Export Manuscript Modal */}
      <ExportModal
        project={project}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
