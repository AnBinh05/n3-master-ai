import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getDefaultCardsForDeck, getAllDefaultCards } from '@/lib/default-decks';

// GET /api/cards?deckId=...
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const deckId = searchParams.get('deckId');

    if (!deckId) {
      try {
        const allCards = await prisma.card.findMany({
          take: 100,
          orderBy: { dueDate: 'asc' },
        });
        if (allCards.length > 0) {
          return NextResponse.json({ cards: allCards });
        }
      } catch (e) {
        console.warn('Prisma cards query failed, using static default cards:', e);
      }
      return NextResponse.json({ cards: getAllDefaultCards().slice(0, 100) });
    }

    try {
      const cards = await prisma.card.findMany({
        where: { deckId },
        orderBy: { createdAt: 'asc' },
      });

      if (cards && cards.length > 0) {
        return NextResponse.json({ cards });
      }
    } catch (e) {
      console.warn(`Prisma cards query for deck ${deckId} failed:`, e);
    }

    // Return static default cards for this deck
    return NextResponse.json({ cards: getDefaultCardsForDeck(deckId) });
  } catch (error: any) {
    console.error('Error fetching cards:', error);
    const { searchParams } = new URL(req.url);
    const deckId = searchParams.get('deckId');
    return NextResponse.json({ cards: deckId ? getDefaultCardsForDeck(deckId) : getAllDefaultCards().slice(0, 100) });
  }
}

// POST /api/cards - Add a new card or bulk add
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || 'demo_user';

    const body = await req.json();

    // Check if bulk insert
    if (Array.isArray(body.cards)) {
      const { deckId, cards } = body;
      if (!deckId) return NextResponse.json({ error: 'deckId required' }, { status: 400 });

      const created = await prisma.card.createMany({
        data: cards.map((c: any) => ({
          deckId,
          frontText: c.frontText,
          backReading: c.backReading || '',
          backMeaning: c.backMeaning,
          backText: c.backText || '',
          backExamples: typeof c.backExamples === 'string' ? c.backExamples : JSON.stringify(c.backExamples || []),
          kanjiBreakdown: typeof c.kanjiBreakdown === 'string' ? c.kanjiBreakdown : JSON.stringify(c.kanjiBreakdown || []),
          status: 'NEW',
        })),
      });

      return NextResponse.json({ count: created.count });
    }

    // Single card insert
    const { deckId, frontText, backReading, backMeaning, backText, backExamples, kanjiBreakdown, tags } = body;

    if (!deckId || !frontText || !backMeaning) {
      return NextResponse.json({ error: 'deckId, frontText, and backMeaning are required' }, { status: 400 });
    }

    const card = await prisma.card.create({
      data: {
        deckId,
        frontText,
        backReading: backReading || '',
        backMeaning,
        backText: backText || '',
        backExamples: typeof backExamples === 'string' ? backExamples : JSON.stringify(backExamples || []),
        kanjiBreakdown: typeof kanjiBreakdown === 'string' ? kanjiBreakdown : JSON.stringify(kanjiBreakdown || []),
        tags,
        status: 'NEW',
      },
    });

    return NextResponse.json({ card });
  } catch (error: any) {
    console.error('Error creating card:', error);
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
  }
}

// DELETE /api/cards - Delete card by id
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cardId = searchParams.get('id');

    if (!cardId) {
      return NextResponse.json({ error: 'Card ID required' }, { status: 400 });
    }

    await prisma.card.delete({
      where: { id: cardId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
  }
}
