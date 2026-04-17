export interface ParsedDescription {
  shortDescription: string;
  opportunity: string;
  whatYoullBeDoing: string;
  whatWereLookingFor: string[];
  bonusPoints: string[];
  securityClearance: string;
}

/** Canonical section names used as keys in the output. */
const SECTION_KEYS: Record<string, keyof Omit<ParsedDescription, 'shortDescription'>> = {
  'the opportunity': 'opportunity',
  'what you\'ll be doing': 'whatYoullBeDoing',
  'what we\'re looking for': 'whatWereLookingFor',
  'what were looking for': 'whatWereLookingFor',
  'bonus points': 'bonusPoints',
  'security clearance': 'securityClearance',
  /* Legacy names for backwards compat */
  'responsibilities': 'whatYoullBeDoing',
  'requirements': 'whatWereLookingFor',
};

function matchSectionHeading(line: string): string | null {
  const trimmed = line.trim();

  /* ## Heading */
  const md = trimmed.match(/^##\s+(.+)/);
  if (md) return md[1].trim().toLowerCase();

  /* **Heading** */
  const bold = trimmed.match(/^\*\*(.+?)\*\*$/);
  if (bold) return bold[1].trim().toLowerCase();

  /* Bare heading — only match known section names */
  const lower = trimmed.toLowerCase();
  if (SECTION_KEYS[lower]) return lower;

  return null;
}

export function parseDescription(markdown: string): ParsedDescription {
  const lines = markdown.split('\n');
  const shortLines: string[] = [];
  const sections: Record<string, string[]> = {};
  let currentKey: string | null = null;

  for (const line of lines) {
    const heading = matchSectionHeading(line);

    if (heading !== null) {
      const key = SECTION_KEYS[heading];
      if (key) {
        currentKey = key;
        if (!sections[currentKey]) sections[currentKey] = [];
      } else {
        /* Unknown section — still track it so content doesn't leak into previous section */
        currentKey = '__ignored';
      }
      continue;
    }

    const trimmed = line.trim();

    if (currentKey === null) {
      if (trimmed) shortLines.push(trimmed);
    } else if (currentKey !== '__ignored') {
      const bulletMatch = trimmed.match(/^[-•*]\s+(.*)/);
      const content = bulletMatch ? bulletMatch[1].trim() : trimmed;
      if (content) {
        if (!sections[currentKey]) sections[currentKey] = [];
        sections[currentKey].push(content);
      }
    }
  }

  return {
    shortDescription: shortLines.join(' '),
    opportunity: (sections['opportunity'] || []).join(' '),
    whatYoullBeDoing: (sections['whatYoullBeDoing'] || []).join(' '),
    whatWereLookingFor: sections['whatWereLookingFor'] || [],
    bonusPoints: sections['bonusPoints'] || [],
    securityClearance: (sections['securityClearance'] || []).join(' '),
  };
}
