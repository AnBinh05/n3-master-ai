import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/decks - Fetch all decks for current user (plus public decks)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    const decks = await prisma.deck.findMany({
      where: {
        OR: [
          ...(userId ? [{ userId }] : []),
          { isPublic: true },
        ],
      },
      include: {
        _count: {
          select: { cards: true },
        },
        cards: {
          select: {
            id: true,
            dueDate: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const formattedDecks = decks.map((deck) => {
      const now = new Date();
      const dueCardsCount = deck.cards.filter(
        (c) => new Date(c.dueDate) <= now || c.status === 'NEW'
      ).length;

      return {
        id: deck.id,
        title: deck.title,
        description: deck.description,
        category: deck.category,
        isPublic: deck.isPublic,
        tags: deck.tags,
        totalCards: deck._count.cards,
        dueCardsCount,
        createdAt: deck.createdAt,
      };
    });

    return NextResponse.json({ decks: formattedDecks });
  } catch (error: any) {
    console.error('Error fetching decks:', error);
    return NextResponse.json({ error: 'Failed to fetch decks' }, { status: 500 });
  }
}

// POST /api/decks - Create new deck
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, category, tags, isPublic } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const deck = await prisma.deck.create({
      data: {
        title,
        description,
        category: category || 'VOCABULARY',
        tags,
        isPublic: Boolean(isPublic),
        userId,
      },
    });

    return NextResponse.json({ deck });
  } catch (error: any) {
    console.error('Error creating deck:', error);
    return NextResponse.json({ error: 'Failed to create deck' }, { status: 500 });
  }
}
