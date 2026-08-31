import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateSM2, Rating } from '@/lib/srs';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || 'demo_user_id';

    const { cardId, rating, durationMs } = await req.json();

    if (!cardId || !rating) {
      return NextResponse.json({ error: 'cardId and rating are required' }, { status: 400 });
    }

    // Fetch existing card state
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: { deck: true },
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    const stateBefore = {
      easeFactor: card.easeFactor,
      interval: card.interval,
      repetitions: card.repetitions,
      status: card.status,
    };

    // Calculate new SM-2 SRS state
    const sm2Result = calculateSM2(
      rating as Rating,
      card.easeFactor,
      card.interval,
      card.repetitions
    );

    // Update Card with new SRS values
    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        easeFactor: sm2Result.newEaseFactor,
        interval: sm2Result.newInterval,
        repetitions: sm2Result.newRepetitions,
        dueDate: sm2Result.nextDueDate,
        status: sm2Result.newStatus,
      },
    });

    // Create ReviewLog entry
    const reviewLog = await prisma.reviewLog.create({
      data: {
        cardId: card.id,
        userId: userId,
        deckId: card.deckId,
        rating: rating as Rating,
        stateBefore: JSON.stringify(stateBefore),
        stateAfter: JSON.stringify({
          easeFactor: sm2Result.newEaseFactor,
          interval: sm2Result.newInterval,
          repetitions: sm2Result.newRepetitions,
          status: sm2Result.newStatus,
        }),
        reviewDurationMs: durationMs || 2000,
      },
    });

    return NextResponse.json({
      success: true,
      card: updatedCard,
      nextDueDate: sm2Result.nextDueDate,
      newInterval: sm2Result.newInterval,
    });
  } catch (error: any) {
    console.error('Error submitting card review:', error);
    return NextResponse.json({ error: 'Failed to process review' }, { status: 500 });
  }
}
