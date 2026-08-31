import { NextResponse } from 'next/server';
import { N3_SYSTEM_PROMPTS } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { category } = await req.json(); // VOCAB, GRAMMAR, READING, LISTENING
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey.includes('your-openai-api-key')) {
      // High quality N3 Mock Quiz fallback
      const mockQuiz = [
        {
          question: '遠慮しないで、どうぞ____食べてください。',
          options: ['たくさん', 'すこし', 'あまり', 'ぜんぜん'],
          correctIndex: 0,
          explanation: '遠慮しないで (xin đừng ngại) đi với たくさん (nhiều) để thể hiện sự hiếu khách chu đáo.'
        },
        {
          question: '健康のために、毎朝ジョギング____にしている。',
          options: ['こと', 'もの', 'よう', 'わけ'],
          correctIndex: 0,
          explanation: '〜ことにしている thể hiện quyết tâm / thói quen cá nhân tự mình quy định.'
        },
        {
          question: '天気予報____と、明日は雨が降るそうだ。',
          options: ['によると', 'によって', 'について', 'として'],
          correctIndex: 0,
          explanation: '〜によると đi với truyền đạt そうだ để trích dẫn nguồn thông tin.'
        }
      ];

      return NextResponse.json({ quiz: mockQuiz });
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
          { role: 'system', content: N3_SYSTEM_PROMPTS.QUIZ_GENERATION },
          { role: 'user', content: `Hãy tạo bộ 3 câu hỏi trắc nghiệm JLPT N3 phần ${category || 'Từ vựng & Ngữ pháp'}` },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const quiz = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({ quiz: Array.isArray(quiz) ? quiz : quiz.questions || quiz.quiz || [] });
  } catch (error: any) {
    return NextResponse.json({ error: 'Quiz generation error' }, { status: 500 });
  }
}
