export interface ParsedDescription {
  shortDescription: string;
  responsibilities: string[];
  requirements: string[];
}

export function parseDescription(markdown: string): ParsedDescription {
  const lines = markdown.split('\n');
  const shortLines: string[] = [];
  const sections: Record<string, string[]> = {};
  let currentSection: string | null = null;

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+)/);
    if (headingMatch) {
      currentSection = headingMatch[1].trim();
      continue;
    }

    if (currentSection === null) {
      /* Before any ## heading — part of the short description */
      const trimmed = line.trim();
      if (trimmed) shortLines.push(trimmed);
    } else {
      /* Inside a section — collect bullet items */
      const bulletMatch = line.match(/^-\s+(.*)/);
      if (bulletMatch) {
        if (!sections[currentSection]) sections[currentSection] = [];
        sections[currentSection].push(bulletMatch[1].trim());
      }
    }
  }

  return {
    shortDescription: shortLines.join(' '),
    responsibilities: sections['Responsibilities'] || [],
    requirements: sections['Requirements'] || [],
  };
}
