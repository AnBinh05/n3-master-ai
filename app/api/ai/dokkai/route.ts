import { NextResponse } from 'next/server';
import { callAIWithFallbacks } from '@/lib/ai-provider';
import { DokkaiPassage, PRESET_DOKKAI_PASSAGES } from '@/lib/dokkai-data';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic = 'Đời sống Nhật Bản', level = 'short' } = body;

    const systemPrompt = `Bạn là N3 Dokkai Master - Chuyên gia biên soạn bài đọc hiểu tiếng Nhật JLPT N3 dành cho người học còn yếu.
Nhiệm vụ: Tạo 1 bài đọc hiểu trình độ N3 chuẩn cấu trúc, kèm phân tích câu, từ vựng và câu hỏi trắc nghiệm.

Quy định cấu trúc JSON bắt buộc trả về:
{
  "id": "ai_gen_${Date.now()}",
  "title": "Tiêu đề tiếng Việt ngắn gọn của bài đọc",
  "level": "${level}",
  "levelLabel": "${level === 'warmup' ? 'Khởi động (Siêu ngắn)' : level === 'short' ? 'Đoản văn N3' : level === 'medium' ? 'Trung văn N3' : 'Tìm kiếm thông tin'}",
  "category": "${topic}",
  "badgeColor": "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  "estimatedMinutes": 3,
  "targetSkill": "Kỹ năng rèn luyện chính cho người yếu",
  "plainPassage": "Văn bản tiếng Nhật chuẩn N3 không furigana",
  "furiganaPassage": "Văn bản tiếng Nhật có thẻ <ruby>漢字<rt>kanji</rt></ruby> cho các chữ Hán",
  "preReadingVocab": [
    { "word": "Từ vựng", "reading": "Cách đọc", "hanViet": "Âm Hán Việt", "meaning": "Nghĩa tiếng Việt" }
  ],
  "grammarNotes": ["Cấu trúc N3 xuất hiện trong bài kèm dịch"],
  "sentenceBreakdown": [
    {
      "sentenceIndex": 0,
      "jp": "Câu tiếng Nhật",
      "vi": "Dịch nghĩa tiếng Việt chuẩn",
      "subject": "Chủ ngữ chính",
      "predicate": "Vị ngữ chính",
      "connector": "Từ nối nếu có (VD: しかし, つまり)",
      "isClue": true
    }
  ],
  "questions": [
    {
      "id": 1,
      "question": "Câu hỏi tiếng Nhật trắc nghiệm?",
      "options": ["Đáp án 1", "Đáp án 2", "Đáp án 3", "Đáp án 4"],
      "correctIndex": 0,
      "explanation": "Giải thích chi tiết tại sao đáp án đúng",
      "trapAnalysis": [
        { "optionIndex": 1, "reason": "Tại sao đáp án này là bẫy" },
        { "optionIndex": 2, "reason": "Tại sao đáp án này là bẫy" },
        { "optionIndex": 3, "reason": "Tại sao đáp án này là bẫy" }
      ],
      "clueSentenceIndices": [0],
      "tacticalHint": "Gợi ý mẹo làm bài nhanh cho người yếu"
    }
  ]
}

Chỉ trả về JSON duy nhất, không kèm markdown \`\`\`json ngoài.`;

    const aiRes = await callAIWithFallbacks({
      systemPrompt,
      prompt: `Hãy tạo 1 bài đọc hiểu N3 về chủ đề: ${topic} với độ khó cấp độ ${level}.`,
      temperature: 0.6,
    });

    if (aiRes) {
      try {
        const cleanJson = aiRes.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsedData: DokkaiPassage = JSON.parse(cleanJson);
        parsedData.isAiGenerated = true;
        return NextResponse.json({ passage: parsedData });
      } catch (err) {
        console.error('Failed to parse AI Dokkai JSON:', err);
      }
    }

    // Fallback: Lấy 1 bài ngẫu nhiên từ preset passages
    const fallbackPassage = PRESET_DOKKAI_PASSAGES[Math.floor(Math.random() * PRESET_DOKKAI_PASSAGES.length)];
    return NextResponse.json({ 
      passage: {
        ...fallbackPassage,
        id: `ai_fallback_${Date.now()}`,
        isAiGenerated: true,
        title: `[AI Studio] ${fallbackPassage.title}`
      } 
    });

  } catch (error: any) {
    console.error('Dokkai AI error:', error);
    return NextResponse.json({ error: 'Failed to generate Dokkai passage' }, { status: 500 });
  }
}
