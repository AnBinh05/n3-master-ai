import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkAiQuota } from '@/lib/stripe';
import { N3_SYSTEM_PROMPTS } from '@/lib/ai';
import { ALL_880_WORDS } from '@/prisma/data/mimikara_n3_880';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    const userPlan = ((session?.user as any)?.plan || 'FREE') as 'FREE' | 'PRO';

    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });

    // Quota Check if user exists in DB
    if (userId) {
      const dbUser = await prisma.user.findUnique({ where: { id: userId } });
      if (dbUser) {
        const quota = await checkAiQuota(userId, userPlan, dbUser.aiUsageToday, dbUser.lastAiResetDate);
        if (!quota.allowed) {
          return NextResponse.json({
            error: 'Bạn đã dùng hết lượt AI hôm nay! Vui lòng nâng cấp gói để tiếp tục.',
            isQuotaExceeded: true,
          }, { status: 429 });
        }

        // Increment usage
        await prisma.user.update({
          where: { id: userId },
          data: { aiUsageToday: dbUser.aiUsageToday + 1 },
        });
      }
    }

    // Call OpenAI or Smart Lookup Fallback generator if key not provided
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey.includes('your-openai-api-key')) {
      // 1. Look up directly in 880 Mimikara N3 Database
      const matched = ALL_880_WORDS.find(
        (w) => w.word === prompt || w.reading.includes(prompt) || prompt.includes(w.word)
      );

      if (matched) {
        return NextResponse.json({
          card: {
            frontText: matched.word,
            backReading: matched.reading,
            backMeaning: matched.meaning,
            backText: matched.example,
            backExamples: [
              matched.example,
              `【N3 Ví dụ bổ sung】: ${matched.word}を正しく使えるように練習しましょう。`,
            ],
            kanjiBreakdown: matched.hanViet
              ? [{ kanji: matched.word[0] || '語', meaning: matched.hanViet }]
              : [{ kanji: matched.word[0] || '語', meaning: 'Hán tự N3' }],
          },
        });
      }

      // 2. Generic smart mockup for custom terms
      const mockResult = {
        frontText: prompt,
        backReading: prompt,
        backMeaning: `[Từ vựng N3]: ${prompt}`,
        backText: `この問題は「${prompt}」に関係しています。`,
        backExamples: [
          `「${prompt}」について詳しく調べましょう。(Hãy tìm hiểu kỹ về "${prompt}".)`,
          `日常会話で「${prompt}」をよく使います。(Trong hội thoại thường dùng "${prompt}".)`,
        ],
        kanjiBreakdown: [
          { kanji: prompt[0] || '語', meaning: 'Hán tự N3' },
        ],
      };
      return NextResponse.json({ card: mockResult });
    }

    // Real OpenAI API fetch
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: N3_SYSTEM_PROMPTS.CARD_GENERATOR },
          { role: 'user', content: `Hãy tạo thẻ N3 hoàn chỉnh cho từ/ngữ pháp này: ${prompt}` },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const parsedCard = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({ card: parsedCard });
  } catch (error: any) {
    console.error('Error in AI card generator:', error);
    return NextResponse.json({ error: 'AI Generator error' }, { status: 500 });
  }
}
