import React, { useState } from 'react';
import { marked, Tokens } from 'marked';
import {
  Sparkles,
  Check,
  Copy,
  ExternalLink,
  Quote,
  Layers,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export interface HeadingItem {
  id: string;
  text: string;
  depth: number;
}

interface MarkdownRendererProps {
  content: string;
  showOutline?: boolean;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  showOutline = true,
  className = '',
}) => {
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);

  if (!content || !content.trim()) {
    return (
      <div className="text-slate-400 dark:text-cream-400 italic py-4">
        No content provided.
      </div>
    );
  }

  // Tokenize using marked.lexer
  const tokens = marked.lexer(content);

  // Extract H2 and H3 headings for the quick outline
  const headings: HeadingItem[] = [];
  tokens.forEach((t) => {
    if (t.type === 'heading' && (t.depth === 2 || t.depth === 3)) {
      headings.push({
        id: slugify(t.text),
        text: t.text,
        depth: t.depth,
      });
    }
  });

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Helper to render inline tokens safely
  const renderInlineTokens = (
    inlineTokens: Tokens.Generic[] | undefined,
    parentKey: string
  ): React.ReactNode => {
    if (!inlineTokens || inlineTokens.length === 0) return null;

    return inlineTokens.map((t, idx) => {
      const key = `${parentKey}-inline-${idx}`;

      switch (t.type) {
        case 'strong':
          return (
            <strong
              key={key}
              className="font-bold text-slate-900 dark:text-cream-50"
            >
              {renderInlineTokens(t.tokens, key)}
            </strong>
          );

        case 'em':
          return (
            <em
              key={key}
              className="italic text-slate-800 dark:text-cream-100"
            >
              {renderInlineTokens(t.tokens, key)}
            </em>
          );

        case 'codespan':
          return (
            <code
              key={key}
              className="px-1.5 py-0.5 rounded-md font-mono text-xs font-semibold bg-sand-200/60 dark:bg-forest-800/80 text-crimson-700 dark:text-powder-300 border border-sand-300/60 dark:border-forest-700"
            >
              {t.text}
            </code>
          );

        case 'link':
          return (
            <a
              key={key}
              href={t.href}
              title={t.title || undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-semibold text-crimson-600 dark:text-powder-300 hover:text-crimson-700 dark:hover:text-powder-200 underline decoration-crimson-300 dark:decoration-powder-500/50 underline-offset-2 transition"
            >
              <span>{renderInlineTokens(t.tokens, key)}</span>
              <ExternalLink className="w-3 h-3 inline-block shrink-0 opacity-70" />
            </a>
          );

        case 'del':
          return (
            <del
              key={key}
              className="line-through text-slate-400 dark:text-cream-400"
            >
              {renderInlineTokens(t.tokens, key)}
            </del>
          );

        case 'br':
          return <br key={key} />;

        case 'text':
        default:
          if (t.tokens && t.tokens.length > 0) {
            return renderInlineTokens(t.tokens, key);
          }
          return <React.Fragment key={key}>{t.text}</React.Fragment>;
      }
    });
  };

interface ParsedItem {
  label: string | null;
  descTokens: Tokens.Generic[];
}

  // Helper to detect if a list item begins with a bold label like **Label:** Description
  const parseLabeledItem = (item: Tokens.ListItem): ParsedItem => {
    // In marked, item.tokens often starts with a 'text' token whose first child token is 'strong'
    const firstBlock = item.tokens?.[0];
    if (firstBlock && firstBlock.type === 'text' && firstBlock.tokens) {
      const firstChild = firstBlock.tokens[0];
      if (firstChild && firstChild.type === 'strong') {
        const rawLabel = firstChild.text || '';
        // If it looks like a term label (e.g. "Marketing:", "Product:", "Place (Distribution):")
        const cleanLabel = rawLabel.replace(/:\s*$/, '').trim();
        // The remaining tokens in this block
        const remainingChildTokens = firstBlock.tokens.slice(1);
        // And any other blocks in the list item
        const remainingBlocks = item.tokens.slice(1);

        const allRemaining = [...remainingChildTokens, ...remainingBlocks];
        return { label: cleanLabel, descTokens: allRemaining };
      }
    }
    return { label: null, descTokens: item.tokens || [] };
  };

  // Render block tokens
  let leadParagraphRendered = false;

  const renderBlocks = (blockTokens: Tokens.Generic[]): React.ReactNode => {
    return blockTokens.map((token, index) => {
      const key = `block-${index}`;

      switch (token.type) {
        case 'heading': {
          const headingSlug = slugify(token.text || '');

          if (token.depth === 1) {
            return (
              <h1
                key={key}
                id={headingSlug}
                className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-cream-50 mt-12 mb-6 tracking-tight border-b border-sand-200 dark:border-forest-800 pb-3"
              >
                {renderInlineTokens(token.tokens, key)}
              </h1>
            );
          }

          if (token.depth === 2) {
            leadParagraphRendered = false; // Reset lead paragraph flag for next section
            return (
              <div
                key={key}
                id={headingSlug}
                className="scroll-mt-24 mt-12 sm:mt-14 mb-5 pt-3 group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-crimson-600 dark:bg-powder-400" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-crimson-700 dark:text-powder-300">
                    Core Concept
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-3xl font-display font-black text-slate-900 dark:text-cream-50 tracking-tight leading-snug flex items-start gap-3.5">
                  <span className="w-1.5 h-8 rounded-full bg-gradient-to-b from-crimson-600 to-crimson-800 dark:from-powder-400 dark:to-powder-600 shrink-0 mt-0.5" />
                  <span className="flex-1">
                    {renderInlineTokens(token.tokens, key)}
                  </span>
                </h2>
              </div>
            );
          }

          if (token.depth === 3) {
            return (
              <div
                key={key}
                id={headingSlug}
                className="scroll-mt-24 mt-9 sm:mt-11 mb-4 group"
              >
                <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-cream-50 tracking-tight leading-snug flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-crimson-600 dark:text-powder-400 shrink-0" />
                  <span>{renderInlineTokens(token.tokens, key)}</span>
                </h3>
              </div>
            );
          }

          // Depth 4+
          return (
            <h4
              key={key}
              id={headingSlug}
              className="scroll-mt-24 text-base sm:text-lg font-display font-bold text-slate-800 dark:text-cream-100 mt-7 mb-3 tracking-tight flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sand-400 dark:bg-forest-600 shrink-0" />
              <span>{renderInlineTokens(token.tokens, key)}</span>
            </h4>
          );
        }

        case 'paragraph': {
          // If this is the first paragraph after a major heading, give it a prominent editorial lead style
          const isLead = !leadParagraphRendered;
          if (isLead) leadParagraphRendered = true;

          if (isLead) {
            return (
              <div
                key={key}
                className="my-5 p-5 sm:p-6 rounded-2xl bg-white/80 dark:bg-forest-900/40 border border-sand-200/90 dark:border-forest-800/80 shadow-2xs backdrop-blur-xs"
              >
                <p className="text-base sm:text-lg lg:text-xl text-slate-800 dark:text-cream-100 font-sans leading-relaxed tracking-normal">
                  {renderInlineTokens(token.tokens, key)}
                </p>
              </div>
            );
          }

          return (
            <p
              key={key}
              className="text-base sm:text-lg text-slate-700 dark:text-cream-200 font-sans leading-relaxed mb-5"
            >
              {renderInlineTokens(token.tokens, key)}
            </p>
          );
        }

        case 'list': {
          const isOrdered = Boolean(token.ordered);
          const items = token.items || [];

          // Check if any items have bold labels (e.g. Product:, Marketing:, etc.)
          const labeledItems: ParsedItem[] = items.map((it: Tokens.ListItem) => parseLabeledItem(it));
          const hasAnyLabels = labeledItems.some((it: ParsedItem) => it.label !== null);

          // CASE 1: Ordered list with framework labels (e.g., 4Ps Framework: 1. Product, 2. Price...)
          if (isOrdered) {
            return (
              <div key={key} className="space-y-3.5 my-6">
                {items.map((item: Tokens.ListItem, itemIdx: number) => {
                  const itemKey = `${key}-item-${itemIdx}`;
                  const { label, descTokens } = labeledItems[itemIdx];
                  const stepNumber = (token.start || 1) + itemIdx;

                  return (
                    <div
                      key={itemKey}
                      className="group p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-forest-900/60 border border-sand-200/90 dark:border-forest-800 shadow-2xs hover:border-sand-300 dark:hover:border-forest-700 hover:shadow-xs transition-all duration-200"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-crimson-600 to-crimson-800 dark:from-crimson-700 dark:to-crimson-900 text-cream-50 font-bold font-sans flex items-center justify-center text-sm shadow-2xs shrink-0 ring-4 ring-crimson-50 dark:ring-forest-950">
                          {stepNumber}
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          {label ? (
                            <>
                              <h4 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-cream-50 leading-snug group-hover:text-crimson-700 dark:group-hover:text-powder-300 transition-colors">
                                {label}
                              </h4>
                              <div className="text-sm sm:text-base text-slate-600 dark:text-cream-200 leading-relaxed mt-1.5 font-sans">
                                {renderInlineTokens(descTokens, itemKey)}
                              </div>
                            </>
                          ) : (
                            <div className="text-sm sm:text-base text-slate-700 dark:text-cream-200 leading-relaxed font-sans">
                              {renderInlineTokens(descTokens, itemKey)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }

          // CASE 2: Unordered list with labeled distinction cards (e.g., Marketing vs Advertising vs Sales, 7Ps, STP)
          if (hasAnyLabels) {
            return (
              <div key={key} className="space-y-3.5 my-6">
                {items.map((item: Tokens.ListItem, itemIdx: number) => {
                  const itemKey = `${key}-item-${itemIdx}`;
                  const { label, descTokens } = labeledItems[itemIdx];

                  return (
                    <div
                      key={itemKey}
                      className="group p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-forest-900/50 border border-sand-200/90 dark:border-forest-800 shadow-2xs hover:border-sand-300 dark:hover:border-forest-700 hover:shadow-xs transition-all duration-200"
                    >
                      {label ? (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-sand-100 dark:bg-forest-800 text-forest-950 dark:text-cream-50 border border-sand-300/80 dark:border-forest-700 shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-crimson-600 dark:bg-powder-400" />
                              {label}
                            </span>
                          </div>
                          <div className="text-sm sm:text-base text-slate-700 dark:text-cream-200 leading-relaxed font-sans pl-0.5">
                            {renderInlineTokens(descTokens, itemKey)}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3 text-sm sm:text-base text-slate-700 dark:text-cream-200 leading-relaxed font-sans">
                          <span className="w-1.5 h-1.5 rounded-full bg-crimson-600 dark:bg-powder-400 mt-2 shrink-0" />
                          <span>{renderInlineTokens(descTokens, itemKey)}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          }

          // CASE 3: Standard bullet list
          return (
            <ul key={key} className="space-y-2.5 my-5 pl-1">
              {items.map((item: Tokens.ListItem, itemIdx: number) => {
                const itemKey = `${key}-item-${itemIdx}`;
                return (
                  <li
                    key={itemKey}
                    className="flex items-start gap-3 text-base text-slate-700 dark:text-cream-200 leading-relaxed font-sans"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-crimson-600 dark:bg-powder-400 mt-2.5 shrink-0" />
                    <span className="flex-1">
                      {renderInlineTokens(item.tokens, itemKey)}
                    </span>
                  </li>
                );
              })}
            </ul>
          );
        }

        case 'hr': {
          return (
            <div key={key} className="my-10 flex items-center justify-center gap-3 py-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sand-300 dark:via-forest-700 to-transparent" />
              <div className="flex items-center gap-1.5 text-crimson-600/70 dark:text-powder-300/70 text-xs tracking-widest font-semibold select-none">
                <span>✦</span>
                <span className="w-1.5 h-1.5 rounded-full bg-crimson-600 dark:bg-powder-400" />
                <span>✦</span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sand-300 dark:via-forest-700 to-transparent" />
            </div>
          );
        }

        case 'blockquote': {
          return (
            <blockquote
              key={key}
              className="my-7 p-5 sm:p-6 rounded-2xl bg-sand-100/70 dark:bg-forest-900/50 border-l-4 border-crimson-600 dark:border-crimson-500 shadow-2xs relative"
            >
              <div className="flex items-start gap-3.5">
                <Quote className="w-6 h-6 text-crimson-600 dark:text-powder-300 shrink-0 mt-0.5 opacity-80" />
                <div className="text-base sm:text-lg italic font-serif text-slate-800 dark:text-cream-100 leading-relaxed">
                  {token.tokens ? renderBlocks(token.tokens) : token.text}
                </div>
              </div>
            </blockquote>
          );
        }

        case 'code': {
          const isCopied = copiedCodeIdx === index;
          return (
            <div
              key={key}
              className="my-6 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md"
            >
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
                <span>{token.lang || 'code'}</span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(token.text || '', index)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer text-xs"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-xs sm:text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed">
                <code>{token.text}</code>
              </pre>
            </div>
          );
        }

        case 'table': {
          const header = token.header || [];
          const rows = token.rows || [];

          return (
            <div
              key={key}
              className="my-6 overflow-x-auto rounded-2xl border border-sand-200 dark:border-forest-800 shadow-2xs"
            >
              <table className="w-full text-left text-sm text-slate-800 dark:text-cream-100 border-collapse">
                <thead className="bg-sand-100 dark:bg-forest-900/90 text-xs uppercase font-bold tracking-wider text-forest-950 dark:text-cream-50 border-b border-sand-200 dark:border-forest-800">
                  <tr>
                    {header.map((col: Tokens.TableCell, cIdx: number) => (
                      <th key={cIdx} className="px-4 py-3 font-semibold">
                        {renderInlineTokens(col.tokens, `${key}-th-${cIdx}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-200/80 dark:divide-forest-800/80 bg-white/70 dark:bg-forest-950/40">
                  {rows.map((row: Tokens.TableCell[], rIdx: number) => (
                    <tr
                      key={rIdx}
                      className="hover:bg-sand-50/50 dark:hover:bg-forest-900/40 transition-colors"
                    >
                      {row.map((cell: Tokens.TableCell, cellIdx: number) => (
                        <td key={cellIdx} className="px-4 py-3">
                          {renderInlineTokens(
                            cell.tokens,
                            `${key}-cell-${rIdx}-${cellIdx}`
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        case 'space':
          return null;

        default:
          if (token.text) {
            return (
              <p
                key={key}
                className="text-base sm:text-lg text-slate-700 dark:text-cream-200 leading-relaxed mb-4"
              >
                {token.text}
              </p>
            );
          }
          return null;
      }
    });
  };

  return (
    <div className={`article-prose space-y-2 ${className}`}>
      {/* Optional Interactive Outline / Section Jump Bar */}
      {showOutline && headings.length > 1 && (
        <nav
          aria-label="Table of contents"
          className="mb-8 p-5 rounded-2xl bg-white/90 dark:bg-forest-900/50 border border-sand-200 dark:border-forest-800 shadow-2xs"
        >
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-crimson-600 dark:text-powder-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-forest-950 dark:text-cream-50">
              Lesson Highlights & Key Frameworks
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {headings.map((h, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToHeading(h.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
                  h.depth === 2
                    ? 'bg-sand-100 hover:bg-sand-200 dark:bg-forest-800 dark:hover:bg-forest-700 text-forest-950 dark:text-cream-50 border border-sand-200 dark:border-forest-700 shadow-2xs'
                    : 'bg-white hover:bg-sand-50 dark:bg-forest-900 dark:hover:bg-forest-800 text-slate-600 dark:text-cream-300 border border-sand-200/80 dark:border-forest-800'
                }`}
              >
                {h.depth === 2 ? (
                  <Layers className="w-3 h-3 text-crimson-600 dark:text-powder-300 shrink-0" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-slate-400 dark:text-cream-400 shrink-0" />
                )}
                <span>{h.text}</span>
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* Rendered Prose Content */}
      <div className="prose-content">
        {renderBlocks(tokens)}
      </div>
    </div>
  );
};
