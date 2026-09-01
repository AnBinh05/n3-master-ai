const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const deckCount = await prisma.deck.count();
  const cardCount = await prisma.card.count();
  const userCount = await prisma.user.count();
  const decks = await prisma.deck.findMany({ select: { id: true, title: true, isPublic: true, _count: { select: { cards: true } } } });
  console.log(JSON.stringify({ deckCount, cardCount, userCount, decks }, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
