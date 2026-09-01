import { NextResponse } from 'next/server';
import { N3_SYSTEM_PROMPTS } from '@/lib/ai';
import { PRESET_N3_MOCK_EXAM } from '@/lib/mock-exam';

const FALLBACK_QUIZ_POOL = [
  {
    question: '遠慮しないで、どうぞ____食べてください。',
    options: ['たくさん', 'すこし', 'あまり', 'ぜんぜん'],
    correctIndex: 0,
    explanation: '遠慮しないで (xin đừng ngại) đi với たくさん (nhiều) để thể hiện sự hiếu khách chu đáo.',
  },
  {
    question: '健康のために、毎朝ジョギング____にしている。',
    options: ['こと', 'もの', 'よう', 'わけ'],
    correctIndex: 0,
    explanation: '〜ことにしている thể hiện quyết tâm / thói quen cá nhân tự mình quy định.',
  },
  {
    question: '天気予報____と、明日は雨が降るそうだ。',
    options: ['によると', 'によって', 'について', 'として'],
    correctIndex: 0,
    explanation: '〜によると đi với truyền đạt そうだ để trích dẫn nguồn thông tin.',
  },
  {
    question: '彼女がそんなひどいことを言う____がない。きっと誤解だ。',
    options: ['わけ', 'はず', 'つもり', 'とおり'],
    correctIndex: 0,
    explanation: '〜わけがない: Tuyệt đối không thể nào / chắc chắn không có chuyện đó.',
  },
  {
    question: 'お客様____対して、いつも丁寧な言葉遣いを心がけてください。',
    options: ['に', 'を', 'で', 'から'],
    correctIndex: 0,
    explanation: '〜に対して (Ni taishite): Hướng tới đối tượng (khách hàng, cấp trên...).',
  },
  {
    question: 'スープが温かい____、早く召し上がってください。',
    options: ['うちに', 'あいだに', 'までに', 'ながら'],
    correctIndex: 0,
    explanation: '〜うちに: Tranh thủ trong lúc trạng thái tốt còn đang duy trì (súp còn nóng).',
  },
  {
    question: '旅行の【日程】を友達と相談して決めた。 (Chọn cách đọc)',
    options: ['にちてい', 'にってい', 'ひってい', 'にちじょう'],
    correctIndex: 1,
    explanation: '【日程】có cách đọc là にってい (nittei - Lịch trình, kế hoạch ngày).',
  },
  {
    question: '先生の指示に【従っ】て行動してください。 (Chọn cách đọc)',
    options: ['したがっ', 'うばっ', 'ならっ', 'かよっ'],
    correctIndex: 0,
    explanation: '【従う】có cách đọc là したがう (shitagau - Tuân theo chỉ thị).',
  },
  {
    question: '彼はいつも【しんけんに】仕事に取り組んでいる。 (Chọn Hán tự)',
    options: ['真険に', '真剣に', '真検に', '真件に'],
    correctIndex: 1,
    explanation: '【しんけん】được viết là 【真剣】(Chân kiếm - Nghiêm túc).',
  },
];

export async function POST(req: Request) {
  try {
    const { category } = await req.json(); // VOCAB, GRAMMAR, READING, LISTENING
    const apiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    // 1. Google Gemini Key
    if (geminiKey && !geminiKey.includes('your-gemini-api-key')) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: N3_SYSTEM_PROMPTS.QUIZ_GENERATION }] },
              contents: [{ role: 'user', parts: [{ text: `Hãy tạo bộ 3 câu hỏi trắc nghiệm JLPT N3 phần ${category || 'Từ vựng & Ngữ pháp'}` }] }],
              generationConfig: {
                temperature: 0.7,
                responseMimeType: 'application/json',
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const gData = await geminiRes.json();
          const rawJson = gData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawJson) {
            const parsed = JSON.parse(rawJson);
            const quizList = Array.isArray(parsed) ? parsed : parsed.questions || parsed.quiz || [];
            if (quizList.length > 0) {
              return NextResponse.json({ quiz: quizList });
            }
          }
        }
      } catch (err) {
        console.warn('Gemini Quiz fallback:', err);
      }
    }

    // 2. OpenAI Key
    if (apiKey && !apiKey.includes('your-openai-api-key') && apiKey.startsWith('sk-')) {
      try {
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

        if (response.ok) {
          const data = await response.json();
          const quiz = JSON.parse(data.choices[0].message.content);
          return NextResponse.json({ quiz: Array.isArray(quiz) ? quiz : quiz.questions || quiz.quiz || [] });
        }
      } catch (err) {
        console.warn('OpenAI Quiz fallback:', err);
      }
    }

    // 3. Smart Offline Mock Quiz: Chọn ngẫu nhiên 3 câu hỏi từ ngân hàng câu hỏi N3
    const shuffled = [...FALLBACK_QUIZ_POOL].sort(() => 0.5 - Math.random());
    const selected3 = shuffled.slice(0, 3);

    return NextResponse.json({ quiz: selected3 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Quiz generation error' }, { status: 500 });
  }
}
