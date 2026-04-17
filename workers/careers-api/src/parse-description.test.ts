import { describe, it, expect } from 'vitest';
import { parseDescription } from './parse-description';

describe('parseDescription', () => {
  it('parses a full job ad with all sections', () => {
    const md = [
      'We are looking for a Software Engineer to join our team.',
      '',
      '## The Opportunity',
      'This is a hybrid role based in Melbourne.',
      '',
      '## What You\'ll Be Doing',
      'You\'ll contribute to the design and delivery of software solutions.',
      '',
      '## What We\'re Looking For',
      '- Server-side development using .NET and C#',
      '- Database development skills',
      '- API development and integration',
      '',
      '## Bonus Points',
      '- Python development',
      '- Working with LLMs',
      '',
      '## Security Clearance',
      'Australian citizenship is required.',
    ].join('\n');

    const result = parseDescription(md);

    expect(result.shortDescription).toBe(
      'We are looking for a Software Engineer to join our team.'
    );
    expect(result.opportunity).toBe('This is a hybrid role based in Melbourne.');
    expect(result.whatYoullBeDoing).toBe(
      "You'll contribute to the design and delivery of software solutions."
    );
    expect(result.whatWereLookingFor).toEqual([
      'Server-side development using .NET and C#',
      'Database development skills',
      'API development and integration',
    ]);
    expect(result.bonusPoints).toEqual([
      'Python development',
      'Working with LLMs',
    ]);
    expect(result.securityClearance).toBe('Australian citizenship is required.');
  });

  it('handles missing optional sections', () => {
    const md = [
      'Short description here.',
      '',
      '## What We\'re Looking For',
      '- Must have clearance',
    ].join('\n');

    const result = parseDescription(md);

    expect(result.shortDescription).toBe('Short description here.');
    expect(result.opportunity).toBe('');
    expect(result.whatYoullBeDoing).toBe('');
    expect(result.whatWereLookingFor).toEqual(['Must have clearance']);
    expect(result.bonusPoints).toEqual([]);
    expect(result.securityClearance).toBe('');
  });

  it('handles empty description', () => {
    const result = parseDescription('');

    expect(result.shortDescription).toBe('');
    expect(result.whatWereLookingFor).toEqual([]);
    expect(result.bonusPoints).toEqual([]);
  });

  it('handles description with only short description, no sections', () => {
    const result = parseDescription('Just a simple role description.');

    expect(result.shortDescription).toBe('Just a simple role description.');
    expect(result.opportunity).toBe('');
    expect(result.whatWereLookingFor).toEqual([]);
  });

  it('handles multi-line short description', () => {
    const md = [
      'First line of description.',
      'Second line of description.',
      '',
      '## The Opportunity',
      'A great role.',
    ].join('\n');

    const result = parseDescription(md);

    expect(result.shortDescription).toBe(
      'First line of description. Second line of description.'
    );
    expect(result.opportunity).toBe('A great role.');
  });

  it('ignores unknown sections', () => {
    const md = [
      'Short desc.',
      '',
      '## What We\'re Looking For',
      '- 5 years exp',
      '',
      '## Nice to Have',
      '- Kubernetes experience',
    ].join('\n');

    const result = parseDescription(md);

    expect(result.whatWereLookingFor).toEqual(['5 years exp']);
  });

  it('parses ClickUp plain-text format (no ## or - prefixes)', () => {
    const plain = [
      'We need a data engineer.',
      '',
      'The Opportunity',
      '',
      'This is a great role in Melbourne.',
      '',
      'What We\'re Looking For',
      '',
      '5+ years experience',
      'Australian citizenship',
    ].join('\n');

    const result = parseDescription(plain);

    expect(result.shortDescription).toBe('We need a data engineer.');
    expect(result.opportunity).toBe('This is a great role in Melbourne.');
    expect(result.whatWereLookingFor).toEqual([
      '5+ years experience',
      'Australian citizenship',
    ]);
  });

  it('handles legacy section names (Responsibilities/Requirements)', () => {
    const md = [
      'Old format job.',
      '',
      '## Responsibilities',
      '- Build things',
      '',
      '## Requirements',
      '- 5 years exp',
    ].join('\n');

    const result = parseDescription(md);

    expect(result.whatYoullBeDoing).toBe('Build things');
    expect(result.whatWereLookingFor).toEqual(['5 years exp']);
  });

  it('joins multi-line paragraphs in paragraph sections', () => {
    const md = [
      'Short.',
      '',
      '## The Opportunity',
      'First paragraph line.',
      'Second paragraph line.',
      '',
      'Third line after blank.',
    ].join('\n');

    const result = parseDescription(md);

    expect(result.opportunity).toBe(
      'First paragraph line. Second paragraph line. Third line after blank.'
    );
  });

  it('trims whitespace from bullet items', () => {
    const md = [
      'Desc.',
      '',
      '## What We\'re Looking For',
      '-   Padded item  ',
      '- Normal item',
    ].join('\n');

    const result = parseDescription(md);

    expect(result.whatWereLookingFor).toEqual([
      'Padded item',
      'Normal item',
    ]);
  });
});
