import { PrismaClient } from '@prisma/client';
import { getMimikaraUnits } from './data/mimikara_n3_880';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting N3 Master AI Database Seed: 12 Units Mimikara Oboeru N3...');

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

  console.log(`👤 Configured 100% Free User: ${demoUser.email}`);

  // Delete previous public decks to avoid duplicate on re-seed
  const existingDecks = await prisma.deck.findMany({
    where: { userId: demoUser.id },
  });
  if (existingDecks.length > 0) {
    console.log(`🧹 Clearing ${existingDecks.length} old decks...`);
    await prisma.card.deleteMany({
      where: { deckId: { in: existingDecks.map((d) => d.id) } },
    });
    await prisma.deck.deleteMany({
      where: { userId: demoUser.id },
    });
  }

  // 2. Generate and Insert all 12 Units
  const units = getMimikaraUnits();

  for (const unit of units) {
    console.log(`📦 Creating ${unit.title} (${unit.words.length} cards)...`);

    const deck = await prisma.deck.create({
      data: {
        title: `Mimikara N3 - ${unit.title}`,
        description: `${unit.japaneseTitle}: ${unit.description}`,
        category: 'VOCABULARY',
        isPublic: true,
        tags: `Mimikara, N3, Unit ${unit.unitNumber}, Goi, Free`,
        userId: demoUser.id,
      },
    });

    const cardsToInsert = unit.words.map((w) => ({
      deckId: deck.id,
      frontText: w.word,
      backReading: w.reading,
      backMeaning: w.meaning,
      backText: w.example,
      backExamples: JSON.stringify([w.example]),
      kanjiBreakdown: w.kanji ? JSON.stringify(w.kanji) : null,
      status: 'NEW',
    }));

    await prisma.card.createMany({
      data: cardsToInsert,
    });

    console.log(`  ✓ Successfully added ${cardsToInsert.length} cards to ${unit.title}`);
  }

  // 3. Create Deck: Ngữ pháp N3 Trọng Tâm
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

  const grammarCardsData = [
    {
      frontText: '〜ことにしている',
      backReading: 'koto ni shite iru',
      backMeaning: 'Quyết định / Thói quen do bản thân tự quy định [Quy định bản thân]',
      backText: '毎朝、30分ジョギングすることにしている。',
      backExamples: JSON.stringify([
        '寝る前にスマホを見ないことにしている。(Tôi tự quy định không nhìn điện thoại trước khi ngủ.)',
      ]),
    },
    {
      frontText: '〜ことになっている',
      backReading: 'koto ni natte iru',
      backMeaning: 'Quy định, luật lệ do tập thể / cơ quan đưa ra [Quy định chung]',
      backText: 'この部屋ではタバコを吸ってはいけないことになっている。',
      backExamples: JSON.stringify([
        '法律で禁止されている。(Được quy định cấm bởi luật pháp.)',
      ]),
    },
    {
      frontText: '〜ようにする',
      backReading: 'you ni suru',
      backMeaning: 'Cố gắng làm / không làm gì (nỗ lực hình thành thói quen)',
      backText: '野菜をたくさん食べるようにしています。',
      backExamples: JSON.stringify([
        '遅刻しないようにしてください。(Hãy cố gắng đừng đến muộn.)',
      ]),
    },
    {
      frontText: '〜わけがない',
      backReading: 'wake ga nai',
      backMeaning: 'Tuyệt đối không thể nào / Chắc chắn không...',
      backText: '彼がそんな嘘をつくわけがない。',
      backExamples: JSON.stringify([
        'こんな難しい問題、一分で解けるわけがない。(Bài toán khó thế này không thể nào giải trong 1 phút.)',
      ]),
    },
  ];

  await prisma.card.createMany({
    data: grammarCardsData.map((c) => ({
      deckId: grammarDeck.id,
      frontText: c.frontText,
      backReading: c.backReading,
      backMeaning: c.backMeaning,
      backText: c.backText,
      backExamples: c.backExamples,
      status: 'NEW',
    })),
  });

  console.log('✅ Seed completed successfully: 12 Units Mimikara N3 (880 words) + Grammar ready & 100% Free!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
