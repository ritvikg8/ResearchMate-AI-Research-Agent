import React from "react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = "",
}) => {
  if (!content || !content.trim()) {
    return (
      <div className="py-12 text-center text-slate-400 italic text-sm">
        No content generated yet. Click "Generate with Gemini" or select a preset to begin drafting.
      </div>
    );
  }

  // Parse lines into structured blocks
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listType: "ul" | "ol" = "ul";
  let listItems: string[] = [];

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      if (listType === "ul") {
        elements.push(
          <ul key={key} className="space-y-2 my-3 pl-5 list-disc text-slate-700 marker:text-sky-500">
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {renderInlineFormatting(item)}
              </li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={key} className="space-y-2 my-3 pl-5 list-decimal text-slate-700 marker:font-semibold marker:text-slate-800">
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {renderInlineFormatting(item)}
              </li>
            ))}
          </ol>
        );
      }
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Check for list item
    const ulMatch = trimmed.match(/^[-*]\s+(.*)$/);
    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);

    if (ulMatch) {
      if (!inList || listType !== "ul") {
        flushList(`list-flush-${index}`);
        inList = true;
        listType = "ul";
      }
      listItems.push(ulMatch[1]);
      return;
    } else if (olMatch) {
      if (!inList || listType !== "ol") {
        flushList(`list-flush-${index}`);
        inList = true;
        listType = "ol";
      }
      listItems.push(olMatch[2]);
      return;
    } else {
      flushList(`list-flush-pre-${index}`);
    }

    // Empty lines
    if (!trimmed) {
      elements.push(<div key={`spacer-${index}`} className="h-3" />);
      return;
    }

    // Notice or Verification bracket block
    if (
      trimmed.startsWith("*[Notice:") ||
      trimmed.startsWith("[Notice:") ||
      trimmed.includes("Requires Empirical Verification") ||
      trimmed.includes("Subject to Institutional")
    ) {
      elements.push(
        <div
          key={`notice-${index}`}
          className="my-3 p-3.5 rounded-lg bg-sky-50/70 border border-sky-200 text-sky-950 text-xs leading-relaxed"
        >
          <div className="font-semibold text-sky-900 mb-0.5 tracking-wide">
            ACADEMIC VERIFICATION ADVISORY
          </div>
          <div>{renderInlineFormatting(trimmed.replace(/^(\*\[|\[|\*)/, "").replace(/(\]\*|\]|\*)$/, ""))}</div>
        </div>
      );
      return;
    }

    // Headers
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h4
          key={`h4-${index}`}
          className="text-base font-semibold text-slate-900 mt-5 mb-2 tracking-tight"
        >
          {renderInlineFormatting(trimmed.slice(4))}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith("## ")) {
      elements.push(
        <h3
          key={`h3-${index}`}
          className="text-lg font-bold text-slate-900 mt-6 mb-3 pb-1 border-b border-slate-100 tracking-tight"
        >
          {renderInlineFormatting(trimmed.slice(3))}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith("# ")) {
      elements.push(
        <h2
          key={`h2-${index}`}
          className="text-xl font-extrabold text-slate-900 mt-6 mb-3 tracking-tight"
        >
          {renderInlineFormatting(trimmed.slice(2))}
        </h2>
      );
      return;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      elements.push(
        <blockquote
          key={`quote-${index}`}
          className="my-3 pl-4 py-1 border-l-2 border-sky-400 text-slate-600 italic text-sm"
        >
          {renderInlineFormatting(trimmed.slice(2))}
        </blockquote>
      );
      return;
    }

    // Standard paragraph
    elements.push(
      <p key={`p-${index}`} className="text-slate-700 leading-relaxed my-2 text-sm md:text-base">
        {renderInlineFormatting(trimmed)}
      </p>
    );
  });

  flushList("list-flush-final");

  return <div className={`space-y-1 ${className}`}>{elements}</div>;
};

// Helper for inline markdown like **bold**, *italic*, `code`, and [Citation placeholders]
function renderInlineFormatting(text: string): React.ReactNode {
  // Replace citations / brackets like [Author, 2024 - Verify] with a distinct scholarly badge
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  // Regex to match citation placeholders: e.g. [Key Reference... - Verify]
  const citationRegex = /\[(.*?Verify.*?)\]/g;
  let lastIndex = 0;
  let match;

  while ((match = citationRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={`txt-${keyIdx++}`}>
          {formatBasicStyles(text.slice(lastIndex, match.index))}
        </span>
      );
    }
    parts.push(
      <span
        key={`cite-${keyIdx++}`}
        className="inline-block px-1.5 py-0.5 mx-1 rounded bg-amber-50 border border-amber-200 text-amber-900 font-mono text-xs"
        title="Scholarly placeholder: verify against real literature"
      >
        [{match[1]}]
      </span>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(
      <span key={`txt-${keyIdx++}`}>
        {formatBasicStyles(text.slice(lastIndex))}
      </span>
    );
  }

  return parts.length > 0 ? parts : formatBasicStyles(text);
}

function formatBasicStyles(text: string): React.ReactNode {
  // Handle **bold**, *italic*, and `code`
  const tokens = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

  return tokens.map((token, i) => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-slate-900">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith("*") && token.endsWith("*")) {
      return (
        <em key={i} className="italic text-slate-800">
          {token.slice(1, -1)}
        </em>
      );
    }
    if (token.startsWith("`") && token.endsWith("`")) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-100 text-slate-800 font-mono text-xs border border-slate-200"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    return token;
  });
}
