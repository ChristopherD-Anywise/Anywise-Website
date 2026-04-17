import { describe, it, expect } from 'vitest';
import { parseDescription } from './parse-description';

describe('parseDescription', () => {
  it('parses a full description with all sections', () => {
    const md = [
      'Design and build sovereign data pipelines for defence and government platforms.',
      '',
      '## Responsibilities',
      '- Design and implement scalable data pipelines',
      '- Build ETL/ELT workflows for defence data sources',
      '',
      '## Requirements',
      '- 5+ years of data engineering experience',
      '- Australian citizenship',
    ].join('\n');

    const result = parseDescription(md);

    expect(result.shortDescription).toBe(
      'Design and build sovereign data pipelines for defence and government platforms.'
    );
    expect(result.responsibilities).toEqual([
      'Design and implement scalable data pipelines',
      'Build ETL/ELT workflows for defence data sources',
    ]);
    expect(result.requirements).toEqual([
      '5+ years of data engineering experience',
      'Australian citizenship',
    ]);
  });

  it('handles missing Responsibilities section', () => {
    const md = [
      'Short description here.',
      '',
      '## Requirements',
      '- Must have clearance',
    ].join('\n');

    const result = parseDescription(md);

    expect(result.shortDescription).toBe('Short description here.');
    expect(result.responsibilities).toEqual([]);
    expect(result.requirements).toEqual(['Must have clearance']);
  });

  it('handles missing Requirements section', () => {
    const md = [
      'Short description here.',
      '',
      '## Responsibilities',
      '- Build things',
    ].join('\n');

    const result = parseDescription(md);

    expect(result.shortDescription).toBe('Short description here.');
    expect(result.responsibilities).toEqual(['Build things']);
    expect(result.requirements).toEqual([]);
  });

  it('handles empty description', () => {
    const result = parseDescription('');

    expect(result.shortDescription).toBe('');
    expect(result.responsibilities).toEqual([]);
    expect(result.requirements).toEqual([]);
  });

  it('handles description with only short description, no sections', () => {
    const result = parseDescription('Just a simple role description.');

    expect(result.shortDescription).toBe('Just a simple role description.');
    expect(result.responsibilities).toEqual([]);
    expect(result.requirements).toEqual([]);
  });

  it('handles multi-line short description (takes first paragraph)', () => {
    const md = [
      'First line of description.',
      'Second line of description.',
      '',
      '## Responsibilities',
      '- Do stuff',
    ].join('\n');

    const result = parseDescription(md);

    expect(result.shortDescription).toBe(
      'First line of description. Second line of description.'
    );
    expect(result.responsibilities).toEqual(['Do stuff']);
  });

  it('ignores extra sections beyond Responsibilities and Requirements', () => {
    const md = [
      'Short desc.',
      '',
      '## Responsibilities',
      '- Build pipelines',
      '',
      '## Requirements',
      '- 5 years exp',
      '',
      '## Nice to Have',
      '- Kubernetes experience',
    ].join('\n');

    const result = parseDescription(md);

    expect(result.responsibilities).toEqual(['Build pipelines']);
    expect(result.requirements).toEqual(['5 years exp']);
  });

  it('trims whitespace from bullet items', () => {
    const md = [
      'Desc.',
      '',
      '## Responsibilities',
      '-   Padded item  ',
      '- Normal item',
    ].join('\n');

    const result = parseDescription(md);

    expect(result.responsibilities).toEqual([
      'Padded item',
      'Normal item',
    ]);
  });
});
