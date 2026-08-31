import { NextResponse } from 'next/server';
import { N3_SYSTEM_PROMPTS } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { sentence } = await req.json();
    if (!sentence) return NextResponse.json({ error: 'Sentence required' }, { status: 400 });

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey.includes('your-openai-api-key')) {
      // Mock sentence correction feedback
      const correction = {
        original: sentence,
        corrected: sentence.replace('食べるです', '食べます').replace('行くでした', '行きました'),
        isCorrect: !sentence.includes('食べるです'),
        score: sentence.includes('食べるです') ? 70 : 95,
        feedback: 'Câu của bạn khá tốt về mặt từ vựng, tuy nhiên trong văn phong JLPT N3, hãy chú ý cách chia thể thông thường / lịch sự chính xác.',
        grammarNotes: [
          'Động từ thể từ điển (V-ru) không ghép trực tiếp với です.',
          'Nên chuyển sang 食べます hoặc 食べるのです để tự nhiên hơn.'
        ]
      };
      return NextResponse.json({ correction });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: N3_SYSTEM_PROMPTS.SENTENCE_CORRECTION },
          { role: 'user', content: `Hãy sửa lỗi và nhận xét câu tiếng Nhật này giúp tôi: "${sentence}"` },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const correction = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({ correction });
  } catch (error: any) {
    return NextResponse.json({ error: 'Sentence correction failed' }, { status: 500 });
  }
}
