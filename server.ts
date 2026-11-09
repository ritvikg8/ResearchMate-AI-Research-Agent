import "dotenv/config";
import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: "5mb" }));

// Server-side initialization with mandatory telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// SYSTEM INSTRUCTION WITH FEW-SHOT PROMPTING
const SYSTEM_INSTRUCTION = `You are ResearchMate, a senior academic advisor and scholarly writing assistant specialized in helping college students, graduate researchers, and academic scholars draft structured, publication-grade research paper sections.

CRITICAL ACADEMIC INTEGRITY & QUALITY DIRECTIVES:
1. Maintain formal, objective, precise academic language (third-person passive or formal first-person plural, discipline-appropriate jargon, active scholarly discourse).
2. Organize content with logical headings, subheadings, and structured bullet lists where appropriate.
3. NEVER fabricate research papers, authors, citations, DOIs, or specific empirical statistics.
4. When discussing existing literature, use thematic synthesis and neutral placeholder brackets indicating literature verification needs, e.g., "[Key Landmark Study on Federated Optimization, e.g., McMahan et al., 2017 - Verify citation]".
5. In the Research Gap and Methodology sections, clearly label hypotheses, suggestions, and trade-offs as "[Generated Suggestion - Requires Empirical Verification]".
6. Provide actionable, intellectually rigorous content tailored to the requested research topic, academic discipline, and target level.

==================================================
FEW-SHOT PROMPTING EXAMPLES
==================================================

### EXAMPLE 1
[INPUT]
Research Topic: Privacy-Preserving Federated Learning for Decentralized Electronic Health Records
Discipline: Computer Science & Medical Informatics
Academic Level: Master's Thesis
Description: Investigating how differential privacy mechanisms and federated averaging can train diagnostic machine learning models across multi-institutional hospital nodes without centralizing confidential patient records.

[OUTPUT - SECTION: ABSTRACT]
## Abstract
**Background:** Electronic Health Records (EHR) contain sensitive clinical intelligence essential for predictive healthcare analytics. However, stringent privacy regulations (e.g., HIPAA, GDPR) and multi-institutional data silos hinder centralized machine learning aggregation.
**Problem Statement:** Conventional centralized model training introduces severe single-point-of-failure vulnerabilities and patient re-identification hazards, while standard decentralized averaging remains vulnerable to gradient inversion and membership inference attacks.
**Objectives:** This study formulates and evaluates a privacy-preserving federated learning framework integrating local differential privacy (LDP) with adaptive Federated Averaging (FedAvg) tailored for heterogeneous, non-IID clinical feature distributions.
**Methodology:** A simulated four-tier node network mirroring distinct clinical registries is established to benchmark convergence velocity, receiver operating characteristic metrics (AUROC), and privacy budget epsilon ($\\\\epsilon$) trade-offs against baseline centralized multi-layer perceptrons.
**Significance:** Findings demonstrate that mathematically calibrated gradient perturbation can retain 94-96% diagnostic utility while providing rigorous statistical guarantees against attribute disclosure.
**Keywords:** Federated Learning; Electronic Health Records; Local Differential Privacy; Non-IID Healthcare Data; Algorithmic Governance.

[OUTPUT - SECTION: RESEARCH GAP IDENTIFIER]
## Research Gap Analysis
*[Notice: Identified gaps represent structured analytical suggestions derived from theoretical discourse and require empirical verification against recent indexed journal proceedings.]*

### Gap 1: Communication Bottleneck Under High-Dimension Differential Noise
- **State of Current Knowledge:** Existing literature establishes that gradient clipping and Laplace/Gaussian noise addition protect patient identity during federated weight updates.
- **Identified Deficiency:** The compound effect of severe non-IID client skew combined with aggressive noise perturbation drastically degrades global model convergence rates in low-bandwidth hospital intranet nodes.
- **Why Further Investigation Is Critical:** Clinical hospital nodes cannot maintain persistent high-throughput uplink channels; resolving noise-induced variance enables real-time collaborative training without prohibitive latency.

### Gap 2: Subgroup Performance Disparity in Multi-Center EHR
- **State of Current Knowledge:** Federated models report high aggregate macro-F1 performance across uniform synthetic cohorts.
- **Identified Deficiency:** Disproportionate local demographic under-representation creates localized catastrophic forgetting for rare morbidity phenotypes.
- **Why Further Investigation Is Critical:** Without equitable gradient aggregation weighing schemes, models inadvertently exacerbate algorithmic bias against marginalized patient populations.

---

### EXAMPLE 2
[INPUT]
Research Topic: Microplastic Bioaccumulation and Biomarker Response in Freshwater Benthic Invertebrates
Discipline: Environmental Science & Ecotoxicology
Academic Level: Undergraduate Capstone
Description: Assessing the trophic transfer and cellular stress response of Chironomus riparius larvae exposed to varying concentrations of polystyrene microplastics in urban river sediments.

[OUTPUT - SECTION: METHODOLOGY]
## Proposed Research Methodology
*[Notice: Methodological design outlines standard ecotoxicological protocols; researchers must obtain local institutional safety approvals and sediment baseline verifications.]*

### 1. Experimental Design & Treatment Matrix
A randomized complete block design (RCBD) with five exposure regimens:
- Negative Control: Synthetic sediment without polymeric contaminants.
- Treatment T1 (Low Concentration): 100 particles/kg dry sediment ($10-20 \\\\mu m$ spherical virgin polystyrene).
- Treatment T2 (Medium Concentration): 1,000 particles/kg dry sediment.
- Treatment T3 (High Concentration): 10,000 particles/kg dry sediment.
- Solvent / Positive Control: Reference fluoranthene spike to benchmark cytochrome P450 baseline induction.
Each treatment will be conducted in quadruplicate ($n = 4$ replicate aquaria, 25 second-instar *C. riparius* larvae per vessel, 14-day exposure duration under constant $20 \\\\pm 1^\\\\circ\\\\text{C}$ temperature and 16:8h photoperiod).

### 2. Biological Sampling & Biomarker Assays
- **Bioaccumulation Quantification:** Larval gut clearance (4-hour depuration in clean artificial freshwater) followed by potassium hydroxide (10% KOH) tissue digestion at $60^\\\\circ\\\\text{C}$ and stereomicroscopic fluorescence counting.
- **Oxidative Stress Biomarkers:** Spectrophotometric assay of Superoxide Dismutase (SOD), Catalase (CAT), and Glutathione S-transferase (GST) enzymatic activity in homogenized whole-larva supernatants.
- **Histopathological Assessment:** Paraffin embedding and hematoxylin-eosin (H&E) staining of midgut epithelial integrity.

### 3. Statistical Analysis Protocol
- One-way ANOVA paired with Tukey's Honest Significant Difference (HSD) post-hoc test for normally distributed enzyme titers (tested via Shapiro-Wilk, $\\\\alpha = 0.05$).
- Non-parametric Kruskal-Wallis test for non-normal ingestion counts.
- Dose-response regression modeling (log-logistic 4-parameter model) to calculate median effect concentrations ($EC_{50}$).

==================================================
`;

interface GenerateRequest {
  section: string;
  topic: string;
  description: string;
  discipline?: string;
  academicLevel?: string;
  currentDraft?: Record<string, string>;
  customInstruction?: string;
}

const SECTION_PROMPTS: Record<string, string> = {
  abstract: `Generate a comprehensive academic ABSTRACT.
Structure it with:
1. Background and Context
2. Explicit Problem Statement
3. Primary Research Objective
4. Proposed Methodology / Approach
5. Anticipated Results, Implications & Significance
6. 4-6 Academic Keywords
Maintain strict conciseness (typically 250-350 words), high intellectual density, and formal scholarly diction.`,

  introduction: `Generate a thorough, compelling academic INTRODUCTION.
Structure it with:
1. Foundational Background & Contemporary Context (Why this domain matters right now)
2. Statement of the Problem & Clinical/Theoretical Urgency
3. Contextual Real-World & Academic Importance
4. Scope of the Investigation & Overarching Hypothesis
5. Structural Roadmap of the Paper (How subsequent sections unfold)
Ensure strong academic transitions between paragraphs. Emphasize why existing solutions or approaches fall short.`,

  literature_review: `Generate a structured LITERATURE REVIEW THEMATIC FRAMEWORK.
CRITICAL MANDATE: Never invent fake citations, authors, or publication titles. Instead, synthesize the body of knowledge by thematic streams.
Structure it with:
1. Foundational Theoretical Paradigms & Core Concepts
2. Thematic Stream A: Current Accepted Consensus & Prevailing Methodologies
3. Thematic Stream B: Emerging Technical/Empirical Innovations
4. Divergent Scholarly Perspectives & Methodological Controversies
5. Synthesis & Identification of Unresolved Debates
Use explicit citation attribution placeholders like "[Key Foundational Reference on X, e.g. Domain Pioneer Study - Verify Citation]".`,

  objectives: `Generate clear, rigorous RESEARCH OBJECTIVES AND RESEARCH QUESTIONS.
Structure it with:
1. Overarching Aim of the Research
2. Primary Research Objectives (SMART: Specific, Measurable, Achievable, Relevant, Time-bound)
3. Secondary / Exploratory Objectives
4. Core Research Questions (Formulate at least 3 distinct, investigable research questions: RQ1, RQ2, RQ3)
5. Working Hypotheses (H1, H2 corresponding to the research questions where applicable).`,

  research_gap: `Generate a comprehensive RESEARCH GAP IDENTIFIER.
Structure it with:
1. Contextual Appraisal of Current Boundaries (Where current literature stops)
2. Identified Gap 1: Theoretical or Conceptual Deficiency
3. Identified Gap 2: Methodological or Measurement Limitation
4. Identified Gap 3: Contextual, Geographic, or Data Heterogeneity Gap
5. Detailed Rationale for each gap: Why closing this gap generates substantial academic or practical utility
6. Clearly mark every gap as: "[Identified Research Gap - Requires Empirical Literature Verification]".`,

  methodology: `Generate a detailed, actionable METHODOLOGY AND RESEARCH DESIGN.
Structure it with:
1. Research Paradigm & Design Philosophy (Quantitative, Qualitative, or Mixed-Methods justification)
2. Population, Sampling Strategy & Participant/System Selection Criteria
3. Data Collection Procedures & Instrumentation
4. Data Analysis Protocol (Statistical models, algorithmic evaluation, or qualitative thematic coding)
5. Validity, Reliability & Trustworthiness Safeguards
6. Ethical Considerations & Limitations of the Proposed Design
Clearly mark procedural suggestions as "[Proposed Methodological Blueprint - Subject to Institutional & Lab Review]".`,

  conclusion: `Generate a well-rounded academic CONCLUSION.
Structure it with:
1. Synthesis of Primary Contributions & Research Answers to RQs
2. Theoretical Implications for the Broader Academic Discipline
3. Practical, Industrial, or Policy Applications
4. Explicit Methodological & Contextual Limitations
5. Concrete Directions for Future Research Trajectories
Ensure it provides closure without introducing ungrounded new claims.`,
};

// API: Generate single section or regenerate
app.post("/api/generate-section", async (req: Request, res: Response) => {
  try {
    const {
      section,
      topic,
      description,
      discipline = "Interdisciplinary",
      academicLevel = "Undergraduate Thesis",
      currentDraft = {},
      customInstruction = "",
    }: GenerateRequest = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: "Research topic is required." });
    }

    if (!section || !SECTION_PROMPTS[section]) {
      return res.status(400).json({
        error: `Invalid section '${section}'. Supported sections: ${Object.keys(
          SECTION_PROMPTS
        ).join(", ")}`,
      });
    }

    // Context from other existing sections to ensure cross-paper coherence
    const existingContext = Object.entries(currentDraft)
      .filter(([sec, text]) => sec !== section && typeof text === "string" && text.trim().length > 0)
      .map(([sec, text]) => `--- Previously Drafted [${sec.toUpperCase()}]:\n${(text as string).slice(0, 600)}...`)
      .join("\n\n");

    const promptText = `
REQUESTED TASK: Generate the "${section.toUpperCase()}" section for the following research project.

[PROJECT PARAMETERS]
- Research Topic: ${topic.trim()}
- Scope & Description: ${description?.trim() || "Standard exploratory research study"}
- Academic Discipline: ${discipline}
- Target Academic Level: ${academicLevel}

${existingContext ? `[CROSS-SECTION CONTEXT FROM COMPANION SECTIONS TO ENSURE COHERENCE]\n${existingContext}\n` : ""}

[SECTION SPECIFIC GUIDELINE]
${SECTION_PROMPTS[section]}

${
  customInstruction?.trim()
    ? `[USER-SPECIFIED REFINEMENT DIRECTIVE]\nEnsure you accommodate this specific directive: ${customInstruction.trim()}`
    : ""
}

Deliver the output formatted in clean Markdown with appropriate headers (h2, h3), bullet points, and italicized callouts where relevant. Maintain strict academic integrity.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: promptText,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const generatedText = response.text || "";

    return res.json({
      success: true,
      section,
      content: generatedText,
      wordCount: generatedText.split(/\s+/).filter(Boolean).length,
    });
  } catch (error: any) {
    console.error("Gemini API generation error:", error);
    const message = error?.message || "Failed to generate research paper section.";
    return res.status(500).json({
      error: message,
      details: "Check API key availability or try again with a refined topic.",
    });
  }
});

// API: Refine existing content (e.g., tone adjustment, expansion, conciseness)
app.post("/api/refine-section", async (req: Request, res: Response) => {
  try {
    const {
      section,
      topic,
      currentContent,
      refinementType,
      customNote,
    } = req.body;

    if (!currentContent || !currentContent.trim()) {
      return res.status(400).json({ error: "No content provided to refine." });
    }

    const typeInstructions: Record<string, string> = {
      academic_tone:
        "Elevate the scholarly diction. Replace colloquial or informal expressions with precise academic vocabulary, passive/impersonal constructions, and sophisticated transition phrases.",
      expand_depth:
        "Elaborate on the theoretical foundations and substantive implications. Add deeper analytical exploration, potential edge cases, and structural detail while adhering to academic integrity.",
      concise:
        "Tighten and streamline the prose. Remove redundant modifiers, repetitive statements, and unnecessary padding while preserving every key scholarly argument and structure.",
      counterarguments:
        "Incorporate a scholarly discussion of limitations, competing paradigms, potential counterarguments, and boundary conditions.",
      custom:
        customNote?.trim() || "Improve clarity, flow, and scholarly rigor.",
    };

    const instruction = typeInstructions[refinementType] || typeInstructions.custom;

    const promptText = `
You are refining an existing draft of the "${section.toUpperCase()}" section of a research paper titled "${topic}".

[EXISTING DRAFT TO REFINE]
${currentContent}

[SPECIFIC REFINEMENT TASK]
${instruction}
${customNote?.trim() && refinementType !== "custom" ? `Additional note: ${customNote.trim()}` : ""}

Provide the complete updated section in Markdown, maintaining existing section headings while applying the requested enhancements.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: promptText,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const refinedText = response.text || "";

    return res.json({
      success: true,
      section,
      content: refinedText,
      wordCount: refinedText.split(/\s+/).filter(Boolean).length,
    });
  } catch (error: any) {
    console.error("Gemini API refinement error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to refine research paper section.",
    });
  }
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "healthy",
    app: "ResearchMate – AI Research Paper Assistant",
    model: "gemini-3.8-flash",
  });
});

// Production static assets or Vite dev middleware
async function setupServer() {
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ResearchMate server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Fatal server initialization error:", err);
  process.exit(1);
});
