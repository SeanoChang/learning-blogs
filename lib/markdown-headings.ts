export interface MarkdownHeading {
  id: string;
  text: string;
  level: number;
  line: number;
}

interface ExtractOptions {
  maxDepth?: number;
}

const MAX_DEPTH_DEFAULT = 3;

const sanitizeHeadingText = (text: string) =>
  text
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // strip markdown links
    .replace(/[*_`]/g, "")
    .trim();

const toSlugBase = (text: string) =>
  text
    .toLowerCase()
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const nextHeadingId = (
  text: string,
  idCounts: Map<string, number>,
  fallbackIndex: number
) => {
  let baseId = toSlugBase(text);

  if (!baseId) {
    baseId = `heading-${fallbackIndex}`;
  }

  const count = idCounts.get(baseId) || 0;
  const id = count === 0 ? baseId : `${baseId}-${count}`;
  idCounts.set(baseId, count + 1);

  return id;
};

export const createHeadingSlugger = () => {
  const idCounts = new Map<string, number>();
  let fallbackIndex = 0;

  return (text: string) => nextHeadingId(text, idCounts, fallbackIndex++);
};

/**
 * Extract heading metadata (level, text, unique id) from markdown content.
 * Respects fenced code blocks so we don't create phantom headings.
 */
export function extractMarkdownHeadings(
  content: string,
  options: ExtractOptions = {}
): MarkdownHeading[] {
  const maxDepth = options.maxDepth ?? MAX_DEPTH_DEFAULT;
  const lines = content.split(/\r?\n/);
  const headings: MarkdownHeading[] = [];
  const idCounts = new Map<string, number>();

  let inFence = false;
  let fenceChar: "`" | "~" | null = null;
  let fenceLength = 0;

  lines.forEach((rawLine, index) => {
    const trimmedLine = rawLine.trimStart();
    const fenceMatch = trimmedLine.match(/^(`{3,}|~{3,})/);

    if (fenceMatch) {
      const segment = fenceMatch[1];
      const char = segment[0] as "`" | "~";
      const length = segment.length;

      if (!inFence) {
        inFence = true;
        fenceChar = char;
        fenceLength = length;
      } else if (char === fenceChar && length >= fenceLength) {
        inFence = false;
        fenceChar = null;
        fenceLength = 0;
      }
      return;
    }

    if (inFence) {
      return;
    }

    const headingMatch = rawLine.match(/^\s{0,3}(#{1,6})\s+(.+)$/);
    if (!headingMatch) {
      return;
    }

    const level = headingMatch[1].length;
    if (level > maxDepth) {
      return;
    }

    const rawText = headingMatch[2].trim();
    const text = sanitizeHeadingText(rawText);
    const id = nextHeadingId(rawText, idCounts, headings.length);

    headings.push({
      id,
      text,
      level,
      line: index + 1,
    });
  });

  return headings;
}
