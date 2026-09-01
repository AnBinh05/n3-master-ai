import { MIMIKARA_UNITS } from '@/prisma/data/mimikara_n3_880';

export interface StandardCard {
  id: string;
  deckId: string;
  frontText: string;
  frontAudio?: string | null;
  backReading: string;
  backMeaning: string;
  backText: string;
  backExamples?: string | null;
  kanjiBreakdown?: string | null;
  easeFactor: number;
  interval: number;
  repetitions: number;
  dueDate: string;
  status: string;
}

export interface StandardDeck {
  id: string;
  title: string;
  description: string;
  category: string;
  isPublic: boolean;
  tags?: string;
  totalCards: number;
  dueCardsCount: number;
  createdAt: string;
  cards?: StandardCard[];
}

export const GRAMMAR_CARDS: StandardCard[] = [
  {
    id: 'grammar-card-1',
    deckId: 'deck-grammar-n3',
    frontText: '〜ことにしている',
    backReading: 'koto ni shite iru',
    backMeaning: 'Quyết định / Thói quen do bản thân tự quy định [Quy định bản thân]',
    backText: '毎朝、30分ジョギングすることにしている。',
    backExamples: JSON.stringify(['寝る前にスマホを見ないことにしている。(Tôi tự quy định không nhìn điện thoại trước khi ngủ.)']),
    kanjiBreakdown: null,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    dueDate: new Date().toISOString(),
    status: 'NEW',
  },
  {
    id: 'grammar-card-2',
    deckId: 'deck-grammar-n3',
    frontText: '〜ことになっている',
    backReading: 'koto ni natte iru',
    backMeaning: 'Quy định, luật lệ do tập thể / cơ quan đưa ra [Quy định chung]',
    backText: 'この部屋ではタバコを吸ってはいけないことになっている。',
    backExamples: JSON.stringify(['法律で禁止されている。(Được quy định cấm bởi luật pháp.)']),
    kanjiBreakdown: null,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    dueDate: new Date().toISOString(),
    status: 'NEW',
  },
  {
    id: 'grammar-card-3',
    deckId: 'deck-grammar-n3',
    frontText: '〜ようにする',
    backReading: 'you ni suru',
    backMeaning: 'Cố gắng làm / không làm gì (nỗ lực hình thành thói quen)',
    backText: '野菜をたくさん食べるようにしています。',
    backExamples: JSON.stringify(['遅刻しないようにしてください。(Hãy cố gắng đừng đến muộn.)']),
    kanjiBreakdown: null,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    dueDate: new Date().toISOString(),
    status: 'NEW',
  },
  {
    id: 'grammar-card-4',
    deckId: 'deck-grammar-n3',
    frontText: '〜わけがない',
    backReading: 'wake ga nai',
    backMeaning: 'Tuyệt đối không thể nào / Chắc chắn không...',
    backText: '彼がそんな嘘をつくわけがない。',
    backExamples: JSON.stringify(['こんな難しい問題、一分で解けるわけがない。(Bài toán khó thế này không thể nào giải trong 1 phút.)']),
    kanjiBreakdown: null,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    dueDate: new Date().toISOString(),
    status: 'NEW',
  },
];

export function getDefaultDecks(): StandardDeck[] {
  const staticDecks: StandardDeck[] = MIMIKARA_UNITS.map((unit) => ({
    id: `mimikara-unit-${unit.unitNumber}`,
    title: `Mimikara N3 - ${unit.title}`,
    description: `${unit.japaneseTitle}: ${unit.description}`,
    category: 'VOCABULARY',
    isPublic: true,
    tags: `Mimikara, N3, Unit ${unit.unitNumber}, Goi, Free`,
    totalCards: unit.words.length,
    dueCardsCount: unit.words.length,
    createdAt: new Date('2026-01-01').toISOString(),
  }));

  staticDecks.push({
    id: 'deck-grammar-n3',
    title: 'JLPT N3 Ngữ Pháp Trọng Tâm (100% Free)',
    description: 'Tổng hợp mẫu câu ngữ pháp N3 có giải thích và ví dụ chi tiết.',
    category: 'GRAMMAR',
    isPublic: true,
    tags: 'N3, Grammar, Bunpou, Free',
    totalCards: GRAMMAR_CARDS.length,
    dueCardsCount: GRAMMAR_CARDS.length,
    createdAt: new Date('2026-01-01').toISOString(),
  });

  return staticDecks;
}

export function getDefaultCardsForDeck(deckId: string): StandardCard[] {
  if (deckId === 'deck-grammar-n3' || deckId.includes('grammar')) {
    return GRAMMAR_CARDS;
  }

  // Extract unit number from deckId (e.g. "mimikara-unit-1", "unit-1", or cuid)
  let unitNum = 1;
  const match = deckId.match(/(\d+)/);
  if (match) {
    unitNum = parseInt(match[1], 10);
  }

  const unit = MIMIKARA_UNITS.find((u) => u.unitNumber === unitNum) || MIMIKARA_UNITS[0];

  return unit.words.map((w, idx) => ({
    id: `card-u${unit.unitNumber}-${idx + 1}`,
    deckId,
    frontText: w.word,
    frontAudio: null,
    backReading: w.reading,
    backMeaning: w.meaning,
    backText: w.example,
    backExamples: JSON.stringify([w.example]),
    kanjiBreakdown: w.kanji ? JSON.stringify(w.kanji) : null,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    dueDate: new Date().toISOString(),
    status: 'NEW',
  }));
}

export function getAllDefaultCards(): StandardCard[] {
  const allCards: StandardCard[] = [];
  MIMIKARA_UNITS.forEach((unit) => {
    unit.words.forEach((w, idx) => {
      allCards.push({
        id: `card-u${unit.unitNumber}-${idx + 1}`,
        deckId: `mimikara-unit-${unit.unitNumber}`,
        frontText: w.word,
        frontAudio: null,
        backReading: w.reading,
        backMeaning: w.meaning,
        backText: w.example,
        backExamples: JSON.stringify([w.example]),
        kanjiBreakdown: w.kanji ? JSON.stringify(w.kanji) : null,
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        dueDate: new Date().toISOString(),
        status: 'NEW',
      });
    });
  });
  return allCards;
}
