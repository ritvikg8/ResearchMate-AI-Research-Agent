export type SectionKey =
  | "abstract"
  | "introduction"
  | "literature_review"
  | "objectives"
  | "research_gap"
  | "methodology"
  | "conclusion";

export type AcademicLevel =
  | "Undergraduate Capstone"
  | "Master's Thesis"
  | "Doctoral Dissertation"
  | "Journal Preprint"
  | "Conference Workshop";

export type AcademicDiscipline =
  | "Computer Science & AI"
  | "Environmental Sciences"
  | "Biomedical & Health Sciences"
  | "Economics & Business"
  | "Social Sciences & Psychology"
  | "Engineering & Robotics"
  | "Interdisciplinary";

export interface PaperProject {
  id: string;
  topic: string;
  description: string;
  discipline: AcademicDiscipline;
  academicLevel: AcademicLevel;
  authorName: string;
  institution: string;
  createdAt: string;
  sections: Record<SectionKey, string>;
  sectionStatuses: Record<SectionKey, "idle" | "generating" | "drafted" | "edited">;
}

export interface SectionMeta {
  key: SectionKey;
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  guidance: string;
  placeholderPrompt: string;
  ethicalNotice?: string;
}

export interface PresetTopic {
  title: string;
  discipline: AcademicDiscipline;
  academicLevel: AcademicLevel;
  description: string;
}
