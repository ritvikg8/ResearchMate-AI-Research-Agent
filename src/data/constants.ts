import { SectionMeta, PresetTopic, SectionKey } from "../types";

export const SECTION_METAS: SectionMeta[] = [
  {
    key: "abstract",
    number: "01",
    title: "Structured Academic Abstract",
    shortTitle: "Abstract",
    description: "Self-contained synthesis covering context, problem statement, objectives, methods, and expected significance.",
    guidance: "A standard academic abstract should be between 200-350 words. It concisely outlines the background, core problem, methodology, findings, and 4-6 keywords without internal citations.",
    placeholderPrompt: "E.g., Highlight clinical diagnostic efficiency and local differential privacy budget constraints.",
  },
  {
    key: "introduction",
    number: "02",
    title: "Introduction & Contextual Framework",
    shortTitle: "Introduction",
    description: "Establishes domain background, clinical/societal importance, primary problem urgency, and document structural roadmap.",
    guidance: "Provide broad contextual background and progressively narrow down to your specific problem statement. Conclude with an explicit structural outline of the rest of the manuscript.",
    placeholderPrompt: "E.g., Emphasize why multi-center healthcare data silos currently prevent collaborative machine learning.",
  },
  {
    key: "literature_review",
    number: "03",
    title: "Literature Review & Thematic Synthesis",
    shortTitle: "Literature Review",
    description: "Synthesizes prevailing theoretical paradigms and research themes without fabricating paper authors or citations.",
    guidance: "Do not invent authors or specific publication citations. ResearchMate groups established research into thematic streams and highlights open controversies using verifiable attribution placeholders.",
    placeholderPrompt: "E.g., Group by centralized vs. decentralized privacy approaches and Byzantine fault tolerance.",
    ethicalNotice: "Integrity Rule: ResearchMate uses thematic placeholders like [Author/Study, Year - Verify]. Always substitute these with peer-reviewed papers from your university library or Google Scholar.",
  },
  {
    key: "objectives",
    number: "04",
    title: "Research Objectives & Questions",
    shortTitle: "Objectives & RQs",
    description: "Formulates unambiguous SMART objectives alongside primary and secondary investigative research questions.",
    guidance: "Frame clear, testable research questions (RQ1, RQ2, RQ3) and corresponding hypotheses (H1, H2) that directly map to your methodology and anticipated analytical outputs.",
    placeholderPrompt: "E.g., Focus on convergence speed under non-IID conditions and empirical privacy loss guarantees.",
  },
  {
    key: "research_gap",
    number: "05",
    title: "Research Gap Identification",
    shortTitle: "Research Gaps",
    description: "Pinpoints unresolved deficiencies in current literature and articulates why empirical investigation is scientifically valuable.",
    guidance: "Categorize gaps into theoretical omissions, methodological limitations, or contextual barriers. Each gap must state the current state of knowledge and the exact deficiency.",
    placeholderPrompt: "E.g., Explore performance degradation on under-represented patient demographic subgroups.",
    ethicalNotice: "Research gaps are generated as scholarly analytical suggestions. Verify against recent conference proceedings and literature reviews.",
  },
  {
    key: "methodology",
    number: "06",
    title: "Proposed Methodology & Design",
    shortTitle: "Methodology",
    description: "Rigorous blueprint outlining experimental setup, sampling, instrumentation, analytical models, and validation protocols.",
    guidance: "Specify quantitative algorithms, experimental sample sizes, treatment cohorts, statistical significance benchmarks (e.g., ANOVA, p-values), and reproducibility controls.",
    placeholderPrompt: "E.g., Specify a 4-node federated testbed with Dirichlet distribution client data partitioning.",
  },
  {
    key: "conclusion",
    number: "07",
    title: "Conclusion & Future Trajectories",
    shortTitle: "Conclusion",
    description: "Synthesizes main scholarly arguments, theoretical and practical contributions, study limitations, and future research directions.",
    guidance: "Summarize findings in direct relation to your stated objectives without introducing new unsupported claims. Address ethical constraints and offer concrete future research avenues.",
    placeholderPrompt: "E.g., Address edge-device battery constraints as an operational limitation.",
  },
];

export const PRESET_TOPICS: PresetTopic[] = [
  {
    title: "Privacy-Preserving Federated Learning for Decentralized Electronic Health Records",
    discipline: "Computer Science & AI",
    academicLevel: "Master's Thesis",
    description:
      "Investigating how differential privacy mechanisms and federated averaging can train diagnostic machine learning models across multi-institutional hospital nodes without centralizing confidential patient records.",
  },
  {
    title: "Microplastic Bioaccumulation and Biomarker Response in Freshwater Benthic Invertebrates",
    discipline: "Environmental Sciences",
    academicLevel: "Undergraduate Capstone",
    description:
      "Assessing the trophic transfer, oxidative stress biomarkers (SOD, CAT), and cellular toxicity of polystyrene microfibers on Chironomus riparius larvae exposed to urban river sediment gradients.",
  },
  {
    title: "Large Language Models in Legal Due Diligence: Accuracy, Hallucination Risks, and Liability",
    discipline: "Interdisciplinary",
    academicLevel: "Journal Preprint",
    description:
      "Evaluating retrieval-augmented generation (RAG) vs. zero-shot commercial foundation models in extracting risk covenants from commercial merger agreements, with an empirical assessment of hallucination frequency.",
  },
  {
    title: "Techno-Economic Feasibility of Green Hydrogen Storage for Island Microgrids",
    discipline: "Engineering & Robotics",
    academicLevel: "Master's Thesis",
    description:
      "Simulating seasonal renewable energy storage utilizing proton-exchange membrane (PEM) electrolyzers and metal hydride tanks to displace diesel generators on isolated coastal microgrids.",
  },
];

export const SECTION_ORDER: SectionKey[] = [
  "abstract",
  "introduction",
  "literature_review",
  "objectives",
  "research_gap",
  "methodology",
  "conclusion",
];
