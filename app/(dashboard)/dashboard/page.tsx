import { prisma } from '@/lib/prisma';
import { getDefaultDecks } from '@/lib/default-decks';
import { DashboardClientView } from '@/components/dashboard/DashboardClientView';

export const revalidate = 0;

export default async function DashboardPage() {
  // Fetch all 12 units in chronological order, with static fallback
  let rawDecks: any[] = [];
  try {
    rawDecks = await prisma.deck.findMany({
      include: {
        _count: { select: { cards: true } },
        cards: { select: { id: true, dueDate: true, status: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  } catch (e) {
    rawDecks = [];
  }

  const decks = (rawDecks && rawDecks.length > 0)
    ? rawDecks.map((d: any) => ({
        id: d.id,
        title: d.title,
        description: d.description || '',
        category: d.category || 'VOCABULARY',
        totalCards: d._count?.cards ?? (d.cards?.length || 0),
        dueCardsCount: d.cards ? d.cards.filter((c: any) => new Date(c.dueDate) <= new Date() || c.status === 'NEW').length : (d._count?.cards || 0),
      }))
    : getDefaultDecks().map((d) => ({
        id: d.id,
        title: d.title,
        description: d.description || '',
        category: d.category || 'VOCABULARY',
        totalCards: d.totalCards,
        dueCardsCount: d.dueCardsCount,
      }));

  let totalCards = 0;
  let totalDue = 0;

  decks.forEach((deck: any) => {
    totalCards += deck.totalCards;
    totalDue += deck.dueCardsCount;
  });

  return (
    <DashboardClientView
      initialDecks={decks}
      totalCards={totalCards}
      totalDue={totalDue}
    />
  );
}
