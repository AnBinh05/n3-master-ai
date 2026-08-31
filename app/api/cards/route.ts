import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/cards?deckId=...
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const deckId = searchParams.get('deckId');

    if (!deckId) {
      // If no deckId provided, fetch all cards for review
      const allCards = await prisma.card.findMany({
        take: 50,
        orderBy: { dueDate: 'asc' },
      });
      return NextResponse.json({ cards: allCards });
    }

    const cards = await prisma.card.findMany({
      where: { deckId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ cards });
  } catch (error: any) {
    console.error('Error fetching cards:', error);
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
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
