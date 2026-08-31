export interface CSVCardRow {
  frontText: string;
  backMeaning: string;
  backReading?: string;
  backText?: string;
  tags?: string;
}

/**
 * Parses raw CSV string into structured Card creation rows
 */
export function parseCSVCards(csvContent: string): CSVCardRow[] {
  const lines = csvContent.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const results: CSVCardRow[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Skip header if line starts with front/frontText
    if (i === 0 && line.toLowerCase().includes('front')) continue;

    const parts = line.split(',').map((p) => p.trim().replace(/^"(.*)"$/, '$1'));
    if (parts.length >= 2) {
      results.push({
        frontText: parts[0],
        backMeaning: parts[1],
        backReading: parts[2] || '',
        backText: parts[3] || '',
        tags: parts[4] || 'CSV-Import',
      });
    }
  }

  return results;
}

/**
 * Exports cards array to CSV string downloadable format
 */
export function exportCardsToCSV(cards: any[]): string {
  const header = 'Front,Meaning,Reading,Example,Tags\n';
  const rows = cards.map((c) => {
    const front = `"${(c.frontText || '').replace(/"/g, '""')}"`;
    const meaning = `"${(c.backMeaning || '').replace(/"/g, '""')}"`;
    const reading = `"${(c.backReading || '').replace(/"/g, '""')}"`;
    const example = `"${(c.backText || '').replace(/"/g, '""')}"`;
    const tags = `"${(c.tags || 'N3').replace(/"/g, '""')}"`;
    return `${front},${meaning},${reading},${example},${tags}`;
  });

  return header + rows.join('\n');
}
