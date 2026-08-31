import { NextResponse } from 'next/server';
import { N3_SYSTEM_PROMPTS } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey.includes('your-openai-api-key')) {
      const lastUserMsg = messages?.[messages.length - 1]?.content || 'Xin chào Sensei';
      const mockReply = `こんにちは！ (Konnichiwa!) N3 Sensei đây. 
Về thắc mắc của bạn ("${lastUserMsg}"):
Trong kỳ thi JLPT N3, điều quan trọng nhất là bạn cần nắm vững khoảng 3000 từ vựng và 100+ mẫu cấu trúc ngữ pháp trọng tâm.

Bạn muốn tôi hướng dẫn về:
1. Từ vựng N3 hay gặp
2. Phân biệt các cấu trúc ngữ pháp dễ nhầm lẫn
3. Mẹo làm bài thi Nghe/Đọc hiểu N3?`;

      return NextResponse.json({ message: { role: 'assistant', content: mockReply } });
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
          { role: 'system', content: N3_SYSTEM_PROMPTS.TUTOR_CHAT },
          ...(messages || []),
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const reply = data.choices[0].message;

    return NextResponse.json({ message: reply });
  } catch (error: any) {
    return NextResponse.json({ error: 'AI Tutor Chat error' }, { status: 500 });
  }
}
