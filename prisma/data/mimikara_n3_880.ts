// TRỌN BỘ CHÍNH XÁC 100% 880 TỪ VỰNG GIÁO TRÌNH MIMIKARA OBOERU N3 (耳から覚える N3 語彙)
// Dữ liệu chuẩn gốc từ sách giáo khoa N3 với đầy đủ Hán Việt, Nghĩa Tiếng Việt, Tiếng Anh, Furigana & Ví dụ

import { MimikaraWord, MimikaraUnit } from './types';
import { UNIT_1_WORDS } from './unit1';
import { UNIT_2_WORDS } from './unit2';
import { UNIT_3_WORDS } from './unit3';
import { UNIT_4_WORDS } from './unit4';
import { UNIT_5_WORDS } from './unit5';
import { UNIT_6_WORDS } from './unit6';
import { UNIT_7_WORDS } from './unit7';
import { UNIT_8_WORDS } from './unit8';
import { UNIT_9_WORDS } from './unit9';
import { UNIT_10_WORDS } from './unit10';
import { UNIT_11_WORDS } from './unit11';
import { UNIT_12_WORDS } from './unit12';

export * from './types';

export const ALL_880_WORDS: MimikaraWord[] = [
  ...UNIT_1_WORDS,   // 1 - 70 (70 từ)
  ...UNIT_2_WORDS,   // 71 - 120 (50 từ)
  ...UNIT_3_WORDS,   // 121 - 220 (100 từ)
  ...UNIT_4_WORDS,   // 221 - 258 (38 từ)
  ...UNIT_5_WORDS,   // 259 - 298 (40 từ)
  ...UNIT_6_WORDS,   // 299 - 410 (112 từ)
  ...UNIT_7_WORDS,   // 411 - 510 (100 từ)
  ...UNIT_8_WORDS,   // 511 - 590 (80 từ)
  ...UNIT_9_WORDS,   // 591 - 715 (125 từ)
  ...UNIT_10_WORDS,  // 716 - 795 (80 từ)
  ...UNIT_11_WORDS,  // 796 - 845 (50 từ)
  ...UNIT_12_WORDS,  // 846 - 880 (35 từ)
];

export const MIMIKARA_UNITS: MimikaraUnit[] = [
  {
    unitNumber: 1,
    title: 'Unit 1: Danh từ 1 (Từ 1 - 70)',
    japaneseTitle: '第1課：名詞 1',
    category: 'VOCABULARY',
    startNum: 1,
    endNum: 70,
    description: 'Danh từ chủ đề gia đình, con người, công việc và đời sống (Từ số 1 - 70)',
    words: UNIT_1_WORDS,
  },
  {
    unitNumber: 2,
    title: 'Unit 2: Danh từ 2 (Từ 71 - 120)',
    japaneseTitle: '第2課：名詞 2',
    category: 'VOCABULARY',
    startNum: 71,
    endNum: 120,
    description: 'Danh từ chủ đề thiên nhiên, xã hội, sản phẩm và môi trường (Từ số 71 - 120)',
    words: UNIT_2_WORDS,
  },
  {
    unitNumber: 3,
    title: 'Unit 3: Động từ 1 (Từ 121 - 220)',
    japaneseTitle: '第3課：動詞 1',
    category: 'VOCABULARY',
    startNum: 121,
    endNum: 220,
    description: 'Động từ cơ bản, tự động từ & tha động từ nhóm 1 (Từ số 121 - 220)',
    words: UNIT_3_WORDS,
  },
  {
    unitNumber: 4,
    title: 'Unit 4: Danh từ phái sinh từ Động từ (Từ 221 - 258)',
    japaneseTitle: '第4課：動詞からできた名詞',
    category: 'VOCABULARY',
    startNum: 221,
    endNum: 258,
    description: 'Các danh từ bắt nguồn từ thể liên từ của động từ (Từ số 221 - 258)',
    words: UNIT_4_WORDS,
  },
  {
    unitNumber: 5,
    title: 'Unit 5: Tính từ đuôi -i & đuôi -na 1 (Từ 259 - 298)',
    japaneseTitle: '第5課：イ形容詞・ナ形容詞 1',
    category: 'VOCABULARY',
    startNum: 259,
    endNum: 298,
    description: 'Tính từ miêu tả tính cách, cảm xúc và đánh giá con người (Từ số 259 - 298)',
    words: UNIT_5_WORDS,
  },
  {
    unitNumber: 6,
    title: 'Unit 6: Động từ 2 & Danh từ 3 (Từ 299 - 410)',
    japaneseTitle: '第6課：動詞 2・名詞 3',
    category: 'VOCABULARY',
    startNum: 299,
    endNum: 410,
    description: 'Động từ biến đổi và danh từ xã hội, kỹ thuật, thông tin (Từ số 299 - 410)',
    words: UNIT_6_WORDS,
  },
  {
    unitNumber: 7,
    title: 'Unit 7: Động từ 3 (Từ 411 - 510)',
    japaneseTitle: '第7課：動詞 3',
    category: 'VOCABULARY',
    startNum: 411,
    endNum: 510,
    description: 'Động từ tương tác, phán đoán, di chuyển và cảm giác (Từ số 411 - 510)',
    words: UNIT_7_WORDS,
  },
  {
    unitNumber: 8,
    title: 'Unit 8: Từ Katakana 1 & Tính từ 2 (Từ 511 - 590)',
    japaneseTitle: '第8課：カタカナ語 1・形容詞 2',
    category: 'VOCABULARY',
    startNum: 511,
    endNum: 590,
    description: 'Từ mượn ngoại lai Katakana thông dụng và tính từ miêu tả trạng thái (Từ số 511 - 590)',
    words: UNIT_8_WORDS,
  },
  {
    unitNumber: 9,
    title: 'Unit 9: Phó từ 1 & Danh từ 4 (Từ 591 - 715)',
    japaneseTitle: '第9課：副詞 1・名詞 4',
    category: 'VOCABULARY',
    startNum: 591,
    endNum: 715,
    description: 'Phó từ chỉ tần suất, mức độ và danh từ kinh tế, y tế, pháp lý (Từ số 591 - 715)',
    words: UNIT_9_WORDS,
  },
  {
    unitNumber: 10,
    title: 'Unit 10: Động từ 4 (Từ 716 - 795)',
    japaneseTitle: '第10課：動詞 4',
    category: 'VOCABULARY',
    startNum: 716,
    endNum: 795,
    description: 'Động từ chỉ sự chuyển dịch, tiếp nối, liên kết và trừu tượng (Từ số 716 - 795)',
    words: UNIT_10_WORDS,
  },
  {
    unitNumber: 11,
    title: 'Unit 11: Từ Katakana 2 & Động từ Nấu ăn (Từ 796 - 845)',
    japaneseTitle: '第11課：カタカナ語 2・料理動詞',
    category: 'VOCABULARY',
    startNum: 796,
    endNum: 845,
    description: 'Từ mượn Katakana nâng cao và bộ động từ chuyên về ẩm thực nấu nướng (Từ số 796 - 845)',
    words: UNIT_11_WORDS,
  },
  {
    unitNumber: 12,
    title: 'Unit 12: Phó từ 2, Liên từ & Quán từ (Từ 846 - 880)',
    japaneseTitle: '第12課：副詞 2・接続詞・連語',
    category: 'VOCABULARY',
    startNum: 846,
    endNum: 880,
    description: 'Phó từ tình thái, liên từ nối câu và từ liên kết câu chuẩn đề thi N3 (Từ số 846 - 880)',
    words: UNIT_12_WORDS,
  },
];

export function getMimikaraUnits(): MimikaraUnit[] {
  return MIMIKARA_UNITS;
}
