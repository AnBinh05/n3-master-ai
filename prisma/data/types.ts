export interface KanjiInfo {
  kanji: string;
  meaning: string;
  on?: string;
  kun?: string;
}

export interface MimikaraWord {
  num: number;
  word: string;
  reading: string;
  meaning: string;
  example: string;
  hanViet?: string;
  kanji?: KanjiInfo[];
}

export interface MimikaraUnit {
  unitNumber: number;
  title: string;
  japaneseTitle: string;
  category: 'VOCABULARY' | 'KANJI' | 'GRAMMAR' | 'LISTENING' | 'READING';
  startNum: number;
  endNum: number;
  description: string;
  words: MimikaraWord[];
}
