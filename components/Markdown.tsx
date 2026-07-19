import React from 'react';

interface MarkdownProps {
  content: string;
}

export default function Markdown({ content }: MarkdownProps) {
  if (!content) return null;

  // Split content into lines for block parsing
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];
  let currentBlockType: 'p' | 'ul' | 'ol' | 'code' | 'blockquote' | null = null;
  let currentBlockLines: string[] = [];
  let blockKey = 0;

  const flushBlock = () => {
    if (currentBlockLines.length === 0) return;

    const blockText = currentBlockLines.join('\n').trim();
    if (!blockText) {
      currentBlockLines = [];
      currentBlockType = null;
      return;
    }

    const key = blockKey++;

    if (currentBlockType === 'code') {
      // Find code language if any
      const langMatch = currentBlockLines[0].match(/^```(\w*)/);
      const code = currentBlockLines.slice(1).join('\n');
      blocks.push(
        <pre key={key} className="md-code-block">
          <code>{code}</code>
        </pre>
      );
    } else if (currentBlockType === 'ul') {
      blocks.push(
        <ul key={key} className="md-ul">
          {currentBlockLines.map((line, idx) => {
            const itemText = line.replace(/^[-*+]\s+/, '');
            return <li key={idx}>{parseInline(itemText)}</li>;
          })}
        </ul>
      );
    } else if (currentBlockType === 'ol') {
      blocks.push(
        <ol key={key} className="md-ol">
          {currentBlockLines.map((line, idx) => {
            const itemText = line.replace(/^\d+\.\s+/, '');
            return <li key={idx}>{parseInline(itemText)}</li>;
          })}
        </ol>
      );
    } else if (currentBlockType === 'blockquote') {
      blocks.push(
        <blockquote key={key} style={{ borderLeft: '3px solid var(--teal)', paddingLeft: '1rem', margin: '1rem 0', color: 'var(--card-text-muted)', fontStyle: 'italic' }}>
          {parseInline(currentBlockLines.map(line => line.replace(/^>\s?/, '')).join('\n'))}
        </blockquote>
      );
    } else {
      // Paragraph
      blocks.push(
        <p key={key} className="md-p">
          {parseInline(blockText)}
        </p>
      );
    }

    currentBlockLines = [];
    currentBlockType = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Code Block handling
    if (currentBlockType === 'code') {
      if (trimmed.startsWith('```')) {
        flushBlock();
      } else {
        currentBlockLines.push(line);
      }
      continue;
    }

    if (trimmed.startsWith('```')) {
      flushBlock();
      currentBlockType = 'code';
      currentBlockLines.push(line);
      continue;
    }

    // 2. Horizontal Rules
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      flushBlock();
      blocks.push(<hr key={blockKey++} style={{ border: 'none', borderTop: '1px solid var(--card-border)', margin: '1.5rem 0' }} />);
      continue;
    }

    // 3. Headings (H1 to H6)
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushBlock();
      const level = headingMatch[1].length;
      const headingText = headingMatch[2];
      const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      const className = `md-h${level}`;
      blocks.push(
        <Tag key={blockKey++} className={className}>
          {parseInline(headingText)}
        </Tag>
      );
      continue;
    }

    // 4. Blockquotes
    if (trimmed.startsWith('>')) {
      if (currentBlockType !== 'blockquote') {
        flushBlock();
        currentBlockType = 'blockquote';
      }
      currentBlockLines.push(line);
      continue;
    }

    // 5. Unordered Lists
    if (/^[-*+]\s+/.test(trimmed)) {
      if (currentBlockType !== 'ul') {
        flushBlock();
        currentBlockType = 'ul';
      }
      currentBlockLines.push(trimmed);
      continue;
    }

    // 6. Ordered Lists
    if (/^\d+\.\s+/.test(trimmed)) {
      if (currentBlockType !== 'ol') {
        flushBlock();
        currentBlockType = 'ol';
      }
      currentBlockLines.push(trimmed);
      continue;
    }

    // 7. Empty line ends a block
    if (trimmed === '') {
      flushBlock();
      continue;
    }

    // 8. Default: paragraph text accumulation
    if (currentBlockType && currentBlockType !== 'p') {
      flushBlock();
    }
    currentBlockType = 'p';
    currentBlockLines.push(line);
  }

  // Flush any remaining block
  flushBlock();

  return <>{blocks}</>;
}

function parseInline(text: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  let currentText = text;
  let key = 0;

  while (currentText.length > 0) {
    // Escape HTML tags to prevent XSS if anyone writes raw HTML
    const htmlTagMatch = currentText.match(/^<[^>]+>/);
    if (htmlTagMatch) {
      tokens.push(htmlTagMatch[0]);
      currentText = currentText.slice(htmlTagMatch[0].length);
      continue;
    }

    // Bold: **text** or __text__
    const boldMatch = currentText.match(/^(\*\*|__)(.*?)\1/);
    if (boldMatch) {
      tokens.push(<strong key={key++}>{boldMatch[2]}</strong>);
      currentText = currentText.slice(boldMatch[0].length);
      continue;
    }

    // Italics: *text* or _text_ (excluding links like http:// or https://)
    const italicMatch = currentText.match(/^(\*|_)(.*?)\1/);
    if (italicMatch) {
      tokens.push(<em key={key++}>{italicMatch[2]}</em>);
      currentText = currentText.slice(italicMatch[0].length);
      continue;
    }

    // Inline code: `text`
    const codeMatch = currentText.match(/^`(.*?)`/);
    if (codeMatch) {
      tokens.push(<code key={key++} className="md-inline-code">{codeMatch[1]}</code>);
      currentText = currentText.slice(codeMatch[0].length);
      continue;
    }

    // Image: ![alt](url)
    const imgMatch = currentText.match(/^!\[(.*?)\]\((.*?)\)/);
    if (imgMatch) {
      tokens.push(<img key={key++} src={imgMatch[2]} alt={imgMatch[1]} className="md-img" />);
      currentText = currentText.slice(imgMatch[0].length);
      continue;
    }

    // Link: [text](url)
    const linkMatch = currentText.match(/^\[(.*?)\]\((.*?)\)/);
    if (linkMatch) {
      tokens.push(
        <a key={key++} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="md-link">
          {linkMatch[1]}
        </a>
      );
      currentText = currentText.slice(linkMatch[0].length);
      continue;
    }

    // Plain URL: http://... or https://...
    const urlMatch = currentText.match(/^(https?:\/\/[^\s()<>]+)/);
    if (urlMatch) {
      tokens.push(
        <a key={key++} href={urlMatch[1]} target="_blank" rel="noopener noreferrer" className="md-link">
          {urlMatch[1]}
        </a>
      );
      currentText = currentText.slice(urlMatch[0].length);
      continue;
    }

    // Text up to the next markdown character
    const textMatch = currentText.match(/^[^_*`![<\n]+/);
    if (textMatch) {
      tokens.push(textMatch[0]);
      currentText = currentText.slice(textMatch[0].length);
    } else {
      // Fallback: take 1 char
      tokens.push(currentText[0]);
      currentText = currentText.slice(1);
    }
  }

  return tokens;
}
