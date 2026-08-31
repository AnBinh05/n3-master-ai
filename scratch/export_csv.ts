import { ALL_880_WORDS } from '../prisma/data/mimikara_n3_880';
import * as fs from 'fs';
import * as path from 'path';

const header = 'No,Front,Meaning,Reading,Example,Tags\n';
const rows = ALL_880_WORDS.map((w) => {
  const front = `"${(w.word || '').replace(/"/g, '""')}"`;
  const meaning = `"${(w.meaning || '').replace(/"/g, '""')}"`;
  const reading = `"${(w.reading || '').replace(/"/g, '""')}"`;
  const example = `"${(w.example || '').replace(/"/g, '""')}"`;
  return `${w.num},${front},${meaning},${reading},${example},"Mimikara-N3"`;
});

const outputPath = path.join(__dirname, '../public/mimikara_n3_880.csv');
fs.writeFileSync(outputPath, '\ufeff' + header + rows.join('\n'), 'utf8');
console.log(`✅ Successfully exported all ${ALL_880_WORDS.length} authentic words to ${outputPath}!`);
