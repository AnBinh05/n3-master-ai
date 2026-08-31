const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Parse CSV lines
function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
  const result = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const row = [];
    let insideQuotes = false;
    let field = '';
    
    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"') {
        if (insideQuotes && line[c+1] === '"') {
          field += '"';
          c++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        row.push(field.trim());
        field = '';
      } else {
        field += char;
      }
    }
    row.push(field.trim());
    if (row.length >= 7) {
      result.push({
        num: parseInt(row[0], 10),
        word: row[1],
        reading: row[2],
        hanViet: row[3],
        meaning: row[4],
        enMeaning: row[5],
        example: row[6],
      });
    }
  }
  return result;
}

const unitRanges = [
  { unit: 1, start: 1, end: 70, title: 'Unit 1: Danh từ 1 (1 - 70)', jp: '第1課：名詞 1', desc: 'Danh từ chủ đề gia đình, con người, công việc và đời sống' },
  { unit: 2, start: 71, end: 120, title: 'Unit 2: Danh từ 2 (71 - 120)', jp: '第2課：名詞 2', desc: 'Danh từ chủ đề thiên nhiên, xã hội, sản phẩm và môi trường' },
  { unit: 3, start: 121, end: 220, title: 'Unit 3: Động từ 1 (121 - 220)', jp: '第3課：動詞 1', desc: 'Động từ cơ bản, tự động từ & tha động từ nhóm 1' },
  { unit: 4, start: 221, end: 258, title: 'Unit 4: Danh từ phái sinh từ Động từ (221 - 258)', jp: '第4課：動詞からできた名詞', desc: 'Các danh từ bắt nguồn từ thể liên từ của động từ' },
  { unit: 5, start: 259, end: 298, title: 'Unit 5: Tính từ đuôi -i và -na 1 (259 - 298)', jp: '第5課：イ形容詞・ナ形容詞 1', desc: 'Tính từ miêu tả tính cách, cảm xúc và đánh giá con người' },
  { unit: 6, start: 299, end: 410, title: 'Unit 6: Động từ 2 & Danh từ 3 (299 - 410)', jp: '第6課：動詞 2・名詞 3', desc: 'Động từ biến đổi và danh từ xã hội, kỹ thuật, thông tin' },
  { unit: 7, start: 411, end: 510, title: 'Unit 7: Động từ 3 (411 - 510)', jp: '第7課：動詞 3', desc: 'Động từ tương tác, phán đoán, di chuyển và cảm giác' },
  { unit: 8, start: 511, end: 590, title: 'Unit 8: Từ Katakana 1 & Tính từ 2 (511 - 590)', jp: '第8課：カタカナ語 1・形容詞 2', desc: 'Từ mượn ngoại lai Katakana thông dụng và tính từ miêu tả trạng thái' },
  { unit: 9, start: 591, end: 715, title: 'Unit 9: Phó từ 1 & Danh từ 4 (591 - 715)', jp: '第9課：副詞 1・名詞 4', desc: 'Phó từ chỉ tần suất, mức độ và danh từ kinh tế, y tế, pháp lý' },
  { unit: 10, start: 716, end: 795, title: 'Unit 10: Động từ 4 (716 - 795)', jp: '第10課：動詞 4', desc: 'Động từ chỉ sự chuyển dịch, tiếp nối, liên kết và trừu tượng' },
  { unit: 11, start: 796, end: 845, title: 'Unit 11: Từ Katakana 2 & Động từ Nấu ăn (796 - 845)', jp: '第11課：カタカナ語 2・料理動詞', desc: 'Từ mượn Katakana nâng cao và bộ động từ chuyên về ẩm thực nấu nướng' },
  { unit: 12, start: 846, end: 880, title: 'Unit 12: Phó từ 2, Liên từ & Quán từ (846 - 880)', jp: '第12課：副詞 2・接続詞・連語', desc: 'Phó từ tình thái, liên từ nối câu và từ liên kết câu chuẩn đề thi N3' },
];

async function main() {
  console.log('🌱 Starting N3 Master AI Seed: 12 Units Mimikara N3 (880 Authentic Words)...');

  // 1. Create Demo User
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@n3master.ai' },
    update: { plan: 'FREE' },
    create: {
      name: 'JLPT N3 Learner',
      email: 'demo@n3master.ai',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'USER',
      plan: 'FREE',
      aiUsageToday: 0,
    },
  });

  console.log(`👤 User: ${demoUser.email} (100% Free - Unlimited AI & Reviews)`);

  // Clear previous decks
  const existingDecks = await prisma.deck.findMany({
    where: { userId: demoUser.id },
  });
  if (existingDecks.length > 0) {
    console.log(`🧹 Clearing ${existingDecks.length} old decks...`);
    await prisma.card.deleteMany({
      where: { deckId: { in: existingDecks.map(d => d.id) } },
    });
    await prisma.deck.deleteMany({
      where: { userId: demoUser.id },
    });
  }

  // Load raw CSV
  const csvPath = path.join(__dirname, 'data/mimikara_n3_880_raw.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const allWords = parseCSV(csvContent);
  console.log(`📖 Loaded all ${allWords.length} authentic words from Mimikara N3!`);

  // Insert 12 Units
  for (const u of unitRanges) {
    const words = allWords.filter(w => w.num >= u.start && w.num <= u.end);
    
    const deck = await prisma.deck.create({
      data: {
        title: `Mimikara N3 - ${u.title}`,
        description: `${u.jp}: ${u.desc}`,
        category: 'VOCABULARY',
        isPublic: true,
        tags: `Mimikara, N3, Unit ${u.unit}, Free`,
        userId: demoUser.id,
      },
    });

    const cardsData = words.map(w => {
      const hanVietStr = w.hanViet ? ` [${w.hanViet}]` : '';
      const fullMeaning = `${w.meaning}${hanVietStr}${w.enMeaning ? ` (${w.enMeaning})` : ''}`;
      return {
        deckId: deck.id,
        frontText: w.word,
        backReading: w.reading,
        backMeaning: fullMeaning,
        backText: w.example,
        backExamples: JSON.stringify([w.example]),
        status: 'NEW',
      };
    });

    await prisma.card.createMany({
      data: cardsData,
    });

    console.log(`  ✓ Unit ${u.unit}: ${u.title} (${cardsData.length} cards)`);
  }

  // Insert Grammar Deck
  const grammarDeck = await prisma.deck.create({
    data: {
      title: 'JLPT N3 Ngữ Pháp Trọng Tâm (100% Free)',
      description: 'Tổng hợp mẫu câu ngữ pháp N3 có giải thích và ví dụ chi tiết.',
      category: 'GRAMMAR',
      isPublic: true,
      tags: 'N3, Grammar, Bunpou, Free',
      userId: demoUser.id,
    },
  });

  const grammarCards = [
    {
      frontText: '〜ことにしている',
      backReading: 'koto ni shite iru',
      backMeaning: 'Quyết định / Thói quen do bản thân tự quy định [Quy định bản thân]',
      backText: '毎朝、30分ジョギングすることにしている。',
      backExamples: JSON.stringify(['寝る前にスマホを見ないことにしている。(Tôi tự quy định không nhìn điện thoại trước khi ngủ.)']),
      status: 'NEW',
    },
    {
      frontText: '〜ことになっている',
      backReading: 'koto ni natte iru',
      backMeaning: 'Quy định, luật lệ do tập thể / cơ quan đưa ra [Quy định chung]',
      backText: 'この部屋ではタバコを吸ってはいけないことになっている。',
      backExamples: JSON.stringify(['法律で禁止されている。(Được quy định cấm bởi luật pháp.)']),
      status: 'NEW',
    },
    {
      frontText: '〜ようにする',
      backReading: 'you ni suru',
      backMeaning: 'Cố gắng làm / không làm gì (nỗ lực hình thành thói quen)',
      backText: '野菜をたくさん食べるようにしています。',
      backExamples: JSON.stringify(['遅刻しないようにしてください。(Hãy cố gắng đừng đến muộn.)']),
      status: 'NEW',
    },
    {
      frontText: '〜わけがない',
      backReading: 'wake ga nai',
      backMeaning: 'Tuyệt đối không thể nào / Chắc chắn không...',
      backText: '彼がそんな嘘をつくわけがない。',
      backExamples: JSON.stringify(['こんな難しい問題、一分で解けるわけがない。(Bài toán khó thế này không thể nào giải trong 1 phút.)']),
      status: 'NEW',
    },
  ];

  await prisma.card.createMany({
    data: grammarCards.map(c => ({
      deckId: grammarDeck.id,
      ...c,
    })),
  });

  console.log('\n🎉 SEED HOÀN TẤT THÀNH CÔNG! ĐÃ TẠO TOÀN BỘ 12 UNIT (880 TỪ CHUẨN GỐC) + NGỮ PHÁP!');
}

main()
  .catch(e => {
    console.error('❌ Lỗi seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
