/**
 * MathContent Component
 *
 * Renders mixed text and LaTeX content. Parses LaTeX delimiters and renders
 * math expressions using KaTeX while preserving regular text.
 *
 * Supported delimiters:
 * - $...$ for inline math
 * - $$...$$ for block math
 * - \(...\) for inline math
 * - \[...\] for block math
 */

'use client';

import { FC, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathContentProps {
  /** Content with mixed text and LaTeX */
  content: string;
  /** Additional CSS classes */
  className?: string;
}

interface ContentPart {
  type: 'text' | 'inline-math' | 'block-math';
  content: string;
}

function parseContent(content: string): ContentPart[] {
  const parts: ContentPart[] = [];

  // Regex to match LaTeX delimiters
  // Order matters: check $$ before $, and \[ before \(
  const mathRegex = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\))/g;

  let lastIndex = 0;
  let match;

  while ((match = mathRegex.exec(content)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      const textPart = content.slice(lastIndex, match.index);
      if (textPart) {
        parts.push({ type: 'text', content: textPart });
      }
    }

    const mathStr = match[0];
    let mathContent: string;
    let mathType: 'inline-math' | 'block-math';

    if (mathStr.startsWith('$$')) {
      mathContent = mathStr.slice(2, -2).trim();
      mathType = 'block-math';
    } else if (mathStr.startsWith('$')) {
      mathContent = mathStr.slice(1, -1).trim();
      mathType = 'inline-math';
    } else if (mathStr.startsWith('\\[')) {
      mathContent = mathStr.slice(2, -2).trim();
      mathType = 'block-math';
    } else if (mathStr.startsWith('\\(')) {
      mathContent = mathStr.slice(2, -2).trim();
      mathType = 'inline-math';
    } else {
      mathContent = mathStr;
      mathType = 'inline-math';
    }

    if (mathContent) {
      parts.push({ type: mathType, content: mathContent });
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push({ type: 'text', content: content.slice(lastIndex) });
  }

  return parts;
}

const MathContent: FC<MathContentProps> = ({ content, className }) => {
  const parts = useMemo(() => parseContent(content), [content]);

  return (
    <div className={className}>
      {parts.map((part, index) => {
        if (part.type === 'text') {
          // Preserve newlines in text
          return (
            <span key={index} className="whitespace-pre-wrap">
              {part.content}
            </span>
          );
        }

        if (part.type === 'block-math') {
          return (
            <div key={index} className="my-2">
              <BlockMath
                math={part.content}
                errorColor="#dc2626"
                renderError={(error) => (
                  <span className="text-red-600 font-mono text-xs">
                    {error.message}
                  </span>
                )}
              />
            </div>
          );
        }

        // inline-math
        return (
          <InlineMath
            key={index}
            math={part.content}
            errorColor="#dc2626"
            renderError={(error) => (
              <span className="text-red-600 font-mono text-xs">
                {error.message}
              </span>
            )}
          />
        );
      })}
    </div>
  );
};

export default MathContent;
