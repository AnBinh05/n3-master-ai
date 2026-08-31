import { NextResponse } from 'next/server';
import { N3_SYSTEM_PROMPTS } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();
    if (!topic) return NextResponse.json({ error: 'Topic is required' }, { status: 400 });

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey.includes('your-openai-api-key')) {
      // Mock high-quality explanation for demo
      const explanation = `### 📖 Giải thích chi tiết JLPT N3: **${topic}**

#### 1. Ý nghĩa cốt lõi
Cấu trúc **${topic}** được dùng phổ biến trong đề thi JLPT N3 để diễn tả sự cố gắng, thói quen hoặc quy định tự bản thân mình tạo ra.

#### 2. Cấu trúc ngữ pháp
- **V-ru / V-nai + ${topic}**

#### 3. Bẫy đề thi JLPT N3 cần tránh
- Đừng nhầm lẫn với **〜ことになっている** (quy định của tập thể/công ty/luật pháp).
- **${topic}** nhấn mạnh vào ý chí và quyết tâm cá nhân người nói!

#### 4. Ví dụ thực tế
1. **健康のために、毎日野菜を食べることにしている。**
   *(Vì sức khỏe, tôi tự quy định mỗi ngày đều ăn nhiều rau.)*
2. **夜10時以降はスマホを見ないことにしている。**
   *(Tôi tự đặt luật cho mình là không xem điện thoại sau 10h đêm.)*`;

      return NextResponse.json({ explanation });
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
          { role: 'system', content: N3_SYSTEM_PROMPTS.EXPLAINER },
          { role: 'user', content: `Hãy giải thích chi tiết điểm ngữ pháp / từ vựng JLPT N3 này: ${topic}` },
        ],
        temperature: 0.5,
      }),
    });

    const data = await response.json();
    const explanation = data.choices[0].message.content;

    return NextResponse.json({ explanation });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to generate explanation' }, { status: 500 });
  }
}
